import React from 'react';
import { TradingDay } from '../types';
import { formatCurrency } from '../utils';

interface TotalSummaryProps {
  days: TradingDay[];
}

/**
 * TotalSummary Component
 * Displays aggregate statistics across all trading days
 */
export const TotalSummary: React.FC<TotalSummaryProps> = ({ days }) => {
  if (days.length === 0) return null;

  // Calculate total profit/loss
  const totalProfitLoss = days.reduce((sum, day) => sum + day.profitLoss, 0);
  
  // Calculate win/loss days
  const winDays = days.filter(day => day.profitLoss > 0).length;
  const lossDays = days.filter(day => day.profitLoss < 0).length;
  const breakEvenDays = days.filter(day => day.profitLoss === 0).length;
  
  // Calculate win rate
  const winRate = days.length > 0 ? (winDays / days.length) * 100 : 0;
  
  // Get current balance
  const startingBalance = days[0]?.startingBalance || 0;
  const currentBalance = startingBalance + totalProfitLoss;
  
  // Calculate ROI (protect against division by zero)
  const roi = startingBalance > 0 ? ((totalProfitLoss / startingBalance) * 100) : 0;

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-dark-text mb-6">Total Summary</h2>
      
      <div className="flex flex-col gap-4">
        <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <div className="text-gray-400 text-sm mb-1">Total P/L</div>
          <div className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
            {formatCurrency(totalProfitLoss)}
          </div>
        </div>
        
        <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <div className="text-gray-400 text-sm mb-1">Current Balance</div>
          <div className="text-2xl font-bold text-dark-text">
            {currentBalance.toFixed(2)}¢
          </div>
        </div>
        
        <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <div className="text-gray-400 text-sm mb-1">ROI</div>
          <div className={`text-2xl font-bold ${roi >= 0 ? 'text-profit' : 'text-loss'}`}>
            {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
          </div>
        </div>
        
        <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <div className="text-gray-400 text-sm mb-1">Win Rate</div>
          <div className="text-2xl font-bold text-dark-text">
            {winRate.toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <div className="text-gray-400 text-sm mb-1">Win Days</div>
          <div className="text-2xl font-bold text-profit">
            {winDays}
          </div>
        </div>
        
        <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <div className="text-gray-400 text-sm mb-1">Loss Days</div>
          <div className="text-2xl font-bold text-loss">
            {lossDays}
          </div>
        </div>
        
        <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <div className="text-gray-400 text-sm mb-1">Break Even</div>
          <div className="text-2xl font-bold text-warning">
            {breakEvenDays}
          </div>
        </div>
        
        <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <div className="text-gray-400 text-sm mb-1">Total Days</div>
          <div className="text-2xl font-bold text-dark-text">
            {days.length}
          </div>
        </div>
      </div>
    </div>
  );
};
