import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const StatisticalDistribution = ({ data, title, metric }) => {
  const formatTooltip = (value, name) => {
    if (metric === 'executionTime') {
      return [`${value} jobs`, `${name}ms range`];
    }
    return [`${value} jobs`, name];
  };

  const getBarColor = () => {
    switch (metric) {
      case 'executionTime': return '#06b6d4';
      case 'queueTime': return '#10b981';
      case 'errorRate': return '#ef4444';
      default: return '#06b6d4';
    }
  };

  const calculateStats = () => {
    if (!data || data?.length === 0) return null;
    
    // Calculate weighted statistics for frequency distribution
    const totalFrequency = data?.reduce((sum, d) => sum + d?.frequency, 0);
    const weightedSum = data?.reduce((sum, d) => sum + (d?.value * d?.frequency), 0);
    const mean = weightedSum / totalFrequency;
    
    // Calculate weighted variance
    const weightedVariance = data?.reduce((sum, d) => {
      const deviation = d?.value - mean;
      return sum + (deviation * deviation * d?.frequency);
    }, 0) / totalFrequency;
    const stdDev = Math.sqrt(weightedVariance);
    
    // Calculate median from frequency distribution
    let median = 0;
    let cumulativeFrequency = 0;
    const medianPosition = totalFrequency / 2;
    
    for (const d of data) {
      cumulativeFrequency += d?.frequency;
      if (cumulativeFrequency >= medianPosition) {
        median = d?.value;
        break;
      }
    }
    
    return { mean, median, stdDev };
  };

  const stats = calculateStats();

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <Icon name="BarChart3" size={20} className="text-muted-foreground" />
      </div>
      <div className="w-full h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis 
              dataKey="range" 
              stroke="#94a3b8"
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#94a3b8"
              fontSize={11}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
              formatter={formatTooltip}
            />
            <Bar 
              dataKey="frequency" 
              fill={getBarColor()}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {stats && (
        <div className="pt-4 border-t border-slate-700/50">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="text-lg font-semibold text-foreground leading-tight">
                {stats?.mean?.toFixed(1)}{metric === 'executionTime' ? 'ms' : metric === 'errorRate' ? '%' : ''}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Mean</div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="text-lg font-semibold text-foreground leading-tight">
                {stats?.median?.toFixed(1)}{metric === 'executionTime' ? 'ms' : metric === 'errorRate' ? '%' : ''}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Median</div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="text-lg font-semibold text-foreground leading-tight">
                {stats?.stdDev?.toFixed(1)}{metric === 'executionTime' ? 'ms' : metric === 'errorRate' ? '%' : ''}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Std Dev</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticalDistribution;