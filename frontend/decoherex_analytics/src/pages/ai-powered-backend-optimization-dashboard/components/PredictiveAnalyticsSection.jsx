import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';


const PredictiveAnalyticsSection = ({ constraints }) => {
  const [activeTab, setActiveTab] = useState('queue-optimization');

  // Mock predictive data
  const queueOptimizationData = [
    { time: '09:00', waitTime: 5, optimalWaitTime: 3, jobs: 12 },
    { time: '10:00', waitTime: 8, optimalWaitTime: 4, jobs: 18 },
    { time: '11:00', waitTime: 15, optimalWaitTime: 7, jobs: 25 },
    { time: '12:00', waitTime: 22, optimalWaitTime: 12, jobs: 35 },
    { time: '13:00', waitTime: 18, optimalWaitTime: 10, jobs: 28 },
    { time: '14:00', waitTime: 12, optimalWaitTime: 6, jobs: 20 },
    { time: '15:00', waitTime: 9, optimalWaitTime: 5, jobs: 15 },
    { time: '16:00', waitTime: 14, optimalWaitTime: 8, jobs: 22 }
  ];

  const schedulingRecommendations = [
    {
      id: 1,
      timeSlot: '09:30 - 10:00',
      backend: 'IBM Quantum - 127 qubits',
      confidence: 92,
      waitTime: 3,
      reason: 'Low queue density, optimal circuit depth match',
      savings: '18 minutes'
    },
    {
      id: 2,
      timeSlot: '14:15 - 14:45',
      backend: 'Google Sycamore - 70 qubits',
      confidence: 87,
      waitTime: 6,
      reason: 'High success rate for similar job types',
      savings: '12 minutes'
    },
    {
      id: 3,
      timeSlot: '16:00 - 16:30',
      backend: 'IonQ Aria - 32 qubits',
      confidence: 84,
      waitTime: 8,
      reason: 'Error tolerance alignment, stable performance',
      savings: '9 minutes'
    }
  ];

  const capacityForecast = [
    { day: 'Mon', utilization: 75, predicted: 78, capacity: 100 },
    { day: 'Tue', utilization: 82, predicted: 85, capacity: 100 },
    { day: 'Wed', utilization: 68, predicted: 72, capacity: 100 },
    { day: 'Thu', utilization: 91, predicted: 88, capacity: 100 },
    { day: 'Fri', utilization: 85, predicted: 89, capacity: 100 },
    { day: 'Sat', utilization: 45, predicted: 48, capacity: 100 },
    { day: 'Sun', utilization: 38, predicted: 42, capacity: 100 }
  ];

  const tabs = [
    { id: 'queue-optimization', label: 'Queue Optimization', icon: 'Clock' },
    { id: 'scheduling', label: 'Optimal Scheduling', icon: 'Calendar' },
    { id: 'capacity-forecast', label: 'Capacity Forecast', icon: 'TrendingUp' }
  ];

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 80) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-2xl border border-slate-700/40 shadow-xl shadow-black/20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-5 sm:mb-6">
        <div className="flex items-center space-x-3 sm:space-x-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-8 sm:h-8 bg-gradient-to-br from-warning/30 to-warning/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-warning/20">
            <Icon name="Brain" size={18} className="sm:w-[18px] sm:h-[18px] text-warning" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">Predictive Analytics</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              AI-powered insights for optimal job scheduling and resource allocation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-2 text-xs sm:text-sm text-muted-foreground shrink-0 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
          <Icon name="RefreshCw" size={14} className="sm:w-3.5 sm:h-3.5 text-accent/80" />
          <span className="text-xs sm:text-sm font-medium">Updated 2 min ago</span>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex space-x-2 sm:space-x-2 mb-5 sm:mb-6 overflow-x-auto scrollbar-hide pb-1 bg-slate-800/40 p-1 rounded-xl border border-slate-700/30">
        {tabs?.map((tab) => {
          const isActive = activeTab === tab?.id;
          return (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center space-x-2 sm:space-x-2 px-4 sm:px-4 py-2.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex-shrink-0
                ${isActive
                  ? 'bg-gradient-to-r from-accent/20 to-accent/10 text-accent ring-2 ring-accent/60 shadow-lg shadow-accent/20'
                  : 'bg-transparent text-muted-foreground hover:bg-slate-700/50 hover:text-foreground'
                }
              `}
            >
              <Icon name={tab?.icon} size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{tab?.label}</span>
            </button>
          );
        })}
      </div>
      {/* Tab Content */}
      {activeTab === 'queue-optimization' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={queueOptimizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="waitTime"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Current Wait Time"
                />
                <Line
                  type="monotone"
                  dataKey="optimalWaitTime"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Optimal Wait Time"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className="p-2.5 sm:p-4 bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl border border-warning/20 shadow-lg">
              <div className="flex flex-col items-center sm:items-start space-y-1 sm:space-x-2 sm:flex-row mb-1.5 sm:mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-warning/20 flex items-center justify-center mx-auto sm:mx-0">
                  <Icon name="Clock" size={12} className="sm:w-4 sm:h-4 text-warning" />
                </div>
                <span className="text-[9px] sm:text-sm font-semibold text-foreground text-center sm:text-left leading-tight">Avg Wait Reduction</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-warning mb-0.5 sm:mb-1 text-center sm:text-left">42%</p>
              <p className="text-[9px] sm:text-xs text-muted-foreground text-center sm:text-left leading-tight">With AI optimization</p>
            </div>

            <div className="p-2.5 sm:p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-xl border border-success/20 shadow-lg">
              <div className="flex flex-col items-center sm:items-start space-y-1 sm:space-x-2 sm:flex-row mb-1.5 sm:mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-success/20 flex items-center justify-center mx-auto sm:mx-0">
                  <Icon name="TrendingUp" size={12} className="sm:w-4 sm:h-4 text-success" />
                </div>
                <span className="text-[9px] sm:text-sm font-semibold text-foreground text-center sm:text-left leading-tight">Peak Efficiency</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-success mb-0.5 sm:mb-1 text-center sm:text-left">14:30</p>
              <p className="text-[9px] sm:text-xs text-muted-foreground text-center sm:text-left leading-tight">Optimal submission time</p>
            </div>

            <div className="p-2.5 sm:p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20 shadow-lg">
              <div className="flex flex-col items-center sm:items-start space-y-1 sm:space-x-2 sm:flex-row mb-1.5 sm:mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-accent/20 flex items-center justify-center mx-auto sm:mx-0">
                  <Icon name="Users" size={12} className="sm:w-4 sm:h-4 text-accent" />
                </div>
                <span className="text-[9px] sm:text-sm font-semibold text-foreground text-center sm:text-left leading-tight">Queue Load</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-accent mb-0.5 sm:mb-1 text-center sm:text-left">68%</p>
              <p className="text-[9px] sm:text-xs text-muted-foreground text-center sm:text-left leading-tight">Current utilization</p>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'scheduling' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-1.5 sm:space-x-2 mb-3 sm:mb-4">
            <Icon name="Sparkles" size={12} className="sm:w-4 sm:h-4 text-accent flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-foreground">
              Recommended scheduling windows for your job constraints
            </span>
          </div>

          {schedulingRecommendations?.map((rec) => (
            <div
              key={rec?.id}
              className="p-3 sm:p-4 bg-muted/20 rounded-lg border border-slate-700/30 hover:border-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-accent">#{rec?.id}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-foreground text-xs sm:text-sm truncate">{rec?.timeSlot}</h4>
                    <p className="text-[10px] sm:text-sm text-muted-foreground truncate">{rec?.backend}</p>
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className={`text-xs sm:text-sm font-medium ${getConfidenceColor(rec?.confidence)}`}>
                    {rec?.confidence}%
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">
                    ~{rec?.waitTime} min
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-[10px] sm:text-sm text-muted-foreground">{rec?.reason}</p>
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <Icon name="Clock" size={12} className="sm:w-3.5 sm:h-3.5 text-success flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-success">Save {rec?.savings}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-5 sm:mt-6 p-4 sm:p-4 bg-gradient-to-r from-accent/15 via-accent/10 to-transparent rounded-xl border border-accent/30 shadow-lg">
            <div className="flex items-start space-x-3 sm:space-x-3">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Lightbulb" size={16} className="sm:w-4 sm:h-4 text-accent" />
              </div>
              <div className="text-xs sm:text-sm min-w-0 flex-1">
                <p className="text-foreground font-bold mb-1.5 text-sm sm:text-sm">Smart Scheduling Tip</p>
                <p className="text-muted-foreground leading-relaxed">
                  Based on your circuit depth of {constraints?.circuitDepth || 10} and error tolerance of {constraints?.errorTolerance || 0.01}, 
                  the first recommendation offers the best balance of speed and accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'capacity-forecast' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc'
                  }}
                />
                <Bar dataKey="utilization" fill="#06b6d4" name="Current Utilization" />
                <Bar dataKey="predicted" fill="#10b981" name="Predicted Utilization" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-medium text-foreground text-sm sm:text-base">Weekly Insights</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-1">
                    <Icon name="TrendingDown" size={12} className="sm:w-4 sm:h-4 text-success flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-foreground truncate">Lowest Load</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-success flex-shrink-0 ml-2">Sunday 38%</span>
                </div>
                
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-1">
                    <Icon name="TrendingUp" size={12} className="sm:w-4 sm:h-4 text-error flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-foreground truncate">Peak Load</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-error flex-shrink-0 ml-2">Thursday 91%</span>
                </div>
                
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-1">
                    <Icon name="Target" size={12} className="sm:w-4 sm:h-4 text-warning flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-foreground truncate">Optimal Days</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-warning flex-shrink-0 ml-2">Wed, Sat, Sun</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-medium text-foreground text-sm sm:text-base">Capacity Alerts</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="p-2.5 sm:p-3 bg-warning/10 border border-warning/30 rounded-lg">
                  <div className="flex items-start space-x-1.5 sm:space-x-2">
                    <Icon name="AlertTriangle" size={12} className="sm:w-4 sm:h-4 text-warning mt-0.5 flex-shrink-0" />
                    <div className="text-xs sm:text-sm min-w-0 flex-1">
                      <p className="text-foreground font-medium text-xs sm:text-sm">High Load Expected</p>
                      <p className="text-muted-foreground leading-relaxed">Thursday 12:00-15:00 may exceed 90% capacity</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2.5 sm:p-3 bg-success/10 border border-success/30 rounded-lg">
                  <div className="flex items-start space-x-1.5 sm:space-x-2">
                    <Icon name="CheckCircle" size={12} className="sm:w-4 sm:h-4 text-success mt-0.5 flex-shrink-0" />
                    <div className="text-xs sm:text-sm min-w-0 flex-1">
                      <p className="text-foreground font-medium text-xs sm:text-sm">Optimal Window</p>
                      <p className="text-muted-foreground leading-relaxed">Weekend shows 40% lower utilization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveAnalyticsSection;