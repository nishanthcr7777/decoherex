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
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
            <Icon name="Brain" size={18} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Predictive Analytics</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered insights for optimal job scheduling and resource allocation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="RefreshCw" size={14} />
          <span>Updated 2 min ago</span>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted/20 p-1 rounded-lg">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${activeTab === tab?.id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }
            `}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {activeTab === 'queue-optimization' && (
        <div className="space-y-6">
          <div className="h-64">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/20 rounded-lg border border-slate-700/30">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Clock" size={16} className="text-warning" />
                <span className="text-sm font-medium text-foreground">Avg Wait Reduction</span>
              </div>
              <p className="text-2xl font-bold text-warning">42%</p>
              <p className="text-xs text-muted-foreground">With AI optimization</p>
            </div>

            <div className="p-4 bg-muted/20 rounded-lg border border-slate-700/30">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="TrendingUp" size={16} className="text-success" />
                <span className="text-sm font-medium text-foreground">Peak Efficiency</span>
              </div>
              <p className="text-2xl font-bold text-success">14:30</p>
              <p className="text-xs text-muted-foreground">Optimal submission time</p>
            </div>

            <div className="p-4 bg-muted/20 rounded-lg border border-slate-700/30">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Users" size={16} className="text-accent" />
                <span className="text-sm font-medium text-foreground">Queue Load</span>
              </div>
              <p className="text-2xl font-bold text-accent">68%</p>
              <p className="text-xs text-muted-foreground">Current utilization</p>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'scheduling' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Sparkles" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">
              Recommended scheduling windows for your job constraints
            </span>
          </div>

          {schedulingRecommendations?.map((rec) => (
            <div
              key={rec?.id}
              className="p-4 bg-muted/20 rounded-lg border border-slate-700/30 hover:border-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-accent">#{rec?.id}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{rec?.timeSlot}</h4>
                    <p className="text-sm text-muted-foreground">{rec?.backend}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-medium ${getConfidenceColor(rec?.confidence)}`}>
                    {rec?.confidence}% confidence
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ~{rec?.waitTime} min wait
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{rec?.reason}</p>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={14} className="text-success" />
                  <span className="text-sm font-medium text-success">Save {rec?.savings}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/30">
            <div className="flex items-start space-x-3">
              <Icon name="Lightbulb" size={16} className="text-accent mt-0.5" />
              <div className="text-sm">
                <p className="text-foreground font-medium mb-1">Smart Scheduling Tip</p>
                <p className="text-muted-foreground">
                  Based on your circuit depth of {constraints?.circuitDepth || 10} and error tolerance of {constraints?.errorTolerance || 0.01}, 
                  the first recommendation offers the best balance of speed and accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'capacity-forecast' && (
        <div className="space-y-6">
          <div className="h-64">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Weekly Insights</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="TrendingDown" size={16} className="text-success" />
                    <span className="text-sm text-foreground">Lowest Load</span>
                  </div>
                  <span className="text-sm font-medium text-success">Sunday 38%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="TrendingUp" size={16} className="text-error" />
                    <span className="text-sm text-foreground">Peak Load</span>
                  </div>
                  <span className="text-sm font-medium text-error">Thursday 91%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="Target" size={16} className="text-warning" />
                    <span className="text-sm text-foreground">Optimal Days</span>
                  </div>
                  <span className="text-sm font-medium text-warning">Wed, Sat, Sun</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Capacity Alerts</h4>
              <div className="space-y-3">
                <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                    <div className="text-sm">
                      <p className="text-foreground font-medium">High Load Expected</p>
                      <p className="text-muted-foreground">Thursday 12:00-15:00 may exceed 90% capacity</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-success/10 border border-success/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
                    <div className="text-sm">
                      <p className="text-foreground font-medium">Optimal Window</p>
                      <p className="text-muted-foreground">Weekend shows 40% lower utilization</p>
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