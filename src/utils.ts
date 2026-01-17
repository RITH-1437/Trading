import { TradingDay, DisciplineRules, DayStats, TradingStatus } from './types';

/**
 * Calculate total balance up to a specific day
 */
export const calculateTotalBalance = (days: TradingDay[], currentIndex: number): number => {
  if (currentIndex === 0) {
    return days[0].startingBalance + days[0].profitLoss;
  }
  
  const previousTotal = calculateTotalBalance(days, currentIndex - 1);
  return previousTotal + days[currentIndex].profitLoss;
};

/**
 * Calculate maximum drawdown percentage
 * Drawdown = (Peak - Current) / Peak * 100
 */
export const calculateMaxDrawdown = (days: TradingDay[]): number => {
  if (days.length === 0) return 0;
  
  let peak = days[0].startingBalance;
  let maxDrawdown = 0;
  
  days.forEach((_, index) => {
    const currentBalance = calculateTotalBalance(days, index);
    
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
 */
export const determineTradingStatus = (
  profitLoss: number,
  startingBalance: number,
  rules: DisciplineRules
): TradingStatus => {
  const profitTarget = (startingBalance * rules.dailyProfitTargetPercent) / 100;
  const maxLoss = -((startingBalance * rules.maxDailyLossPercent) / 100);
  
  if (profitLoss >= profitTarget) {
    return 'TARGET_HIT';
  }
  if (profitLoss <= maxLoss) {
    return 'MAX_LOSS';
  }
  return 'CONTINUE';
};

/**
 * Calculate statistics for a specific day
 */
export const calculateDayStats = (
  days: TradingDay[],
  dayIndex: number,
  rules: DisciplineRules
): DayStats => {
  const day = days[dayIndex];
  const totalBalance = calculateTotalBalance(days, dayIndex);
  const drawdown = calculateMaxDrawdown(days.slice(0, dayIndex + 1));
  const isWin = day.profitLoss > 0;
  const status = determineTradingStatus(day.profitLoss, day.startingBalance, rules);
  
  return {
    totalBalance,
    drawdown,
    isWin,
    status,
  };
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
