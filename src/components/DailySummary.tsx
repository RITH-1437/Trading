import React from 'react';
import { TradingDay, DisciplineRules } from '../types';
import { calculateDayStats, formatCurrency, formatPercentage } from '../utils';

interface DailySummaryProps {
  day: TradingDay;
  dayIndex: number;
  allDays: TradingDay[];
  rules: DisciplineRules;
}

/**
 * DailySummary Component
 * Displays summary card for a single trading day
 */
export const DailySummary: React.FC<DailySummaryProps> = ({ 
  day, 
  dayIndex, 
  allDays,
  rules 
}) => {
  const stats = calculateDayStats(allDays, dayIndex, rules);
  
  const getStatusColor = () => {
    switch (stats.status) {
      case 'TARGET_HIT':
        return 'text-profit';
      case 'MAX_LOSS':
        return 'text-loss';
      default:
        return 'text-warning';
    }
  };
  
  const getPLColor = () => {
    return day.profitLoss >= 0 ? 'text-profit' : 'text-loss';
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-5 hover:border-blue-500 
                    transition-colors duration-200 min-w-[240px]">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-dark-text">Trade #{day.tradeNumber}</h3>
        <span className={`text-sm font-semibold ${stats.isWin ? 'text-profit' : 'text-loss'}`}>
          {stats.isWin ? 'WIN' : 'LOSS'}
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Start:</span>
          <span className="text-dark-text font-medium">{day.startingBalance.toFixed(2)}¢</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">P/L:</span>
          <span className={`font-medium ${getPLColor()}`}>
            {formatCurrency(day.profitLoss)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Total:</span>
          <span className="text-dark-text font-bold">{stats.totalBalance.toFixed(2)}¢</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Drawdown:</span>
          <span className="text-dark-text">{formatPercentage(stats.drawdown)}</span>
        </div>
        
        <div className="pt-2 mt-2 border-t border-dark-border">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Status:</span>
            <span className={`font-bold ${getStatusColor()}`}>
              {stats.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        
        {day.note && (
          <div className="pt-2 mt-2 border-t border-dark-border">
            <p className="text-xs text-gray-500 italic">"{day.note}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
