import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: 'cyan' | 'green' | 'red' | 'yellow' | 'purple';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'cyan'
}) => {
  const colorClasses = {
    cyan: 'from-cyan-500 to-blue-500 shadow-cyan-500/20',
    green: 'from-green-500 to-emerald-500 shadow-green-500/20',
    red: 'from-red-500 to-rose-500 shadow-red-500/20',
    yellow: 'from-yellow-500 to-amber-500 shadow-yellow-500/20',
    purple: 'from-purple-500 to-indigo-500 shadow-purple-500/20',
  };

  const changeColorClasses = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          {change && (
            <p className={`text-sm ${changeColorClasses[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;