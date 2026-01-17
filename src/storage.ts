import { TradingTrade, DisciplineRules } from './types';
import { database } from './firebase';
import { ref, set, get, remove, onValue } from 'firebase/database';

const DB_PATHS = {
  TRADING_TRADES: 'trades',
  DISCIPLINE_RULES: 'rules',
};

/**
 * Get all trading trades from Firebase
 */
export const getTradingTrades = async (): Promise<TradingTrade[]> => {
  try {
    const tradesRef = ref(database, DB_PATHS.TRADING_TRADES);
    const snapshot = await get(tradesRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading trading trades:', error);
    return [];
  }
};

/**
 * Save trading trades to Firebase
 */
export const saveTradingTrades = async (trades: TradingTrade[]): Promise<void> => {
  try {
    const tradesRef = ref(database, DB_PATHS.TRADING_TRADES);
    // Convert array to object with trade IDs as keys
    const tradesObj = trades.reduce((acc, trade) => {
      acc[trade.id] = trade;
      return acc;
    }, {} as Record<string, TradingTrade>);
    
    await set(tradesRef, tradesObj);
  } catch (error) {
    console.error('Error saving trading trades:', error);
    alert('Failed to save data. Please check your connection.');
  }
};

/**
 * Subscribe to real-time trades updates
 */
export const subscribeTradingTrades = (callback: (trades: TradingTrade[]) => void): (() => void) => {
  const tradesRef = ref(database, DB_PATHS.TRADING_TRADES);
  
  const unsubscribe = onValue(tradesRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const trades = Object.values(data) as TradingTrade[];
      callback(trades);
    } else {
      callback([]);
    }
  });
  
  return unsubscribe;
};

/**
 * Get discipline rules from Firebase
 */
export const getDisciplineRules = async (): Promise<DisciplineRules> => {
  try {
    const rulesRef = ref(database, DB_PATHS.DISCIPLINE_RULES);
    const snapshot = await get(rulesRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return { maxDailyLossPercent: 6, dailyProfitTargetPercent: 16.5 };
  } catch (error) {
    console.error('Error loading discipline rules:', error);
    return { maxDailyLossPercent: 6, dailyProfitTargetPercent: 16.5 };
  }
};

/**
 * Save discipline rules to Firebase
 */
export const saveDisciplineRules = async (rules: DisciplineRules): Promise<void> => {
  try {
    const rulesRef = ref(database, DB_PATHS.DISCIPLINE_RULES);
    await set(rulesRef, rules);
  } catch (error) {
    console.error('Error saving discipline rules:', error);
    alert('Failed to save rules. Please check your connection.');
  }
};

/**
 * Subscribe to real-time rules updates
 */
export const subscribeDisciplineRules = (callback: (rules: DisciplineRules) => void): (() => void) => {
  const rulesRef = ref(database, DB_PATHS.DISCIPLINE_RULES);
  
  const unsubscribe = onValue(rulesRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback({ maxDailyLossPercent: 6, dailyProfitTargetPercent: 16.5 });
    }
  });
  
  return unsubscribe;
};

/**
 * Clear all data from Firebase
 */
export const clearAllData = async (): Promise<void> => {
  try {
    const tradesRef = ref(database, DB_PATHS.TRADING_TRADES);
    await remove(tradesRef);
  } catch (error) {
    console.error('Error clearing data:', error);
    alert('Failed to clear data.');
  }
};

// Legacy exports for backward compatibility
export const getTradingDays = getTradingTrades;
export const saveTradingDays = saveTradingTrades;
