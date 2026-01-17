import { TradingTrade, DisciplineRules } from './types';

const STORAGE_KEYS = {
  TRADING_TRADES: 'trading_trades',
  DISCIPLINE_RULES: 'discipline_rules',
};

/**
 * Get all trading trades from localStorage
 */
export const getTradingTrades = (): TradingTrade[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRADING_TRADES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading trading trades:', error);
    return [];
  }
};

/**
 * Save trading trades to localStorage
 */
export const saveTradingTrades = (trades: TradingTrade[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRADING_TRADES, JSON.stringify(trades));
  } catch (error) {
    console.error('Error saving trading trades:', error);
    alert('Failed to save data. Storage may be full.');
  }
};

/**
 * Get discipline rules from localStorage
 */
export const getDisciplineRules = (): DisciplineRules => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DISCIPLINE_RULES);
    return data ? JSON.parse(data) : { maxDailyLossPercent: 6, dailyProfitTargetPercent: 16.5 };
  } catch (error) {
    console.error('Error loading discipline rules:', error);
    return { maxDailyLossPercent: 6, dailyProfitTargetPercent: 16.5 };
  }
};

/**
 * Save discipline rules to localStorage
 */
export const saveDisciplineRules = (rules: DisciplineRules): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DISCIPLINE_RULES, JSON.stringify(rules));
  } catch (error) {
    console.error('Error saving discipline rules:', error);
    alert('Failed to save rules. Storage may be full.');
  }
};

/**
 * Clear all data from localStorage
 */
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TRADING_TRADES);
    localStorage.removeItem(STORAGE_KEYS.DISCIPLINE_RULES);
  } catch (error) {
    console.error('Error clearing data:', error);
    alert('Failed to clear data.');
  }
};

// Legacy exports for backward compatibility
export const getTradingDays = getTradingTrades;
export const saveTradingDays = saveTradingTrades;
