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
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={18} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Performance Trends</h3>
            <p className="text-sm text-muted-foreground">
              {selectedBackend ? `Historical metrics for ${selectedBackend?.name}` : 'Select a backend to view trends'}
            </p>
          </div>
        </div>
      </div>
      {!selectedBackend ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icon name="TrendingUp" size={48} className="text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">No Backend Selected</h4>
          <p className="text-muted-foreground">
            Select a backend from the recommendations to view performance trends
          </p>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
          <div className="mb-6 p-4 bg-muted/20 rounded-lg border border-slate-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name={getMetricIcon()} size={20} style={{ color: getMetricColor() }} />
                <div>
                  <p className="text-sm text-muted-foreground">Current {metricOptions?.find(m => m?.value === metric)?.label}</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-foreground">
                      {currentValue?.toFixed(metric === 'avg-execution-time' ? 0 : 1)}
                    </span>
                    <span className="text-sm text-muted-foreground">{getMetricUnit()}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`flex items-center space-x-1 ${trend >= 0 ? 'text-success' : 'text-error'}`}>
                  <Icon name={trend >= 0 ? 'TrendingUp' : 'TrendingDown'} size={16} />
                  <span className="text-sm font-medium">
                    {Math.abs(trendPercentage)?.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">vs previous</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 mb-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <Icon name="Shield" size={20} className="text-success mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Reliability</p>
              <p className="text-lg font-semibold text-foreground">98.5%</p>
            </div>
            
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <Icon name="Zap" size={20} className="text-warning mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Avg Response</p>
              <p className="text-lg font-semibold text-foreground">145ms</p>
            </div>
            
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <Icon name="Activity" size={20} className="text-accent mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-lg font-semibold text-foreground">99.9%</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformanceTrendsPanel;