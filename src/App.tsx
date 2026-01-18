import { useState, useEffect } from 'react';
import { TradingTrade, DisciplineRules } from './types';
import { 
  subscribeTradingTrades,
  saveTradingTrades, 
  subscribeDisciplineRules,
  saveDisciplineRules,
  clearAllData,
  subscribeDepositWithdrawal
} from './storage';
import { 
  getTodayTrades, 
  getTodayDate,
  getStartingBalanceForNewTrade 
} from './utils';
import { MT5Status } from './components/MT5Status';
import { DailySummary } from './components/DailySummary';
import { DisciplineStatus } from './components/DisciplineStatus';
import { HistoryTable } from './components/HistoryTable';
import { TotalSummary } from './components/TotalSummary';
import { BalanceChart } from './components/BalanceChart';

/**
 * Main App Component
 * Trading Discipline Dashboard - Multiple trades per day with Firebase sync
 */
function App() {
  const [trades, setTrades] = useState<TradingTrade[]>([]);
  const [displayedTrades, setDisplayedTrades] = useState<TradingTrade[]>([]);
  const [rules, setRules] = useState<DisciplineRules>({ maxDailyLossPercent: 6, dailyProfitTargetPercent: 16.5 });
  const [depositWithdrawalTotals, setDepositWithdrawalTotals] = useState({ totalDeposits: 0, totalWithdrawals: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showAllTrades, setShowAllTrades] = useState(false);

  // Show only last 6 trades
  const INITIAL_TRADE_LIMIT = 6;

  // Subscribe to real-time Firebase updates
  useEffect(() => {
    // Show initial progress
    setLoadingProgress(10);
    
    try {
      // Subscribe to trades with error handling
      const unsubscribeTrades = subscribeTradingTrades(
        (newTrades) => {
          setLoadingProgress(70);
          setTrades(newTrades);
          // Only show recent trades initially to prevent freeze
          setDisplayedTrades(newTrades.slice(0, INITIAL_TRADE_LIMIT));
          setLoadingProgress(100);
          setError(null);
          // Clear loading immediately when data is received
          setLoading(false);
        },
        (err) => {
          console.error('Firebase error:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      // Subscribe to rules
      const unsubscribeRules = subscribeDisciplineRules((newRules) => {
        setRules(newRules);
      });

      // Subscribe to deposit/withdrawal data
      const unsubscribeDepositWithdrawal = subscribeDepositWithdrawal((totals) => {
        console.log('App received deposit/withdrawal totals:', totals);
        setDepositWithdrawalTotals(totals);
      });

      // Cleanup subscriptions on unmount
      return () => {
        unsubscribeTrades();
        unsubscribeRules();
        unsubscribeDepositWithdrawal();
      };
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  }, []);

  /**
   * Delete a specific trade
   */
  const handleDeleteTrade = async (tradeId: string) => {
    try {
      const newTrades = trades.filter(t => t.id !== tradeId);
      await saveTradingTrades(newTrades);
    } catch (error) {
      console.error('Error deleting trade:', error);
      alert('Failed to delete trade. Please try again.');
    }
  };

  /**
   * Clear all data
   */
  const handleClearAll = async () => {
    try {
      await clearAllData();
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Failed to clear all data.');
    }
  };

  /**
   * Update discipline rules
   */
  const handleUpdateRules = async (newRules: DisciplineRules) => {
    await saveDisciplineRules(newRules);
  };

  // Calculate today's trades for discipline status
  const todayTrades = getTodayTrades(trades);

  // Get last trade timestamp for MT5 status
  const lastTradeTime = trades.length > 0 ? trades[trades.length - 1].timestamp : undefined;

  // Handle show all trades
  const handleShowAllTrades = () => {
    setShowAllTrades(true);
    setDisplayedTrades(trades);
  };

  if (loading || error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          {error ? (
            <>
              <div className="text-6xl mb-6">⚠️</div>
              <div className="text-2xl font-bold text-red-500 mb-4">Database Connection Error</div>
              <div className="text-lg text-red-400 mb-6">{error}</div>
              
              <div className="bg-dark-card border border-red-500/30 rounded-lg p-6 text-left">
                <div className="text-lg font-semibold text-dark-text mb-3">📋 How to Fix:</div>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Go to <a href="https://console.firebase.google.com/project/trading-discipline/database/trading-discipline-default-rtdb/rules" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firebase Console - Database Rules</a></li>
                  <li>Make sure the rules are set to:
                    <pre className="bg-dark-bg rounded p-3 mt-2 text-sm overflow-x-auto">
{`{
  "rules": {
    ".read": true,
    ".write": true
  }
}`}
                    </pre>
                  </li>
                  <li>Click the <span className="text-primary font-bold">Publish</span> button (top right)</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
              
              <button 
                onClick={() => window.location.reload()} 
                className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors font-medium"
              >
                🔄 Refresh Page
              </button>
            </>
          ) : (
            <>
              <div className="text-4xl mb-4">⏳</div>
              <div className="text-xl text-dark-text mb-4">Loading your trading data...</div>
              <div className="w-64 bg-dark-border rounded-full h-2 mx-auto">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-400 mt-2">{loadingProgress}%</div>
              {trades.length > 0 && (
                <div className="text-sm text-primary mt-2">Loaded {trades.length} trades...</div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // For compatibility, create days array (backward compatibility)
  const days = displayedTrades;

  return (
    <div className="min-h-screen bg-dark-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-dark-text mb-2">
            Trading Discipline Dashboard
          </h1>
          <p className="text-gray-400">
            Auto-sync with MT5 • Real-time tracking
          </p>
        </header>

        {/* Main Grid Layout */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Input, Rules, Chart */}
            <div className="lg:col-span-2 space-y-6">
              {/* MT5 Status and Rules Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MT5Status 
                  tradesCount={trades.length}
                />
                <DisciplineStatus 
                  latestDay={trades.length > 0 ? trades[0] : null}
                  rules={rules}
                  onUpdateRules={handleUpdateRules}
                  todayTrades={todayTrades}
                />
              </div>

              {/* Balance Chart - Full Width */}
              <BalanceChart 
                latestDay={trades.length > 0 ? trades[0] : null}
                allTrades={trades}
                totalDeposits={depositWithdrawalTotals.totalDeposits}
                totalWithdrawals={depositWithdrawalTotals.totalWithdrawals}
              />
            </div>

            {/* Column 2: Total Summary */}
            <div className="space-y-6">
              <TotalSummary days={days} />
            </div>
          </div>

          {/* Trade History - Full Width */}
          {displayedTrades.length > 0 && (
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-dark-text">
                  Trade History ({displayedTrades.length} of {trades.length})
                </h2>
                {!showAllTrades && trades.length > INITIAL_TRADE_LIMIT && (
                  <button
                    onClick={handleShowAllTrades}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    Load All {trades.length} Trades
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayedTrades.slice(0, 6).map((trade, index) => {
                  return (
                    <DailySummary 
                      key={trade.id}
                      day={trade}
                      dayIndex={index}
                      allDays={displayedTrades}
                      rules={rules}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* History Table - Full Width */}
          <div className="w-full">
            <HistoryTable 
              days={displayedTrades.slice(0, 6)}
              rules={rules}
              onDeleteDay={handleDeleteTrade}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
