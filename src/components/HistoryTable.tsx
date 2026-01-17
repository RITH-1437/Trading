import React from 'react';
import { TradingDay, DisciplineRules } from '../types';
import { calculateDayStats, formatCurrency, formatPercentage } from '../utils';

interface HistoryTableProps {
  days: TradingDay[];
  rules: DisciplineRules;
  onDeleteDay: (dayId: string) => void;
  onClearAll: () => void;
}

/**
 * HistoryTable Component
 * Displays complete trading history in table format
 */
export const HistoryTable: React.FC<HistoryTableProps> = ({ 
  days, 
  rules,
  onDeleteDay,
  onClearAll 
}) => {
  if (days.length === 0) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-dark-text">History</h2>
        <p className="text-gray-500 text-center py-8">No trading days recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-3 w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-dark-text">History</h2>
        <button
          onClick={() => {
            if (window.confirm('Clear all data? This cannot be undone.')) {
              onClearAll();
            }
          }}
          className="text-sm text-loss hover:text-red-400 font-medium"
        >
          Clear All
        </button>
      </div>
      
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-2 px-2 text-gray-400 font-medium">Trade</th>
              <th className="text-right py-2 px-2 text-gray-400 font-medium">Start</th>
              <th className="text-right py-2 px-2 text-gray-400 font-medium">P/L</th>
              <th className="text-right py-2 px-2 text-gray-400 font-medium">Total</th>
              <th className="text-right py-2 px-2 text-gray-400 font-medium">DD</th>
              <th className="text-center py-2 px-2 text-gray-400 font-medium">Status</th>
              <th className="text-center py-2 px-2 text-gray-400 font-medium">Del</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, index) => {
              const stats = calculateDayStats(days, index, rules);
              const statusColor = 
                stats.status === 'TARGET_HIT' ? 'text-profit' :
                stats.status === 'MAX_LOSS' ? 'text-loss' : 'text-warning';
              
              return (
                <tr 
                  key={day.id} 
                  className="border-b border-dark-border/50 hover:bg-dark-bg/50 
                           transition-colors"
                >
                  <td className="py-2 px-2 text-dark-text font-medium">
                    {day.tradeNumber}
                  </td>
                  <td className="py-2 px-2 text-right text-dark-text text-xs">
                    {day.startingBalance.toFixed(0)}¢
                  </td>
                  <td className={`py-2 px-2 text-right font-medium text-xs ${
                    day.profitLoss >= 0 ? 'text-profit' : 'text-loss'
                  }`}>
                    {formatCurrency(day.profitLoss)}
                  </td>
                  <td className="py-2 px-2 text-right text-dark-text font-bold text-xs">
                    {stats.totalBalance.toFixed(0)}¢
                  </td>
                  <td className="py-2 px-2 text-right text-gray-400 text-xs">
                    {formatPercentage(stats.drawdown)}
                  </td>
                  <td className={`py-2 px-2 text-center text-[10px] font-semibold ${statusColor}`}>
                    {stats.status === 'TARGET_HIT' ? '🟢' : stats.status === 'MAX_LOSS' ? '🔴' : '🟡'}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete Trade #${day.tradeNumber}?`)) {
                          onDeleteDay(day.id);
                        }
                      }}
                      className="text-loss hover:text-red-400 text-[10px] font-medium"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
