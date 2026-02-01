import React from 'react';
import Icon from '../../../components/AppIcon';

const RecommendationCard = ({ backend, rank, isSelected, onClick }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return 'Trophy';
      case 2: return 'Medal';
      case 3: return 'Award';
      default: return 'Star';
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-slate-300';
      case 3: return 'text-amber-600';
      default: return 'text-muted-foreground';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 70) return 'text-warning';
    return 'text-error';
  };

  const getWaitTimeColor = (waitTime) => {
    if (waitTime <= 5) return 'text-success';
    if (waitTime <= 15) return 'text-warning';
    return 'text-error';
  };

  return (
    <div
      onClick={() => onClick(backend)}
      className={`
        relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 cursor-pointer
        ${isSelected 
          ? 'bg-accent/10 border-accent shadow-lg shadow-accent/20' 
          : 'bg-card/50 border-slate-700/50 hover:border-accent/50 hover:bg-accent/5'
        }
        backdrop-blur-sm
      `}
    >
      {/* Rank Badge */}
      <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-7 h-7 sm:w-8 sm:h-8 bg-background border-2 border-slate-700 rounded-full flex items-center justify-center">
        <Icon name={getRankIcon(rank)} size={14} className={`sm:w-4 sm:h-4 ${getRankColor(rank)}`} />
      </div>
      {/* Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className={`
            w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0
            ${backend?.type === 'quantum' ? 'bg-accent/20' : 'bg-secondary/20'}
          `}>
            <Icon 
              name={backend?.type === 'quantum' ? 'Atom' : 'Server'} 
              size={18} 
              className={`sm:w-5 sm:h-5 ${backend?.type === 'quantum' ? 'text-accent' : 'text-secondary'}`}
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">{backend?.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{backend?.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          <div className={`
            w-2 h-2 sm:w-3 sm:h-3 rounded-full
            ${backend?.status === 'online' ? 'bg-success' : 'bg-error'}
          `} />
          <span className="text-[10px] sm:text-xs font-medium text-muted-foreground capitalize hidden sm:inline">
            {backend?.status}
          </span>
        </div>
      </div>
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <Icon name="Target" size={12} className="sm:w-3.5 sm:h-3.5 text-muted-foreground" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">Suitability</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={`text-xl sm:text-2xl font-bold ${getConfidenceColor(backend?.suitabilityScore)}`}>
              {backend?.suitabilityScore}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">%</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <Icon name="Clock" size={12} className="sm:w-3.5 sm:h-3.5 text-muted-foreground" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">Wait Time</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={`text-xl sm:text-2xl font-bold ${getWaitTimeColor(backend?.predictedWaitTime)}`}>
              {backend?.predictedWaitTime}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">min</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <Icon name="TrendingUp" size={12} className="sm:w-3.5 sm:h-3.5 text-muted-foreground" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">Success Rate</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl sm:text-2xl font-bold text-success">
              {backend?.successProbability}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">%</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <Icon name="Users" size={12} className="sm:w-3.5 sm:h-3.5 text-muted-foreground" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">Queue</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl sm:text-2xl font-bold text-foreground">
              {backend?.queueLength}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">jobs</span>
          </div>
        </div>
      </div>
      {/* Confidence Indicator */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-muted-foreground">AI Confidence</span>
          <span className={`text-[10px] sm:text-xs font-medium ${getConfidenceColor(backend?.aiConfidence)}`}>
            {backend?.aiConfidence}%
          </span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-1.5 sm:h-2">
          <div
            className={`
              h-1.5 sm:h-2 rounded-full transition-all duration-500
              ${backend?.aiConfidence >= 90 ? 'bg-success' : 
                backend?.aiConfidence >= 70 ? 'bg-warning' : 'bg-error'}
            `}
            style={{ width: `${backend?.aiConfidence}%` }}
          />
        </div>
      </div>
      {/* Features */}
      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
        {backend?.features?.map((feature, index) => (
          <span
            key={index}
            className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted/30 text-[10px] sm:text-xs text-muted-foreground rounded-md"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RecommendationCard;