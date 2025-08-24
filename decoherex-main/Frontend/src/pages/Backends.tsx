import React, { useState } from 'react';
import { Search, Filter, Cpu, Zap, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import StatusPill from '../components/UI/StatusPill';

interface Backend {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  type: 'quantum' | 'simulator';
  qubits: number;
  queueLength: number;
  errorRate: number;
  avgWaitTime: string;
  location: string;
  provider: string;
  lastUpdate: string;
  description: string;
}

const Backends = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const backends: Backend[] = [
    {
      id: 'ibm_osaka',
      name: 'IBM Osaka',
      status: 'online',
      type: 'quantum',
      qubits: 127,
      queueLength: 15,
      errorRate: 0.12,
      avgWaitTime: '2h 15m',
      location: 'Osaka, Japan',
      provider: 'IBM Quantum',
      lastUpdate: '2024-01-15T10:45:00Z',
      description: 'Eagle r3 processor with 127 qubits'
    },
    {
      id: 'ibm_kyoto',
      name: 'IBM Kyoto',
      status: 'online',
      type: 'quantum',
      qubits: 127,
      queueLength: 8,
      errorRate: 0.08,
      avgWaitTime: '1h 30m',
      location: 'Kyoto, Japan',
      provider: 'IBM Quantum',
      lastUpdate: '2024-01-15T10:42:00Z',
      description: 'Eagle r3 processor with 127 qubits'
    },
    {
      id: 'ibm_sherbrooke',
      name: 'IBM Sherbrooke',
      status: 'maintenance',
      type: 'quantum',
      qubits: 127,
      queueLength: 0,
      errorRate: 0.15,
      avgWaitTime: 'N/A',
      location: 'Sherbrooke, Canada',
      provider: 'IBM Quantum',
      lastUpdate: '2024-01-15T08:30:00Z',
      description: 'Eagle r3 processor - Scheduled maintenance'
    },
    {
      id: 'qasm_simulator',
      name: 'QASM Simulator',
      status: 'online',
      type: 'simulator',
      qubits: 32,
      queueLength: 2,
      errorRate: 0.00,
      avgWaitTime: '< 1m',
      location: 'Cloud',
      provider: 'IBM Quantum',
      lastUpdate: '2024-01-15T10:45:00Z',
      description: 'High-performance quantum circuit simulator'
    },
    {
      id: 'google_sycamore',
      name: 'Google Sycamore',
      status: 'online',
      type: 'quantum',
      qubits: 70,
      queueLength: 25,
      errorRate: 0.18,
      avgWaitTime: '4h 20m',
      location: 'Santa Barbara, USA',
      provider: 'Google Quantum AI',
      lastUpdate: '2024-01-15T10:40:00Z',
      description: 'Sycamore quantum processor'
    },
    {
      id: 'rigetti_aspen',
      name: 'Rigetti Aspen-M-3',
      status: 'offline',
      type: 'quantum',
      qubits: 80,
      queueLength: 0,
      errorRate: 0.22,
      avgWaitTime: 'N/A',
      location: 'Berkeley, USA',
      provider: 'Rigetti Computing',
      lastUpdate: '2024-01-15T06:15:00Z',
      description: 'Temporarily offline for calibration'
    }
  ];

  const filteredBackends = backends.filter(backend => {
    const matchesSearch = backend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         backend.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || backend.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || backend.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'offline':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'maintenance':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'quantum' ? (
      <Zap className="w-5 h-5 text-cyan-400" />
    ) : (
      <Cpu className="w-5 h-5 text-purple-400" />
    );
  };

  const formatLastUpdate = (dateString: string) => {
    const now = new Date();
    const updated = new Date(dateString);
    const diffMs = now.getTime() - updated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)}h ago`;
    } else {
      return `${Math.floor(diffMins / 1440)}d ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Quantum Backends</h1>
        <p className="text-gray-400 mt-1">Monitor available quantum computing backends and simulators</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search backends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Types</option>
                <option value="quantum">Quantum</option>
                <option value="simulator">Simulator</option>
              </select>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Backend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBackends.map((backend) => (
          <div key={backend.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getTypeIcon(backend.type)}
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200">
                    {backend.name}
                  </h3>
                  <p className="text-sm text-gray-400">{backend.provider}</p>
                </div>
              </div>
              {getStatusIcon(backend.status)}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm mb-4">{backend.description}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-sm text-gray-400">Qubits</div>
                <div className="text-xl font-bold text-white">{backend.qubits}</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-sm text-gray-400">Queue Length</div>
                <div className="text-xl font-bold text-white">{backend.queueLength}</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-sm text-gray-400">Error Rate</div>
                <div className="text-xl font-bold text-white">{(backend.errorRate * 100).toFixed(2)}%</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-sm text-gray-400">Avg Wait</div>
                <div className="text-xl font-bold text-white">{backend.avgWaitTime}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <div>
                <div className="text-sm text-gray-400">Location</div>
                <div className="text-sm text-white">{backend.location}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Updated</div>
                <div className="text-sm text-white">{formatLastUpdate(backend.lastUpdate)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBackends.length === 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center">
          <div className="text-gray-400 text-lg mb-2">No backends found</div>
          <div className="text-gray-500">Try adjusting your search or filter criteria</div>
        </div>
      )}
    </div>
  );
};

export default Backends;