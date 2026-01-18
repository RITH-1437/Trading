# MT5 Integration Setup Guide

## 🚀 Setup Instructions

### Prerequisites

- Python 3.8 or higher
- MetaTrader 5 installed on your computer
- Firebase project with credentials

### Step 1: Install Python Dependencies

Open a terminal in the project folder and run:

```bash
pip install -r requirements.txt
```

This will install:

- `MetaTrader5` - MT5 API connector
- `firebase-admin` - Firebase integration
- `python-dotenv` - Environment variable management

### Step 2: Configure Firebase

1. Get your Firebase credentials JSON file:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the file as `firebase-credentials.json` in the project root

2. The file should be in the same folder as `mt5_connector.py`

### Step 3: Verify Environment Variables

Your credentials are already configured in `.env`:

```
MT5_ACCOUNT=159825187
MT5_PASSWORD=Iloveyou@096
MT5_SERVER=Exness-MT5Real20
```

⚠️ **Important**: Keep the `.env` file secure and never commit it to Git!

### Step 4: Start the MT5 Connector

1. Make sure MetaTrader 5 is running on your computer
2. Run the connector script:

```bash
python mt5_connector.py
```

You should see:

```
✅ Connected to MT5 account: 159825187
Server: Exness-MT5Real20
Balance: [Your current balance]
✅ Firebase initialized
🔄 Performing initial sync...
✅ Synced X trades to Firebase
🔄 Monitoring MT5 for new trades...
```

### Step 5: Start Your Web App

In another terminal, start your React app:

```bash
npm run dev
```

## 🔄 How It Works

1. **Automatic Sync**: The Python script monitors your MT5 account every 10 seconds
2. **Trade Detection**: When you close a position in MT5, it's automatically detected
3. **Firebase Update**: The trade data is synced to Firebase in real-time
4. **Web Display**: Your website updates automatically to show the new trade

## 📊 Trade Data Synced

For each closed position, the following data is synced:

- Trade ticket number (as trade ID)
- Starting balance (calculated from current balance - P/L)
- Profit/Loss (including commission and swap)
- Symbol (e.g., EURUSD, GBPUSD)
- Volume
- Trade time and date
- Trade type (Buy/Sell)

## 🛠️ Troubleshooting

### MT5 Connection Failed

- Ensure MT5 is running on your computer
- Verify your account credentials in `.env`
- Check if your account allows API access

### No Trades Appearing

- Check the terminal output for errors
- Verify Firebase credentials are correct
- Ensure trades are actually closed (not pending)

### Firebase Permission Denied

- Check your Firebase security rules
- Verify the service account has write permissions
- Confirm the credentials file path is correct

## 🔒 Security Notes

1. **Never share your `.env` file** - It contains sensitive credentials
2. **Add `.env` to `.gitignore`** - Prevent accidental commits
3. **Use environment variables in production** - Don't hardcode credentials

## 💡 Tips

- Keep the Python script running in the background for continuous sync
- The script will sync trades from the last 30 days on startup
- You can adjust the monitoring interval in `mt5_connector.py` (default: 10 seconds)
- The web interface will show your MT5 account number and server name

## 🎯 Next Steps

1. Test by closing a demo position in MT5
2. Watch the console for sync confirmation
3. Check your web dashboard for the new trade
4. Adjust discipline rules as needed

## ⚠️ Important Reminders

- This is for a **REAL ACCOUNT** - Be careful!
- The connector only **reads** data, it cannot place trades
- All calculations (discipline rules, P/L) are done automatically
- No more manual input needed!

---

**Support**: If you encounter issues, check the console output for detailed error messages.
