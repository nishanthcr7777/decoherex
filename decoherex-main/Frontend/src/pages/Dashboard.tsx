import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import StatsCard from '../components/UI/StatsCard';
import Button from '../components/UI/Button';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  const chartData = [
    { name: 'Mon', jobs: 12 },
    { name: 'Tue', jobs: 19 },
    { name: 'Wed', jobs: 8 },
    { name: 'Thu', jobs: 25 },
    { name: 'Fri', jobs: 22 },
    { name: 'Sat', jobs: 15 },
    { name: 'Sun', jobs: 18 },
  ];

  const recentJobs = [
    { id: 'qj_001', backend: 'ibm_osaka', status: 'completed', shots: 1024, time: '2 mins ago' },
    { id: 'qj_002', backend: 'ibm_kyoto', status: 'running', shots: 4096, time: '5 mins ago' },
    { id: 'qj_003', backend: 'simulator', status: 'failed', shots: 8192, time: '10 mins ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-300">
          Monitor your quantum computing jobs and track performance across all backends.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Running Jobs"
          value={7}
          change="+2 from yesterday"
          changeType="positive"
          icon={Activity}
          color="cyan"
        />
        <StatsCard
          title="Completed Today"
          value={24}
          change="+15% from yesterday"
          changeType="positive"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Failed Jobs"
          value={3}
          change="-50% from yesterday"
          changeType="positive"
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Charts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jobs Over Time Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Jobs This Week</h3>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
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

        {/* Quick Actions */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <Link to="/tracking" className="block">
              <Button className="w-full justify-center" size="lg">
                Track New Job
              </Button>
            </Link>
            <Link to="/backends" className="block">
              <Button variant="secondary" className="w-full justify-center">
                View All Backends
              </Button>
            </Link>
            <Link to="/analytics" className="block">
              <Button variant="ghost" className="w-full justify-center">
                View Analytics
              </Button>
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Recent Activity</h4>
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-cyan-400 font-mono">{job.id}</span>
                    <span className="text-gray-400 ml-2">{job.backend}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${
                      job.status === 'completed' ? 'bg-green-400' :
                      job.status === 'running' ? 'bg-blue-400 animate-pulse' :
                      'bg-red-400'
                    }`}></span>
                    <span className="text-gray-400">{job.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;