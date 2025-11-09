import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VolumeAnalysisChart = ({ data }) => {
  const jobTypeColors = {
    'bell-state': '#06b6d4',
    'ghz': '#10b981',
    'random-circuit': '#f59e0b',
    'custom': '#8b5cf6',
    'bmit': '#ef4444'
  };

  const formatTooltip = (value, name) => {
    const jobTypeLabels = {
      'bell-state': 'Bell State',
      'ghz': 'GHZ',
      'random-circuit': 'Random Circuit',
      'custom': 'Custom',
      'bmit': 'BMIt'
    };
    return [`${value} jobs`, jobTypeLabels?.[name] || name];
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            labelFormatter={(value) => `Date: ${new Date(value)?.toLocaleDateString()}`}
          />
          <Legend />
          
          {Object.keys(jobTypeColors)?.map((jobType) => (
            <Bar
              key={jobType}
              dataKey={jobType}
              stackId="jobVolume"
              fill={jobTypeColors?.[jobType]}
              name={jobType}
              radius={[0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VolumeAnalysisChart;