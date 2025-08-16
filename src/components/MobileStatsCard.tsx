import React from 'react';

interface StatItem {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
}

interface MobileStatsCardProps {
  title: string;
  stats: StatItem[];
  accentColor?: string;
}

const MobileStatsCard: React.FC<MobileStatsCardProps> = ({ 
  title, 
  stats,
  accentColor = 'bg-gray-900'
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className={`h-1 ${accentColor}`} />
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">{title}</h3>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{stat.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-medium text-gray-900">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </span>
                {stat.trend && (
                  <span className={`text-xs ${
                    stat.trend === 'up' ? 'text-green-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 
                    'text-gray-400'
                  }`}>
                    {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '—'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileStatsCard;