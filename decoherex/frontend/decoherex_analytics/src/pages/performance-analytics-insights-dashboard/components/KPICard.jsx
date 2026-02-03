import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, trend, icon, color = 'accent' }) => {
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

  const status = trend === 'up' ? 'success' : trend === 'down' ? 'error' : 'neutral';
  const trendValue = change ?? '—';
  const sparklineData = [50, 55, 48, 62, 58];

  return (
    <div className="relative group overflow-hidden bg-gradient-to-br from-gray-900/90 to-black/90 border border-white/10 p-4 sm:p-5 rounded-xl sm:rounded-2xl backdrop-blur-md transition-all duration-300 hover:border-cyan-500/40">

      {/* Glow Effect */}
      <div className="absolute -top-10 -right-10 w-20 sm:w-24 h-20 sm:h-24 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-500" />

      <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-500/10 rounded-lg sm:rounded-xl flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
            <Icon name={icon} size={16} className="sm:w-5 sm:h-5 text-cyan-400" />
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-400 tracking-wide uppercase truncate">{title}</h3>
        </div>
        <div className={`flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-white/5 ${getTrendColor(trend)} flex-shrink-0 ml-2`}>
          <Icon name={getTrendIcon(trend)} size={12} className="sm:w-3.5 sm:h-3.5" />
          <span className="text-[10px] sm:text-xs font-bold">{trendValue}</span>
        </div>
      </div>

      <div className="flex items-baseline space-x-1 sm:space-x-2 mb-3 sm:mb-4 relative z-10">
        <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${getStatusColor(status)} group-hover:text-white transition-colors`}>
          {value}
        </span>
      </div>

      {/* Sparkline visualization */}
      <div className="h-6 sm:h-8 flex items-end space-x-0.5 sm:space-x-1 relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">
        {sparklineData?.map((point, index) => (
          <div
            key={index}
            className="flex-1 bg-gradient-to-t from-cyan-500/50 to-blue-600/50 rounded-sm transition-all duration-200 hover:bg-cyan-400"
            style={{ height: `${(point / Math.max(...sparklineData)) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default KPICard;
