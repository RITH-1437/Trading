import { TradingTrade, DisciplineRules, TradeStats, TradingStatus, DailySummaryData } from './types';

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

/**
 * Get date from timestamp in YYYY-MM-DD format
 */
export const getDateFromTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toISOString().split('T')[0];
};

/**
 * Group trades by date
 */
export const groupTradesByDate = (trades: TradingTrade[]): Map<string, TradingTrade[]> => {
  const grouped = new Map<string, TradingTrade[]>();
  
  trades.forEach(trade => {
    const date = trade.date;
    if (!grouped.has(date)) {
      grouped.set(date, []);
    }
    grouped.get(date)!.push(trade);
  });
  
  return grouped;
};

/**
 * Get all trades for today
 */
export const getTodayTrades = (trades: TradingTrade[]): TradingTrade[] => {
  const today = getTodayDate();
  return trades.filter(trade => trade.date === today);
};

/**
 * Calculate total P/L for a specific date
 */
export const calculateDailyProfitLoss = (trades: TradingTrade[], date: string): number => {
  return trades
    .filter(trade => trade.date === date)
    .reduce((sum, trade) => sum + trade.profitLoss, 0);
};

/**
 * Get daily summaries from trades
 */
export const getDailySummaries = (trades: TradingTrade[]): DailySummaryData[] => {
  const grouped = groupTradesByDate(trades);
  const summaries: DailySummaryData[] = [];
  
  grouped.forEach((dayTrades, date) => {
    const sortedTrades = dayTrades.sort((a, b) => a.timestamp - b.timestamp);
    const totalProfitLoss = sortedTrades.reduce((sum, t) => sum + t.profitLoss, 0);
    const totalDeposits = sortedTrades.reduce((sum, t) => sum + (t.deposit || 0), 0);
    const totalWithdrawals = sortedTrades.reduce((sum, t) => sum + (t.withdrawal || 0), 0);
    const startingBalance = sortedTrades[0].startingBalance;
    const endingBalance = startingBalance + totalProfitLoss + totalDeposits - totalWithdrawals;
    
    summaries.push({
      date,
      trades: sortedTrades,
      totalProfitLoss,
      startingBalance,
      endingBalance,
      tradeCount: sortedTrades.length,
    });
  });
  
  return summaries.sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Calculate total balance up to a specific trade
 */
export const calculateTotalBalance = (trades: TradingTrade[], currentIndex: number): number => {
  if (currentIndex < 0 || trades.length === 0) {
    return trades[0]?.startingBalance || 0;
  }
  
  if (currentIndex === 0) {
    const trade = trades[0];
    return trade.startingBalance + trade.profitLoss + (trade.deposit || 0) - (trade.withdrawal || 0);
  }
  
  const previousTotal = calculateTotalBalance(trades, currentIndex - 1);
  const currentTrade = trades[currentIndex];
  return previousTotal + currentTrade.profitLoss + (currentTrade.deposit || 0) - (currentTrade.withdrawal || 0);
};

/**
 * Calculate maximum drawdown percentage
 */
export const calculateMaxDrawdown = (trades: TradingTrade[]): number => {
  if (trades.length === 0) return 0;
  
  let peak = trades[0].startingBalance;
  let maxDrawdown = 0;
  
  trades.forEach((_, index) => {
    const currentBalance = calculateTotalBalance(trades, index);
    
    if (currentBalance > peak) {
      peak = currentBalance;
    }
    
    const drawdown = ((peak - currentBalance) / peak) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });
  
  return maxDrawdown;
};

/**
 * Determine trading status based on discipline rules
 * Checks against DAILY profit/loss, not individual trade
 */
export const determineTradingStatus = (
  dailyProfitLoss: number,
  startingBalance: number,
  rules: DisciplineRules
): TradingStatus => {
  const profitTarget = (startingBalance * rules.dailyProfitTargetPercent) / 100;
  const maxLoss = -((startingBalance * rules.maxDailyLossPercent) / 100);
  
  if (dailyProfitLoss >= profitTarget) {
    return 'TARGET_HIT';
  }
  if (dailyProfitLoss <= maxLoss) {
    return 'MAX_LOSS';
  }
  return 'CONTINUE';
};

/**
 * Calculate statistics for a specific trade
 */
export const calculateTradeStats = (
  trades: TradingTrade[],
  tradeIndex: number,
  rules: DisciplineRules
): TradeStats => {
  const trade = trades[tradeIndex];
  const totalBalance = calculateTotalBalance(trades, tradeIndex);
  const drawdown = calculateMaxDrawdown(trades.slice(0, tradeIndex + 1));
  const isWin = trade.profitLoss > 0;
  
  // Calculate total P/L for the day this trade belongs to
  const dailyProfitLoss = calculateDailyProfitLoss(trades, trade.date);
  const status = determineTradingStatus(dailyProfitLoss, trade.startingBalance, rules);
  
  return {
    totalBalance,
    drawdown,
    isWin,
    status,
    dailyProfitLoss,
  };
};

/**
 * Get starting balance for new trade
 * Uses the ending balance of the last trade, or resets at midnight
 */
export const getStartingBalanceForNewTrade = (trades: TradingTrade[]): number => {
  if (trades.length === 0) {
    return 1008.66; // Default starting balance
  }
  
  const lastBalance = calculateTotalBalance(trades, trades.length - 1);
  
  return lastBalance;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  const sign = amount >= 0 ? '+' : '';
  return `${sign}${amount.toFixed(2)}¢`;
};

/**
 * Format percentage for display
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

// Legacy exports for backward compatibility
export const calculateDayStats = calculateTradeStats;
