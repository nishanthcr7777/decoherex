import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, unit, trend, trendValue, status, sparklineData, icon }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-foreground';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="glass-card p-4 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={16} className="text-accent" />
          </div>
          <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
        </div>
        <div className={`flex items-center space-x-1 ${getTrendColor(trend)}`}>
          <Icon name={getTrendIcon(trend)} size={12} />
          <span className="text-xs font-medium">{trendValue}</span>
        </div>
      </div>
      <div className="flex items-baseline space-x-2 mb-2">
        <span className={`text-xl font-bold ${getStatusColor(status)}`}>
          {value}
        </span>
        {unit && (
          <span className="text-xs text-muted-foreground">{unit}</span>
        )}
      </div>
      {/* Sparkline visualization */}
      <div className="h-6 flex items-end space-x-1">
        {sparklineData?.map((point, index) => (
          <div
            key={index}
            className="flex-1 bg-accent/30 rounded-sm transition-all duration-200 hover:bg-accent/50"
            style={{ height: `${(point / Math.max(...sparklineData)) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default KPICard;