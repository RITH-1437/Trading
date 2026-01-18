import React from 'react';

interface FinancialDonutChartProps {
  deposits: number;
  withdrawals: number;
  loss: number;
}

export const FinancialDonutChart: React.FC<FinancialDonutChartProps> = ({ 
  deposits, 
  withdrawals, 
  loss 
}) => {
  const total = deposits + withdrawals + Math.abs(loss);
  
  // Calculate percentages
  const depositPercent = total > 0 ? (deposits / total) * 100 : 0;
  const withdrawalPercent = total > 0 ? (withdrawals / total) * 100 : 0;
  const lossPercent = total > 0 ? (Math.abs(loss) / total) * 100 : 0;
  
  console.log('Chart Data:', { deposits, withdrawals, loss: Math.abs(loss), total });
  console.log('Percentages:', { depositPercent, withdrawalPercent, lossPercent });
  
  // Calculate angles for pie segments
  const depositAngle = (depositPercent / 100) * 360;
  const withdrawalAngle = (withdrawalPercent / 100) * 360;
  const lossAngle = (lossPercent / 100) * 360;
  
  // Use center of viewBox (120, 120 for 240x240 viewBox)
  const centerX = 120;
  const centerY = 120;
  const radius = 80;
  
  // Helper function to calculate pie segment path
  const createPieSlice = (startAngle: number, endAngle: number, r: number = radius) => {
    const start = polarToCartesian(centerX, centerY, r, endAngle);
    const end = polarToCartesian(centerX, centerY, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  };
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  // Calculate middle angles for each segment
  const depositMidAngle = depositAngle / 2;
  const withdrawalMidAngle = depositAngle + (withdrawalAngle / 2);
  const lossMidAngle = depositAngle + withdrawalAngle + (lossAngle / 2);
  
  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 240 240">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.2"/>
          </filter>
        </defs>
        
        {/* Pie segments */}
        {deposits > 0 && (
          <path
            d={createPieSlice(0, depositAngle)}
            fill="#4ade80"
            stroke="#1e293b"
            strokeWidth="1"
            filter="url(#shadow)"
            className="transition-all duration-500"
          />
        )}
        
        {withdrawals > 0 && (
          <path
            d={createPieSlice(depositAngle, depositAngle + withdrawalAngle)}
            fill="#fbbf24"
            stroke="#1e293b"
            strokeWidth="1"
            filter="url(#shadow)"
            className="transition-all duration-500"
          />
        )}
        
        {loss < 0 && (
          <path
            d={createPieSlice(depositAngle + withdrawalAngle, 360)}
            fill="#ef4444"
            stroke="#1e293b"
            strokeWidth="1"
            filter="url(#shadow)"
            className="transition-all duration-500"
          />
        )}
      </svg>
      
      {/* Legend */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-4 text-[9px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-gray-400 font-medium">Deposits</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
          <span className="text-gray-400 font-medium">Withdrawals</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <span className="text-gray-400 font-medium">Loss</span>
        </div>
      </div>
    </div>
  );
};
