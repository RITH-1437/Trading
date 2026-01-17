/**
 * Trading Trade Record
 * Represents a single trade
 */
export interface TradingTrade {
  id: string;
  tradeNumber: number;
  startingBalance: number;
  profitLoss: number;
  note?: string;
  timestamp: number; // Unix timestamp
  date: string; // YYYY-MM-DD format for grouping
}

/**
 * Daily Summary
 * Aggregated data for all trades on a specific day
 */
export interface DailySummaryData {
  date: string; // YYYY-MM-DD
  trades: TradingTrade[];
  totalProfitLoss: number;
  startingBalance: number;
  endingBalance: number;
  tradeCount: number;
}

/**
 * Discipline Rules
 * User-defined trading limits (percentages) - resets daily at midnight
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
 * Trade Statistics
 * Calculated metrics for a trade
 */
export interface TradeStats {
  totalBalance: number;
  drawdown: number;
  isWin: boolean;
  status: TradingStatus;
  dailyProfitLoss: number; // Total P/L for the day
}

// Legacy type alias for backward compatibility
export type TradingDay = TradingTrade;
