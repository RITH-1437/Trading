import React from 'react';
import { TradingDay } from '../types';
import { FinancialDonutChart } from './FinancialDonutChart';

interface BalanceChartProps {
  latestDay: TradingDay | null;
  allTrades?: TradingDay[];
  totalDeposits?: number;
  totalWithdrawals?: number;
}

/**
 * BalanceChart Component
 * Displays balance and profit as a circular progress chart
 */
export const BalanceChart: React.FC<BalanceChartProps> = ({ 
  latestDay, 
  allTrades = [],
  totalDeposits = 0, 
  totalWithdrawals = 0 
}) => {
  console.log('BalanceChart props:', { totalDeposits, totalWithdrawals, tradesCount: allTrades.length });
  
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

  // Calculate total profit/loss from all trades
  const totalProfitLoss = allTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-blue-500 transition-colors duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-dark-text">Balance Chart</h3>
      </div>
      <div className="flex justify-center py-2 pb-8">
        <FinancialDonutChart 
          deposits={totalDeposits}
          withdrawals={totalWithdrawals}
          loss={totalProfitLoss}
        />
      </div>
      
      {/* Deposit/Withdrawal Info - Always visible */}
      <div className="mt-4 pt-4 border-t border-dark-border space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-green-400 flex items-center gap-2">
            <span>📥</span>
            <span>Total Deposits:</span>
          </span>
          <span className="text-green-400 font-bold">
            +{totalDeposits.toFixed(2)}¢
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-yellow-400 flex items-center gap-2">
            <span>📤</span>
            <span>Total Withdrawals:</span>
          </span>
          <span className="text-yellow-400 font-bold">
            -{totalWithdrawals.toFixed(2)}¢
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`flex items-center gap-2 ${totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <span>📊</span>
            <span>Total Profit/Loss:</span>
          </span>
          <span className={`font-bold ${totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toFixed(2)}¢
          </span>
        </div>
        
        <div className="pt-2 border-t border-dark-border/50">
          <div className="flex items-center justify-between">
            <span className="text-blue-400 flex items-center gap-2">
              <span>💼</span>
              <span>Net Worth:</span>
            </span>
            <span className={`font-bold text-xl ${
              (totalDeposits - totalWithdrawals + totalProfitLoss) >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {(totalDeposits - totalWithdrawals + totalProfitLoss) >= 0 ? '+' : ''}
              {(totalDeposits - totalWithdrawals + totalProfitLoss).toFixed(2)}¢
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
