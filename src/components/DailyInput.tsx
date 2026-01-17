import React, { useState } from 'react';
import { TradingTrade } from '../types';

interface TradeInputProps {
  onAddTrade: (trade: Omit<TradingTrade, 'id' | 'timestamp' | 'date'>) => void;
  nextTradeNumber: number;
  lastBalance: number;
  todayTradesCount: number;
}

/**
 * TradeInput Component
 * Form for adding new trading records (multiple per day)
 */
export const DailyInput: React.FC<TradeInputProps> = ({ 
  onAddTrade, 
  nextTradeNumber,
  lastBalance,
  todayTradesCount
}) => {
  const [startingBalance, setStartingBalance] = useState(lastBalance.toString());
  const [profitLoss, setProfitLoss] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedStart = parseFloat(startingBalance);
    const parsedPL = parseFloat(profitLoss);
    
    if (isNaN(parsedStart) || isNaN(parsedPL)) {
      alert('Please enter valid numbers');
      return;
    }
    
    if (parsedStart <= 0) {
      alert('Starting balance must be greater than 0');
      return;
    }
    
    if (Math.abs(parsedPL) > parsedStart * 10) {
      if (!window.confirm('P/L is very large compared to balance. Continue?')) {
        return;
      }
    }
    
    try {
      onAddTrade({
        tradeNumber: nextTradeNumber,
        startingBalance: parsedStart,
        profitLoss: parsedPL,
        note: note.trim() || undefined,
      });
      
      // Reset form but keep starting balance as last total
      setStartingBalance((parsedStart + parsedPL).toString());
      setProfitLoss('');
      setNote('');
    } catch (error) {
      console.error('Error adding trade:', error);
      alert('Failed to add trading record. Please try again.');
    }
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-dark-text">Trade Input</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">
            Trade #{nextTradeNumber} <span className="text-xs text-primary">({todayTradesCount} today)</span>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">
            Starting Balance (¢)
          </label>
          <input
            type="number"
            step="0.01"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
            className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg 
                     text-dark-text focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">
            Profit / Loss Today (¢)
          </label>
          <input
            type="number"
            step="0.01"
            value={profitLoss}
            onChange={(e) => setProfitLoss(e.target.value)}
            placeholder="Enter + or - amount"
            className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg 
                     text-dark-text focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">
            Note (Optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Discipline note..."
            className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg 
                     text-dark-text focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                   rounded-lg transition-colors duration-200"
        >
          ➕ Add Trade
        </button>
      </form>
    </div>
  );
};
