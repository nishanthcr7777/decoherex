import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';

const PerformanceTrendsChart = ({ data, selectedMetric }) => {
  const formatTooltip = (value, name) => {
    if (name === 'avgExecutionTime') return [`${value}ms`, 'Avg Execution Time'];
    if (name === 'successRate') return [`${value}%`, 'Success Rate'];
    if (name === 'errorRate') return [`${value}%`, 'Error Rate'];
    return [value, name];
  };

  const getStrokeColor = (dataKey) => {
    switch (dataKey) {
      case 'avgExecutionTime': return '#06b6d4';
      case 'successRate': return '#10b981';
      case 'errorRate': return '#ef4444';
      default: return '#06b6d4';
    }
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(value) => new Date(value)?.toLocaleDateString()}
          />
          <YAxis 
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(value) => selectedMetric === 'avgExecutionTime' ? `${value}ms` : `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f8fafc'
            }}
            formatter={formatTooltip}
            labelFormatter={(value) => `Date: ${new Date(value)?.toLocaleDateString()}`}
          />
          <Legend />
          
          {selectedMetric === 'all' ? (
            <>
              <Line
                type="monotone"
                dataKey="avgExecutionTime"
                stroke={getStrokeColor('avgExecutionTime')}
                strokeWidth={2}
                dot={{ fill: getStrokeColor('avgExecutionTime'), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: getStrokeColor('avgExecutionTime'), strokeWidth: 2 }}
                name="Avg Execution Time (ms)"
              />
              <Line
                type="monotone"
                dataKey="successRate"
                stroke={getStrokeColor('successRate')}
                strokeWidth={2}
                dot={{ fill: getStrokeColor('successRate'), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: getStrokeColor('successRate'), strokeWidth: 2 }}
                name="Success Rate (%)"
              />
              <Line
                type="monotone"
                dataKey="errorRate"
                stroke={getStrokeColor('errorRate')}
                strokeWidth={2}
                dot={{ fill: getStrokeColor('errorRate'), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: getStrokeColor('errorRate'), strokeWidth: 2 }}
                name="Error Rate (%)"
              />
            </>
          ) : (
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={getStrokeColor(selectedMetric)}
              strokeWidth={2}
              dot={{ fill: getStrokeColor(selectedMetric), strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: getStrokeColor(selectedMetric), strokeWidth: 2 }}
              name={selectedMetric === 'avgExecutionTime' ? 'Avg Execution Time (ms)' : 
                    selectedMetric === 'successRate' ? 'Success Rate (%)' : 'Error Rate (%)'}
            />
          )}
          
          <Brush 
            dataKey="date" 
            height={30} 
            stroke="#06b6d4"
            fill="#06b6d4"
            fillOpacity={0.1}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceTrendsChart;