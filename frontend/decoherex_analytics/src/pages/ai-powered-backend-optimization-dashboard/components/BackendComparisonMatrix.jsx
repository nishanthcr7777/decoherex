import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const BackendComparisonMatrix = ({ backends, selectedBackends, onBackendSelect }) => {
  const [viewMode, setViewMode] = useState('radar'); // 'radar' or 'table'

  const radarData = [
    { metric: 'Speed', ...selectedBackends?.reduce((acc, backend) => ({ ...acc, [backend?.name]: backend?.speedScore }), {}) },
    { metric: 'Accuracy', ...selectedBackends?.reduce((acc, backend) => ({ ...acc, [backend?.name]: backend?.accuracyScore }), {}) },
    { metric: 'Availability', ...selectedBackends?.reduce((acc, backend) => ({ ...acc, [backend?.name]: backend?.availabilityScore }), {}) },
    { metric: 'Queue Efficiency', ...selectedBackends?.reduce((acc, backend) => ({ ...acc, [backend?.name]: backend?.queueEfficiency }), {}) },
    { metric: 'Reliability', ...selectedBackends?.reduce((acc, backend) => ({ ...acc, [backend?.name]: backend?.reliabilityScore }), {}) }
  ];

  const colors = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-2xl border border-slate-700/40 shadow-xl shadow-black/20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-5 sm:mb-6">
        <div className="flex items-center space-x-3 sm:space-x-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-8 sm:h-8 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-secondary/20">
            <Icon name="BarChart3" size={18} className="sm:w-[18px] sm:h-[18px] text-secondary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">Backend Comparison Matrix</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Multi-dimensional performance analysis of selected backends
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0 bg-slate-800/40 p-1 rounded-xl border border-slate-700/30">
          <button
            type="button"
            onClick={() => setViewMode('radar')}
            className={`
              flex items-center gap-2 sm:gap-2 px-3 sm:px-3 py-2 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200
              ${viewMode === 'radar'
                ? 'bg-gradient-to-r from-accent/20 to-accent/10 text-accent ring-2 ring-accent/60 shadow-lg shadow-accent/20'
                : 'bg-transparent text-muted-foreground hover:bg-slate-700/50 hover:text-foreground'
              }
            `}
          >
            <Icon name="Radar" size={14} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Radar</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`
              flex items-center gap-2 sm:gap-2 px-3 sm:px-3 py-2 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200
              ${viewMode === 'table'
                ? 'bg-gradient-to-r from-accent/20 to-accent/10 text-accent ring-2 ring-accent/60 shadow-lg shadow-accent/20'
                : 'bg-transparent text-muted-foreground hover:bg-slate-700/50 hover:text-foreground'
              }
            `}
          >
            <Icon name="Table" size={14} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>
      {/* Backend Selection */}
      <div className="mb-5 sm:mb-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
        <div className="flex items-center space-x-2 sm:space-x-2 mb-3 sm:mb-3">
          <div className="w-6 h-6 rounded-lg bg-accent/20 flex items-center justify-center">
            <Icon name="MousePointer" size={14} className="sm:w-4 sm:h-4 text-accent" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-foreground">Select backends to compare:</span>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-2">
          {backends?.slice(0, 5)?.map((backend, index) => {
            const isSelected = selectedBackends?.some(b => b?.id === backend?.id);
            return (
              <button
                key={`${backend?.id}-${index}`}
                onClick={() => onBackendSelect(backend)}
                className={`
                  px-3 sm:px-3 py-2 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 truncate max-w-full
                  ${isSelected
                    ? 'bg-gradient-to-r from-accent/20 to-accent/10 text-accent ring-2 ring-accent/60 shadow-lg shadow-accent/20'
                    : 'bg-slate-700/40 text-muted-foreground hover:bg-slate-600/50 hover:text-foreground hover:ring-1 hover:ring-slate-500/40 border border-slate-600/30'
                  }
                `}
              >
                {backend?.name}
              </button>
            );
          })}
        </div>
      </div>
      {selectedBackends?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
          <Icon name="MousePointer" size={36} className="sm:w-12 sm:h-12 text-muted-foreground mb-3 sm:mb-4" />
          <h4 className="text-base sm:text-lg font-medium text-foreground mb-1 sm:mb-2">Select Backends to Compare</h4>
          <p className="text-xs sm:text-sm text-muted-foreground px-2">
            Choose 2-5 backends from above to view detailed performance comparison
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'radar' ? (
            <div className="h-64 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  {selectedBackends?.map((backend, index) => (
                    <Radar
                      key={`${backend?.id}-${index}`}
                      name={backend?.name}
                      dataKey={backend?.name}
                      stroke={colors?.[index % colors?.length]}
                      fill={colors?.[index % colors?.length]}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  ))}
                  <Legend 
                    wrapperStyle={{ color: '#f8fafc' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Metric
                    </th>
                    {selectedBackends?.map((backend, index) => (
                      <th key={`${backend?.id}-${index}`} className="text-center py-3 px-4 text-sm font-medium text-foreground">
                        {backend?.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'speedScore', label: 'Speed Score' },
                    { key: 'accuracyScore', label: 'Accuracy Score' },
                    { key: 'availabilityScore', label: 'Availability Score' },
                    { key: 'queueEfficiency', label: 'Queue Efficiency' },
                    { key: 'reliabilityScore', label: 'Reliability Score' }
                  ]?.map((metric) => (
                    <tr key={metric?.key} className="border-b border-slate-700/30">
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {metric?.label}
                      </td>
                      {selectedBackends?.map((backend, index) => (
                        <td key={`${backend?.id}-${index}`} className="text-center py-3 px-4">
                          <span className={`text-sm font-medium ${getScoreColor(backend?.[metric?.key])}`}>
                            {backend?.[metric?.key]}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Comparison Insights */}
          <div className="mt-5 sm:mt-6 p-4 sm:p-4 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent rounded-xl border border-accent/20 shadow-lg">
            <div className="flex items-start space-x-3 sm:space-x-3">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Brain" size={16} className="sm:w-4 sm:h-4 text-accent" />
              </div>
              <div className="text-xs sm:text-sm min-w-0 flex-1">
                <p className="text-foreground font-bold mb-1.5 text-sm sm:text-sm">AI Comparison Insights</p>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedBackends?.length > 1 ? (
                    `${selectedBackends?.[0]?.name} shows the highest overall performance score, 
                    while ${selectedBackends?.[selectedBackends?.length - 1]?.name} offers the best queue efficiency. 
                    Consider workload requirements when making final selection.`
                  ) : (
                    'Select multiple backends to receive AI-powered comparison insights and recommendations.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BackendComparisonMatrix;