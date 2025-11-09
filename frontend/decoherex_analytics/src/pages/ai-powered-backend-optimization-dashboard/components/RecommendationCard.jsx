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
        relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
        ${isSelected 
          ? 'bg-accent/10 border-accent shadow-lg shadow-accent/20' 
          : 'bg-card/50 border-slate-700/50 hover:border-accent/50 hover:bg-accent/5'
        }
        backdrop-blur-sm
      `}
    >
      {/* Rank Badge */}
      <div className="absolute -top-3 -right-3 w-8 h-8 bg-background border-2 border-slate-700 rounded-full flex items-center justify-center">
        <Icon name={getRankIcon(rank)} size={16} className={getRankColor(rank)} />
      </div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            ${backend?.type === 'quantum' ? 'bg-accent/20' : 'bg-secondary/20'}
          `}>
            <Icon 
              name={backend?.type === 'quantum' ? 'Atom' : 'Server'} 
              size={20} 
              className={backend?.type === 'quantum' ? 'text-accent' : 'text-secondary'} 
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{backend?.name}</h3>
            <p className="text-sm text-muted-foreground">{backend?.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`
            w-3 h-3 rounded-full
            ${backend?.status === 'online' ? 'bg-success' : 'bg-error'}
          `} />
          <span className="text-xs font-medium text-muted-foreground capitalize">
            {backend?.status}
          </span>
        </div>
      </div>
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Icon name="Target" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Suitability</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={`text-2xl font-bold ${getConfidenceColor(backend?.suitabilityScore)}`}>
              {backend?.suitabilityScore}
            </span>
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Wait Time</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={`text-2xl font-bold ${getWaitTimeColor(backend?.predictedWaitTime)}`}>
              {backend?.predictedWaitTime}
            </span>
            <span className="text-sm text-muted-foreground">min</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Success Rate</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-success">
              {backend?.successProbability}
            </span>
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Queue</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-foreground">
              {backend?.queueLength}
            </span>
            <span className="text-sm text-muted-foreground">jobs</span>
          </div>
        </div>
      </div>
      {/* Confidence Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">AI Confidence</span>
          <span className={`text-xs font-medium ${getConfidenceColor(backend?.aiConfidence)}`}>
            {backend?.aiConfidence}%
          </span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2">
          <div
            className={`
              h-2 rounded-full transition-all duration-500
              ${backend?.aiConfidence >= 90 ? 'bg-success' : 
                backend?.aiConfidence >= 70 ? 'bg-warning' : 'bg-error'}
            `}
            style={{ width: `${backend?.aiConfidence}%` }}
          />
        </div>
      </div>
      {/* Features */}
      <div className="mt-4 flex flex-wrap gap-2">
        {backend?.features?.map((feature, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-muted/30 text-xs text-muted-foreground rounded-md"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RecommendationCard;