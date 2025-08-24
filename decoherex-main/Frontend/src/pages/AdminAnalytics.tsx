import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Server, Zap, AlertTriangle, Users, Crown, Trophy } from 'lucide-react';
import StatsCard from '../components/UI/StatsCard';
import StatusPill from '../components/UI/StatusPill';

const AdminAnalytics = () => {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const systemHealthData = [
    { name: 'IBM Osaka', status: 'online', load: 75, uptime: '99.9%', lastMaintenance: '2024-01-10' },
    { name: 'IBM Kyoto', status: 'online', load: 45, uptime: '99.8%', lastMaintenance: '2024-01-08' },
    { name: 'IBM Sherbrooke', status: 'maintenance', load: 0, uptime: '98.5%', lastMaintenance: '2024-01-15' },
    { name: 'Google Sycamore', status: 'online', load: 89, uptime: '99.2%', lastMaintenance: '2024-01-05' },
    { name: 'Rigetti Aspen-M-3', status: 'offline', load: 0, uptime: '97.8%', lastMaintenance: '2024-01-12' },
    { name: 'QASM Simulator', status: 'online', load: 25, uptime: '100%', lastMaintenance: 'N/A' },
  ];

  const topUsers = [
    { name: 'Alice Johnson', email: 'alice@quantum-lab.com', jobs: 247, successRate: 94.2 },
    { name: 'Bob Chen', email: 'bob@university.edu', jobs: 198, successRate: 91.8 },
    { name: 'Carol Davis', email: 'carol@research.org', jobs: 176, successRate: 89.5 },
    { name: 'David Wilson', email: 'david@tech-corp.com', jobs: 145, successRate: 92.7 },
    { name: 'Eve Martinez', email: 'eve@startup.io', jobs: 134, successRate: 88.1 },
  ];

  const getLoadColor = (load: number) => {
    if (load >= 80) return 'text-red-400';
    if (load >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getLoadBgColor = (load: number) => {
    if (load >= 80) return 'bg-red-400';
    if (load >= 60) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Shield className="w-8 h-8 text-cyan-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Analytics</h1>
          <p className="text-gray-400 mt-1">System health monitoring and user management</p>
        </div>
      </div>

      {/* System Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="System Uptime"
          value="99.2%"
          change="+0.1% from last month"
          changeType="positive"
          icon={Server}
          color="green"
        />
        <StatsCard
          title="API Latency"
          value="142ms"
          change="-8ms from yesterday"
          changeType="positive"
          icon={Zap}
          color="cyan"
        />
        <StatsCard
          title="Error Rate"
          value="0.8%"
          change="-0.3% from yesterday"
          changeType="positive"
          icon={AlertTriangle}
          color="yellow"
        />
        <StatsCard
          title="Active Backends"
          value="4/6"
          change="1 under maintenance"
          changeType="neutral"
          icon={Server}
          color="purple"
        />
      </div>

      {/* Backend Load Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Server className="w-5 h-5 mr-2" />
            Backend System Health
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Backend</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Load</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Uptime</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Last Maintenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {systemHealthData.map((backend) => (
                <tr key={backend.name} className="hover:bg-slate-700/30">
                  <td className="py-4 px-6 text-white font-medium">{backend.name}</td>
                  <td className="py-4 px-6">
                    <StatusPill status={backend.status as any} size="sm" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-medium ${getLoadColor(backend.load)}`}>
                            {backend.load}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getLoadBgColor(backend.load)}`}
                            style={{ width: `${backend.load}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-white">{backend.uptime}</td>
                  <td className="py-4 px-6 text-gray-300">{backend.lastMaintenance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Users */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Top Users (Last 30 Days)
        </h3>
        <div className="space-y-4">
          {topUsers.map((user, index) => (
            <div key={user.email} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                    'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}>
                    {index < 3 ? (
                      <Crown className="w-5 h-5 text-white" />
                    ) : (
                      <Users className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="absolute -top-1 -right-1 bg-slate-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <div className="text-white font-medium">{user.name}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{user.jobs} jobs</div>
                <div className="text-sm text-green-400">{user.successRate}% success</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Recent System Alerts
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-white font-medium">Backend Maintenance Scheduled</div>
              <div className="text-sm text-gray-400">IBM Sherbrooke will undergo maintenance on Jan 16, 2024</div>
            </div>
            <div className="text-xs text-gray-400">2h ago</div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-white font-medium">High Error Rate Detected</div>
              <div className="text-sm text-gray-400">Rigetti Aspen-M-3 showing elevated error rates</div>
            </div>
            <div className="text-xs text-gray-400">4h ago</div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-white font-medium">System Performance Improved</div>
              <div className="text-sm text-gray-400">API latency reduced by 15% after optimization</div>
            </div>
            <div className="text-xs text-gray-400">1d ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;