import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, trend, icon, color = 'accent' }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-${color}/20 flex items-center justify-center flex-shrink-0`}>
          <Icon name={icon} size={20} className={`sm:w-6 sm:h-6 text-${color}`} />
        </div>
        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
          <Icon name={getTrendIcon()} size={14} className="sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm font-medium">{change}</span>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">{value}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
};

export default KPICard;