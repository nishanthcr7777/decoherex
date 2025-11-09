import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

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
    <div className="bg-card/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={18} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Backend Comparison Matrix</h3>
            <p className="text-sm text-muted-foreground">
              Multi-dimensional performance analysis of selected backends
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'radar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('radar')}
            iconName="Radar"
            iconPosition="left"
          >
            Radar
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
            iconName="Table"
            iconPosition="left"
          >
            Table
          </Button>
        </div>
      </div>
      {/* Backend Selection */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="MousePointer" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Select backends to compare:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {backends?.slice(0, 5)?.map((backend, index) => (
            <button
              key={`${backend?.id}-${index}`}
              onClick={() => onBackendSelect(backend)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${selectedBackends?.some(b => b?.id === backend?.id)
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }
              `}
            >
              {backend?.name}
            </button>
          ))}
        </div>
      </div>
      {selectedBackends?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icon name="MousePointer" size={48} className="text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">Select Backends to Compare</h4>
          <p className="text-muted-foreground">
            Choose 2-5 backends from above to view detailed performance comparison
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'radar' ? (
            <div className="h-96">
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
            <div className="overflow-x-auto">
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
          <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-slate-700/30">
            <div className="flex items-start space-x-3">
              <Icon name="Brain" size={16} className="text-accent mt-0.5" />
              <div className="text-sm">
                <p className="text-foreground font-medium mb-1">AI Comparison Insights</p>
                <p className="text-muted-foreground">
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