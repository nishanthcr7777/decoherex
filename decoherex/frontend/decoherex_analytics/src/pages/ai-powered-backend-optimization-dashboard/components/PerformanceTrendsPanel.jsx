import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const PerformanceTrendsPanel = ({ selectedBackend }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [metric, setMetric] = useState('success-rate');

  const timeRangeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  const metricOptions = [
    { value: 'success-rate', label: 'Success Rate' },
    { value: 'avg-execution-time', label: 'Avg Execution Time' },
    { value: 'queue-length', label: 'Queue Length' },
    { value: 'error-rate', label: 'Error Rate' }
  ];

  // Mock historical data
  const generateTrendData = () => {
    const baseData = [];
    const points = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
    
    for (let i = points - 1; i >= 0; i--) {
      const date = new Date();
      if (timeRange === '24h') {
        date?.setHours(date?.getHours() - i);
      } else if (timeRange === '7d') {
        date?.setDate(date?.getDate() - i);
      } else {
        date?.setDate(date?.getDate() - i);
      }

      let value;
      switch (metric) {
        case 'success-rate':
          value = 85 + Math.random() * 10 + Math.sin(i * 0.5) * 3;
          break;
        case 'avg-execution-time':
          value = 120 + Math.random() * 60 + Math.cos(i * 0.3) * 20;
          break;
        case 'queue-length':
          value = Math.max(0, 15 + Math.random() * 25 + Math.sin(i * 0.4) * 10);
          break;
        case 'error-rate':
          value = Math.max(0, 2 + Math.random() * 3 + Math.cos(i * 0.6) * 1);
          break;
        default:
          value = Math.random() * 100;
      }

      baseData?.push({
        time: timeRange === '24h' ? date?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.round(value * 100) / 100,
        timestamp: date?.getTime()
      });
    }
    return baseData;
  };

  const trendData = generateTrendData();

  const getMetricColor = () => {
    switch (metric) {
      case 'success-rate': return '#10b981';
      case 'avg-execution-time': return '#06b6d4';
      case 'queue-length': return '#f59e0b';
      case 'error-rate': return '#ef4444';
      default: return '#06b6d4';
    }
  };

  const getMetricUnit = () => {
    switch (metric) {
      case 'success-rate': return '%';
      case 'avg-execution-time': return 'ms';
      case 'queue-length': return 'jobs';
      case 'error-rate': return '%';
      default: return '';
    }
  };

  const getMetricIcon = () => {
    switch (metric) {
      case 'success-rate': return 'TrendingUp';
      case 'avg-execution-time': return 'Clock';
      case 'queue-length': return 'Users';
      case 'error-rate': return 'AlertTriangle';
      default: return 'BarChart3';
    }
  };

  const currentValue = trendData?.[trendData?.length - 1]?.value || 0;
  const previousValue = trendData?.[trendData?.length - 2]?.value || 0;
  const trend = currentValue - previousValue;
  const trendPercentage = previousValue !== 0 ? ((trend / previousValue) * 100) : 0;

  return (
    <div className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-2xl border border-slate-700/40 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div className="flex items-center space-x-3 sm:space-x-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-8 sm:h-8 bg-gradient-to-br from-success/30 to-success/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-success/20">
            <Icon name="TrendingUp" size={18} className="sm:w-[18px] sm:h-[18px] text-success" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">Performance Trends</h3>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {selectedBackend ? `Historical metrics for ${selectedBackend?.name}` : 'Select a backend to view trends'}
            </p>
          </div>
        </div>
      </div>
      {!selectedBackend ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
          <Icon name="TrendingUp" size={36} className="sm:w-12 sm:h-12 text-muted-foreground mb-3 sm:mb-4" />
          <h4 className="text-base sm:text-lg font-medium text-foreground mb-1 sm:mb-2">No Backend Selected</h4>
          <p className="text-xs sm:text-sm text-muted-foreground px-2">
            Select a backend from the recommendations to view performance trends
          </p>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Select
              label="Time Range"
              options={timeRangeOptions}
              value={timeRange}
              onChange={setTimeRange}
              className="flex-1"
            />
            <Select
              label="Metric"
              options={metricOptions}
              value={metric}
              onChange={setMetric}
              className="flex-1"
            />
          </div>

          {/* Current Value Display */}
          <div className="mb-5 sm:mb-6 p-4 sm:p-4 bg-gradient-to-r from-slate-800/50 via-slate-800/30 to-transparent rounded-xl border border-slate-700/40 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3 sm:space-x-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${getMetricColor()}20` }}>
                  <Icon name={getMetricIcon()} size={18} className="sm:w-5 sm:h-5" style={{ color: getMetricColor() }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate mb-1">Current {metricOptions?.find(m => m?.value === metric)?.label}</p>
                  <div className="flex items-baseline space-x-1.5 sm:space-x-2">
                    <span className="text-xl sm:text-2xl font-bold text-foreground">
                      {currentValue?.toFixed(metric === 'avg-execution-time' ? 0 : 1)}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">{getMetricUnit()}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
                <div className={`flex items-center space-x-1.5 ${trend >= 0 ? 'text-success' : 'text-error'}`}>
                  <Icon name={trend >= 0 ? 'TrendingUp' : 'TrendingDown'} size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-sm sm:text-sm font-bold">
                    {Math.abs(trendPercentage)?.toFixed(1)}%
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">vs previous</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-48 sm:h-64 mb-4 sm:mb-6">
            <ResponsiveContainer width="100%" height="100%">
              {metric === 'error-rate' ? (
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                    formatter={(value) => [`${value}${getMetricUnit()}`, metricOptions?.find(m => m?.value === metric)?.label]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={getMetricColor()}
                    fill={getMetricColor()}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              ) : (
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                    formatter={(value) => [`${value}${getMetricUnit()}`, metricOptions?.find(m => m?.value === metric)?.label]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={getMetricColor()}
                    strokeWidth={2}
                    dot={{ fill: getMetricColor(), strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: getMetricColor(), strokeWidth: 2 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Reliability Metrics */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-3 bg-gradient-to-br from-success/10 to-success/5 rounded-xl border border-success/20 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center mx-auto mb-2">
                <Icon name="Shield" size={16} className="sm:w-5 sm:h-5 text-success" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Reliability</p>
              <p className="text-base sm:text-lg font-bold text-success">98.5%</p>
            </div>
            
            <div className="text-center p-3 sm:p-3 bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl border border-warning/20 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center mx-auto mb-2">
                <Icon name="Zap" size={16} className="sm:w-5 sm:h-5 text-warning" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Avg Response</p>
              <p className="text-base sm:text-lg font-bold text-warning">145ms</p>
            </div>
            
            <div className="text-center p-3 sm:p-3 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-2">
                <Icon name="Activity" size={16} className="sm:w-5 sm:h-5 text-accent" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Uptime</p>
              <p className="text-base sm:text-lg font-bold text-accent">99.9%</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformanceTrendsPanel;