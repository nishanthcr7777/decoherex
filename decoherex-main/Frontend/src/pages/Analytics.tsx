import React from 'react';
import { TrendingUp, Users, Clock, CheckCircle, XCircle, Globe } from 'lucide-react';
import StatsCard from '../components/UI/StatsCard';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const Analytics = () => {
  const successFailureData = [
    { name: 'Successful', value: 2847, color: '#10B981' },
    { name: 'Failed', value: 423, color: '#EF4444' },
  ];

  const jobsOverTimeData = [
    { date: '2024-01-01', jobs: 45 },
    { date: '2024-01-02', jobs: 52 },
    { date: '2024-01-03', jobs: 38 },
    { date: '2024-01-04', jobs: 67 },
    { date: '2024-01-05', jobs: 71 },
    { date: '2024-01-06', jobs: 55 },
    { date: '2024-01-07', jobs: 62 },
    { date: '2024-01-08', jobs: 83 },
    { date: '2024-01-09', jobs: 79 },
    { date: '2024-01-10', jobs: 91 },
    { date: '2024-01-11', jobs: 88 },
    { date: '2024-01-12', jobs: 95 },
    { date: '2024-01-13', jobs: 102 },
    { date: '2024-01-14', jobs: 98 },
    { date: '2024-01-15', jobs: 107 },
  ];

  const globalRegions = [
    { name: 'North America', jobs: 1247, percentage: 38.1 },
    { name: 'Europe', jobs: 987, percentage: 30.2 },
    { name: 'Asia-Pacific', jobs: 823, percentage: 25.1 },
    { name: 'Other', jobs: 213, percentage: 6.6 },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Global Analytics</h1>
        <p className="text-gray-400 mt-1">Comprehensive insights into quantum computing usage worldwide</p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Jobs"
          value="3,270"
          change="+12% from last month"
          changeType="positive"
          icon={TrendingUp}
          color="cyan"
        />
        <StatsCard
          title="Success Rate"
          value="87.1%"
          change="+2.3% from last month"
          changeType="positive"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Active Users"
          value="1,247"
          change="+8% from last month"
          changeType="positive"
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Avg Queue Time"
          value="1h 42m"
          change="-15m from last month"
          changeType="positive"
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Success vs Failure Pie Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Job Success Rate</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={successFailureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {successFailureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#F1F5F9'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Successful ({successFailureData[0].value})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Failed ({successFailureData[1].value})</span>
            </div>
          </div>
        </div>

        {/* Jobs Over Time Line Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Jobs Over Time (30 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={jobsOverTimeData}>
                <XAxis 
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).getDate().toString()}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#F1F5F9'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line
                  type="monotone"
                  dataKey="jobs"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#06B6D4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Regional Heatmap */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Regional Distribution
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {globalRegions.map((region, index) => (
            <div key={region.name} className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">{region.name}</h4>
                <span className="text-sm text-cyan-400">{region.percentage}%</span>
              </div>
              <div className="mb-2">
                <div className="text-2xl font-bold text-white">{region.jobs.toLocaleString()}</div>
                <div className="text-sm text-gray-400">jobs executed</div>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${region.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* World Map Placeholder */}
        <div className="mt-8 bg-slate-700/30 rounded-lg p-8 text-center">
          <Globe className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Interactive world heatmap would be displayed here</p>
          <p className="text-sm text-gray-500 mt-2">Showing quantum job distribution by geographic region</p>
        </div>
      </div>

      {/* Backend Usage */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Most Used Backends</h3>
        <div className="space-y-4">
          {[
            { name: 'IBM Osaka', jobs: 847, percentage: 25.9 },
            { name: 'IBM Kyoto', jobs: 623, percentage: 19.1 },
            { name: 'QASM Simulator', jobs: 598, percentage: 18.3 },
            { name: 'Google Sycamore', jobs: 445, percentage: 13.6 },
            { name: 'IBM Sherbrooke', jobs: 387, percentage: 11.8 },
            { name: 'Rigetti Aspen-M-3', jobs: 370, percentage: 11.3 },
          ].map((backend, index) => (
            <div key={backend.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  index === 0 ? 'bg-cyan-400' :
                  index === 1 ? 'bg-blue-400' :
                  index === 2 ? 'bg-purple-400' :
                  index === 3 ? 'bg-green-400' :
                  index === 4 ? 'bg-yellow-400' :
                  'bg-red-400'
                }`}></div>
                <span className="text-white font-medium">{backend.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-white font-bold">{backend.jobs}</div>
                  <div className="text-sm text-gray-400">{backend.percentage}%</div>
                </div>
                <div className="w-20 bg-slate-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      index === 0 ? 'bg-cyan-400' :
                      index === 1 ? 'bg-blue-400' :
                      index === 2 ? 'bg-purple-400' :
                      index === 3 ? 'bg-green-400' :
                      index === 4 ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}
                    style={{ width: `${(backend.percentage / 25.9) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;