import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CapacityUtilizationChart = ({ data, showForecast = true }) => {
  const formatTooltip = (value, name) => {
    const nameMap = {
      'current': 'Current Utilization',
      'forecast': 'Forecasted Utilization',
      'capacity': 'Total Capacity'
    };
    return [`${value}%`, nameMap?.[name] || name];
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="capacityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          
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
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
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
          
          <Area
            type="monotone"
            dataKey="capacity"
            stackId="1"
            stroke="#10b981"
            fill="url(#capacityGradient)"
            name="Total Capacity"
          />
          
          <Area
            type="monotone"
            dataKey="current"
            stackId="2"
            stroke="#06b6d4"
            fill="url(#currentGradient)"
            name="Current Utilization"
          />
          
          {showForecast && (
            <Area
              type="monotone"
              dataKey="forecast"
              stackId="3"
              stroke="#f59e0b"
              strokeDasharray="5 5"
              fill="url(#forecastGradient)"
              name="Forecasted Utilization"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CapacityUtilizationChart;