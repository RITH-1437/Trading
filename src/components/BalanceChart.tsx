import React from 'react';
import { TradingDay } from '../types';
import { CircularChart } from './CircularChart';

interface BalanceChartProps {
  latestDay: TradingDay | null;
}

/**
 * BalanceChart Component
 * Displays balance and profit as a circular progress chart
 */
export const BalanceChart: React.FC<BalanceChartProps> = ({ latestDay }) => {
  if (!latestDay) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-lg p-5 hover:border-blue-500 transition-colors duration-200">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-dark-text">Balance Chart</h3>
        </div>
        <p className="text-gray-500 text-center text-sm py-4">No data</p>
      </div>
    );
  }

  const profit = latestDay.profitLoss;
  const balance = latestDay.startingBalance + latestDay.profitLoss;
  const profitPercent = (profit / latestDay.startingBalance) * 100;

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-blue-500 transition-colors duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-dark-text">Balance Chart</h3>
      </div>
      <div className="flex justify-center py-8">
        <CircularChart 
          profit={profit}
          balance={balance}
          profitPercent={profitPercent}
        />
      </div>
    </div>
  );
};
