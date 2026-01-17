import { useState, useEffect } from 'react';
import { TradingDay, DisciplineRules } from './types';
import { 
  getTradingDays, 
  saveTradingDays, 
  getDisciplineRules, 
  saveDisciplineRules,
  clearAllData 
} from './storage';
import { calculateTotalBalance } from './utils';
import { DailyInput } from './components/DailyInput';
import { DailySummary } from './components/DailySummary';
import { DisciplineStatus } from './components/DisciplineStatus';
import { HistoryTable } from './components/HistoryTable';
import { TotalSummary } from './components/TotalSummary';
import { BalanceChart } from './components/BalanceChart';

/**
 * Main App Component
 * Trading Discipline Dashboard
 */
function App() {
  const [days, setDays] = useState<TradingDay[]>([]);
  const [rules, setRules] = useState<DisciplineRules>({ maxDailyLossPercent: 6, dailyProfitTargetPercent: 16.5 });

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const loadedDays = getTradingDays();
      const loadedRules = getDisciplineRules();
      setDays(loadedDays);
      setRules(loadedRules);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load saved data. Starting fresh.');
    }
  }, []);

  // Save days to localStorage whenever they change
  useEffect(() => {
    if (days.length > 0) {
      saveTradingDays(days);
    }
  }, [days]);

  // Save rules to localStorage whenever they change
  useEffect(() => {
    saveDisciplineRules(rules);
  }, [rules]);

  /**
   * Add a new trading day
   */
  const handleAddDay = (newDay: Omit<TradingDay, 'id' | 'timestamp'>) => {
    const day: TradingDay = {
      ...newDay,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setDays([...days, day]);
  };

  /**
   * Delete a specific day
   */
  const handleDeleteDay = (dayId: string) => {
    try {
      setDays(days.filter(d => d.id !== dayId));
    } catch (error) {
      console.error('Error deleting day:', error);
      alert('Failed to delete day. Please try again.');
    }
  };

  /**
   * Clear all data
   */
  const handleClearAll = () => {
    try {
      setDays([]);
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

  // Calculate next day number and last balance
  const nextDayNumber = days.length > 0 ? days[days.length - 1].dayNumber + 1 : 1;
  const lastBalance = days.length > 0 
    ? calculateTotalBalance(days, days.length - 1)
    : 1008.66;

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
              {/* Daily Input and Rules Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DailyInput 
                  onAddDay={handleAddDay} 
                  nextDayNumber={nextDayNumber}
                  lastBalance={lastBalance}
                />
                <DisciplineStatus 
                  latestDay={days.length > 0 ? days[days.length - 1] : null}
                  rules={rules}
                  onUpdateRules={handleUpdateRules}
                />
              </div>

              {/* Balance Chart - Full Width */}
              <BalanceChart latestDay={days.length > 0 ? days[days.length - 1] : null} />
            </div>

            {/* Column 2: Total Summary */}
            <div className="space-y-6">
              <TotalSummary days={days} />
            </div>
          </div>

          {/* Daily Summary Cards - Full Width */}
          {days.length > 0 && (
            <div className="w-full">
              <h2 className="text-2xl font-bold text-dark-text mb-4">Daily Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {days.slice().reverse().map((day, reverseIndex) => {
                  const actualIndex = days.length - 1 - reverseIndex;
                  return (
                    <DailySummary 
                      key={day.id}
                      day={day}
                      dayIndex={actualIndex}
                      allDays={days}
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
              days={days}
              rules={rules}
              onDeleteDay={handleDeleteDay}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
