import React from 'react';
import { TradingTrade, DisciplineRules, TradingStatus } from '../types';
import { determineTradingStatus } from '../utils';

interface DisciplineStatusProps {
  latestDay: TradingTrade | null;
  rules: DisciplineRules;
  onUpdateRules: (rules: DisciplineRules) => void;
  todayTrades: TradingTrade[];
}

/**
 * DisciplineStatus Component
 * Displays current trading status based on discipline rules
 * Now checks against TOTAL daily P/L, not individual trades
 */
export const DisciplineStatus: React.FC<DisciplineStatusProps> = ({ 
  latestDay, 
  rules,
  onUpdateRules,
  todayTrades
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [maxLoss, setMaxLoss] = React.useState(rules.maxDailyLossPercent.toString());
  const [profitTarget, setProfitTarget] = React.useState(rules.dailyProfitTargetPercent.toString());
  
  // Calculate today's total P/L
  const todayProfitLoss = todayTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
  const todayStartBalance = todayTrades.length > 0 ? todayTrades[0].startingBalance : (latestDay?.startingBalance || 1008.66);
  
  const currentStatus: TradingStatus = todayTrades.length > 0
    ? determineTradingStatus(todayProfitLoss, todayStartBalance, rules)
    : 'CONTINUE';
  
  const getStatusConfig = () => {
    switch (currentStatus) {
      case 'TARGET_HIT':
        return {
          icon: '🟢',
          text: 'STOP - TARGET HIT',
          color: 'bg-profit/10 border-profit text-profit',
          message: 'Daily profit target reached! Stop trading.'
        };
      case 'MAX_LOSS':
        return {
          icon: '🔴',
          text: 'STOP - MAX LOSS',
          color: 'bg-loss/10 border-loss text-loss',
          message: 'Max daily loss hit. Stop trading immediately.'
        };
      default:
        return {
          icon: '🟡',
          text: 'CONTINUE',
          color: 'bg-warning/10 border-warning text-warning',
          message: todayTrades.length > 0 
            ? `Within limits. ${todayTrades.length} trade(s) today.`
            : 'Within limits. Trade with discipline.'
        };
    }
  };
  
  const status = getStatusConfig();
  
  const handleSaveRules = () => {
    const parsedLoss = parseFloat(maxLoss);
    const parsedTarget = parseFloat(profitTarget);
    
    if (isNaN(parsedLoss) || isNaN(parsedTarget)) {
      alert('Please enter valid numbers');
      return;
    }
    
    if (parsedLoss < 0 || parsedLoss > 100 || parsedTarget < 0 || parsedTarget > 100) {
      alert('Percentages must be between 0 and 100');
      return;
    }
    
    if (parsedLoss === 0) {
      alert('Max loss cannot be 0%');
      return;
    }
    
    if (parsedTarget === 0) {
      alert('Profit target cannot be 0%');
      return;
    }
    
    if (parsedTarget <= parsedLoss) {
      if (!window.confirm('Profit target should be higher than max loss. Continue anyway?')) {
        return;
      }
    }
    
    try {
      onUpdateRules({
        maxDailyLossPercent: Math.abs(parsedLoss),
        dailyProfitTargetPercent: Math.abs(parsedTarget),
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving rules:', error);
      alert('Failed to save rules. Please try again.');
    }
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-dark-text">Discipline Rules</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-blue-500 hover:text-blue-400"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">
              Max Daily Loss (% of balance)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={maxLoss}
              onChange={(e) => setMaxLoss(e.target.value)}
              placeholder="5-7%"
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg 
                       text-dark-text focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">
              Daily Profit Target (% of balance)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={profitTarget}
              onChange={(e) => setProfitTarget(e.target.value)}
              placeholder="15-18%"
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg 
                       text-dark-text focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={handleSaveRules}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                     rounded-lg transition-colors duration-200"
          >
            Save Rules
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            <div className="bg-dark-bg rounded-lg p-3 mb-4">
              <div className="text-xs text-gray-400 mb-1">Today's Starting Balance</div>
              <div className="text-lg font-bold text-dark-text">{todayStartBalance.toFixed(2)}¢</div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Max Daily Loss:</span>
              <span className="text-loss font-medium">
                {rules.maxDailyLossPercent}% (-{((todayStartBalance * rules.maxDailyLossPercent) / 100).toFixed(2)}¢)
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Daily Target:</span>
              <span className="text-profit font-medium">
                {rules.dailyProfitTargetPercent}% (+{((todayStartBalance * rules.dailyProfitTargetPercent) / 100).toFixed(2)}¢)
              </span>
            </div>
            
            {todayTrades.length > 0 && (
              <div className="flex justify-between items-center text-sm pt-2 border-t border-dark-border mt-3">
                <span className="text-gray-400">Today's P/L:</span>
                <span className={`font-bold ${todayProfitLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {todayProfitLoss >= 0 ? '+' : ''}{todayProfitLoss.toFixed(2)}¢
                </span>
              </div>
            )}
          </div>
          
          <div className={`border-2 rounded-lg p-6 text-center ${status.color}`}>
            <div className="text-4xl mb-2">{status.icon}</div>
            <div className="text-3xl font-bold mb-2">{status.text}</div>
            <div className="text-sm opacity-90">{status.message}</div>
          </div>
        </>
      )}
    </div>
  );
};
