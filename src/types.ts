/**
 * Trading Day Record
 * Represents a single day's trading activity
 */
export interface TradingDay {
  id: string;
  dayNumber: number;
  startingBalance: number;
  profitLoss: number;
  note?: string;
  timestamp: number;
}

/**
 * Discipline Rules
 * User-defined trading limits (percentages)
 */
export interface DisciplineRules {
  maxDailyLossPercent: number; // e.g., 5-7%
  dailyProfitTargetPercent: number; // e.g., 15-18%
}

/**
 * Trading Status
 * Indicates current discipline state
 */
export type TradingStatus = 'CONTINUE' | 'TARGET_HIT' | 'MAX_LOSS';

/**
 * Day Statistics
 * Calculated metrics for a trading day
 */
export interface DayStats {
  totalBalance: number;
  drawdown: number;
  isWin: boolean;
  status: TradingStatus;
}
