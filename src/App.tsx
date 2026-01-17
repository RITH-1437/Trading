import { useState, useEffect } from 'react';
import { TradingTrade, DisciplineRules } from './types';
import { 
  getTradingTrades, 
  saveTradingTrades, 
  getDisciplineRules, 
  saveDisciplineRules,
  clearAllData 
} from './storage';
import { 
  getTodayTrades, 
  getTodayDate,
  getStartingBalanceForNewTrade 
} from './utils';
import { DailyInput } from './components/DailyInput';
import { DailySummary } from './components/DailySummary';
import { DisciplineStatus } from './components/DisciplineStatus';
import { HistoryTable } from './components/HistoryTable';
import { TotalSummary } from './components/TotalSummary';
import { BalanceChart } from './components/BalanceChart';

/**
 * Main App Component
 * Trading Discipline Dashboard - Multiple trades per day
 */
function App() {
  const [trades, setTrades] = useState<TradingTrade[]>([]);
  const [rules, setRules] = useState<DisciplineRules>({ maxDailyLossPercent: 6, dailyProfitTargetPercent: 16.5 });

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const loadedTrades = getTradingTrades();
      const loadedRules = getDisciplineRules();
      setTrades(loadedTrades);
      setRules(loadedRules);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load saved data. Starting fresh.');
    }
  }, []);

  // Save trades to localStorage whenever they change
  useEffect(() => {
    if (trades.length > 0) {
      saveTradingTrades(trades);
    }
  }, [trades]);

  // Save rules to localStorage whenever they change
  useEffect(() => {
    saveDisciplineRules(rules);
  }, [rules]);

  /**
   * Add a new trade
   */
  const handleAddTrade = (newTrade: Omit<TradingTrade, 'id' | 'timestamp' | 'date'>) => {
    const trade: TradingTrade = {
      ...newTrade,
      id: Date.now().toString(),
      timestamp: Date.now(),
      date: getTodayDate(),
    };
    setTrades([...trades, trade]);
  };

  /**
   * Delete a specific trade
   */
  const handleDeleteTrade = (tradeId: string) => {
    try {
      setTrades(trades.filter(t => t.id !== tradeId));
    } catch (error) {
      console.error('Error deleting trade:', error);
      alert('Failed to delete trade. Please try again.');
    }
  };

  /**
   * Clear all data
   */
  const handleClearAll = () => {
    try {
      setTrades([]);
      clearAllData();
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Failed to clear all data.');
    }
  };

  /**
   * Update discipline rules
   */
  const handleUpdateRules = (newRules: DisciplineRules) => {
    setRules(newRules);
  };

  // Calculate next trade number and last balance
  const nextTradeNumber = trades.length > 0 ? trades[trades.length - 1].tradeNumber + 1 : 1;
  const lastBalance = getStartingBalanceForNewTrade(trades);
  const todayTrades = getTodayTrades(trades);
  const todayTradesCount = todayTrades.length;

  // For compatibility, create days array (backward compatibility)
  const days = trades;

  return (
    <div className="min-h-screen bg-dark-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-dark-text mb-2">
            Trading Discipline Dashboard
          </h1>
          <p className="text-gray-400">
            Manual tracking for disciplined trading
          </p>
        </header>

        {/* Main Grid Layout */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Input, Rules, Chart */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trade Input and Rules Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DailyInput 
                  onAddTrade={handleAddTrade} 
                  nextTradeNumber={nextTradeNumber}
                  lastBalance={lastBalance}
                  todayTradesCount={todayTradesCount}
                />
                <DisciplineStatus 
                  latestDay={trades.length > 0 ? trades[trades.length - 1] : null}
                  rules={rules}
                  onUpdateRules={handleUpdateRules}
                  todayTrades={todayTrades}
                />
              </div>

              {/* Balance Chart - Full Width */}
              <BalanceChart latestDay={trades.length > 0 ? trades[trades.length - 1] : null} />
            </div>

            {/* Column 2: Total Summary */}
            <div className="space-y-6">
              <TotalSummary days={days} />
            </div>
          </div>

          {/* Trade History - Full Width */}
          {trades.length > 0 && (
            <div className="w-full">
              <h2 className="text-2xl font-bold text-dark-text mb-4">Trade History</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {trades.slice().reverse().map((trade, reverseIndex) => {
                  const actualIndex = trades.length - 1 - reverseIndex;
                  return (
                    <DailySummary 
                      key={trade.id}
                      day={trade}
                      dayIndex={actualIndex}
                      allDays={trades}
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
              days={trades}
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
