"""
MT5 Trading Connector
Automatically syncs closed trades from MT5 to Firebase Realtime Database
"""
import MetaTrader5 as mt5
import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime, timedelta
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class MT5Connector:
    def __init__(self):
        self.account = int(os.getenv('MT5_ACCOUNT', '159825187'))
        self.password = os.getenv('MT5_PASSWORD', '@Rith1506')
        self.server = os.getenv('MT5_SERVER', 'Exness-MT5Real20')
        self.last_processed_ticket = None
        self.db_ref = None
        
    def initialize_mt5(self):
        """Initialize MT5 connection with better error handling"""
        # First shutdown any existing connection
        mt5.shutdown()
        time.sleep(1)
        
        if not mt5.initialize():
            print(f"❌ MT5 initialization failed, error code: {mt5.last_error()}")
            return False
        
        # Login to MT5 account
        authorized = mt5.login(self.account, password=self.password, server=self.server)
        
        if not authorized:
            error = mt5.last_error()
            print(f"❌ Failed to connect to account #{self.account}")
            print(f"Error code: {error}")
            print(f"Make sure MT5 terminal is running and logged in!")
            mt5.shutdown()
            return False
        
        account_info = mt5.account_info()
        if account_info is None:
            print(f"❌ Failed to get account info")
            mt5.shutdown()
            return False
            
        print(f"✅ Connected to MT5 account: {self.account}")
        print(f"Server: {self.server}")
        print(f"Balance: ${account_info.balance:.2f}")
        print(f"Company: {account_info.company}")
        return True
    
    def check_connection(self):
        """Check if MT5 is still connected"""
        account_info = mt5.account_info()
        if account_info is None:
            return False
        return True
    
    def reconnect_mt5(self):
        """Attempt to reconnect to MT5"""
        print("🔄 Attempting to reconnect to MT5...")
        return self.initialize_mt5()
    
    def initialize_firebase(self):
        """Initialize Firebase connection"""
        try:
            # Check if already initialized
            firebase_admin.get_app()
            print("✅ Firebase already initialized")
        except ValueError:
            # Initialize Firebase with Realtime Database URL
            cred = credentials.Certificate('trading-discipline-firebase-adminsdk-fbsvc-87fcbedaa6.json')
            firebase_admin.initialize_app(cred, {
                'databaseURL': 'https://trading-discipline-default-rtdb.asia-southeast1.firebasedatabase.app'
            })
            print("✅ Firebase initialized")
        
        self.db_ref = db.reference()
        return True
    
    def get_closed_deals(self, days=7):
        """Get closed deals from the last N days"""
        # Get deals from the last N days
        from_date = datetime.now() - timedelta(days=days)
        to_date = datetime.now()
        
        deals = mt5.history_deals_get(from_date, to_date)
        
        if deals is None:
            print(f"No deals found, error code: {mt5.last_error()}")
            return []
        
        return deals
    
    def convert_deal_to_trade(self, deal, previous_balance):
        """Convert MT5 deal to your trade format"""
        profit_loss = deal.profit + deal.commission + deal.swap
        starting_balance = previous_balance
        
        # Get deal time
        deal_time = datetime.fromtimestamp(deal.time)
        
        # Get deal type string
        deal_type = "BUY" if deal.type == 0 else "SELL"
        
        trade_data = {
            'tradeNumber': deal.ticket,
            'startingBalance': round(starting_balance, 2),
            'profitLoss': round(profit_loss, 2),
            'note': f"{deal.symbol} | {deal_type} | Vol: {deal.volume}",
            'timestamp': int(deal.time * 1000),  # Convert to milliseconds
            'date': deal_time.strftime('%Y-%m-%d'),
            'id': str(deal.ticket),
            'mt5Ticket': deal.ticket,
            'symbol': deal.symbol,
            'volume': deal.volume,
        }
        
        return trade_data
    
    def update_connection_status(self, connected=True):
        """Update connection status in Firebase"""
        try:
            account_info = mt5.account_info()
            status_data = {
                'connected': connected,
                'lastUpdate': int(datetime.now().timestamp() * 1000),  # milliseconds
                'account': self.account,
                'server': self.server,
                'balance': account_info.balance if account_info else 0
            }
            self.db_ref.child('mt5Status').set(status_data)
        except Exception as e:
            print(f"Error updating status: {e}")
    
    def sync_trades_to_firebase(self):
        """Sync new trades to Firebase Realtime Database"""
        deals = self.get_closed_deals(days=30)
        
        if not deals:
            print("No deals to sync")
            # Update connection status even if no new trades
            self.update_connection_status(True)
            return
        
        # Filter only OUT deals (position closures)
        closed_positions = [d for d in deals if d.entry == 1]  # 1 = OUT
        
        if not closed_positions:
            print("No closed positions found")
            return
        
        print(f"Found {len(closed_positions)} closed positions")
        
        # Get current trades from Firebase
        trades_ref = self.db_ref.child('trades')
        existing_trades = trades_ref.get() or {}
        existing_tickets = {data.get('mt5Ticket') for data in existing_trades.values() if isinstance(data, dict) and 'mt5Ticket' in data}
        
        # Get account balance
        account_balance = mt5.account_info().balance
        
        new_trades_count = 0
        
        # Process deals in chronological order
        sorted_deals = sorted(closed_positions, key=lambda x: x.time)
        
        for deal in sorted_deals:
            # Skip if already synced
            if deal.ticket in existing_tickets:
                continue
            
            # Calculate starting balance (current balance - profit)
            starting_balance = account_balance - (deal.profit + deal.commission + deal.swap)
            
            trade_data = self.convert_deal_to_trade(deal, starting_balance)
            
            # Add to Firebase Realtime Database
            trades_ref.child(str(deal.ticket)).set(trade_data)
            print(f"✅ Synced trade #{deal.ticket}: {trade_data['symbol']} | P/L: {trade_data['profitLoss']}")
            
            new_trades_count += 1
        
        # Update connection status after syncing
        self.update_connection_status(True)
        print(f"\n✅ Synced {new_trades_count} new trades to Firebase")
    
    def monitor_continuous(self, interval=10):
        """Continuously monitor for new trades with auto-reconnection"""
        print("\n🔄 Monitoring MT5 for new trades...")
        print(f"Checking every {interval} seconds. Press Ctrl+C to stop.\n")
        
        retry_count = 0
        max_retries = 3
        
        try:
            while True:
                # Check connection health
                if not self.check_connection():
                    print(f"⚠️  Lost connection to MT5 (attempt {retry_count + 1}/{max_retries})")
                    self.update_connection_status(False)
                    
                    # Try to reconnect
                    if self.reconnect_mt5():
                        print("✅ Reconnected successfully!")
                        retry_count = 0
                    else:
                        retry_count += 1
                        if retry_count >= max_retries:
                            print("❌ Max reconnection attempts reached. Please check MT5 terminal.")
                            print("Make sure:")
                            print("1. MT5 terminal is running")
                            print("2. You are logged into your account")
                            print("3. Internet connection is stable")
                            print("\nWaiting 30 seconds before trying again...")
                            time.sleep(30)
                            retry_count = 0
                        else:
                            print(f"Waiting 5 seconds before retry...")
                            time.sleep(5)
                        continue
                
                # Connection is good, sync trades
                self.sync_trades_to_firebase()
                retry_count = 0  # Reset retry counter on success
                time.sleep(interval)
                
        except KeyboardInterrupt:
            print("\n⏹️  Monitoring stopped by user")
            self.shutdown()
    
    def shutdown(self):
        """Cleanup and shutdown"""
        mt5.shutdown()
        print("MT5 connection closed")

def main():
    connector = MT5Connector()
    
    # Initialize MT5
    if not connector.initialize_mt5():
        return
    
    # Initialize Firebase
    if not connector.initialize_firebase():
        connector.shutdown()
        return
    
    # Initial sync
    print("\n🔄 Performing initial sync...")
    connector.sync_trades_to_firebase()
    
    # Start continuous monitoring
    connector.monitor_continuous(interval=10)

if __name__ == "__main__":
    main()
