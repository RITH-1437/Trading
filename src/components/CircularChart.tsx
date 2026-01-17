import React from 'react';

interface CircularChartProps {
  profit: number;
  balance: number;
  profitPercent: number;
}

/**
 * CircularChart Component
 * Displays balance and profit as a circular progress chart
 */
export const CircularChart: React.FC<CircularChartProps> = ({ 
  profit, 
  balance,
  profitPercent 
}) => {
  const size = 320;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate progress (0-100% mapped to circle)
  const absPercent = Math.min(Math.abs(profitPercent), 100);
  const progress = (absPercent / 100) * circumference;
  const strokeDashoffset = circumference - progress;
  
  // Color based on profit/loss
  const progressColor = profit >= 0 ? '#10b981' : '#ef4444';
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e2739"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-2">Balance</div>
            <div className="text-4xl font-bold text-dark-text">
              {balance.toFixed(2)}¢
            </div>
            <div className={`text-3xl font-bold mt-3 ${profit >= 0 ? 'text-profit' : 'text-loss'}`}>
              {profit >= 0 ? '+' : ''}{profit.toFixed(2)}¢
            </div>
            <div className={`text-lg mt-2 ${profit >= 0 ? 'text-profit' : 'text-loss'}`}>
              {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
