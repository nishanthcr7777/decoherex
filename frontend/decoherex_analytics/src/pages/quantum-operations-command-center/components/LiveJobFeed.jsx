import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LiveJobFeed = ({ jobs, onJobAction }) => {
  const [filter, setFilter] = useState('all');
  const [sortedJobs, setSortedJobs] = useState([]);

  const filters = [
    { id: 'all', label: 'All Jobs', icon: 'List' },
    { id: 'failed', label: 'Failed', icon: 'AlertTriangle' },
    { id: 'running', label: 'Running', icon: 'Play' },
    { id: 'completed', label: 'Completed', icon: 'CheckCircle' }
  ];

  useEffect(() => {
    let filtered = jobs;

    if (filter !== 'all') {
      filtered = jobs?.filter(job => (job?.status || '').toLowerCase() === filter);
    }

    // Sort: failed jobs first, then by timestamp
    const sorted = [...(filtered || [])]?.sort((a, b) => {
      const timeA = new Date(a.created_at || a.submitted_at || a.timestamp || 0);
      const timeB = new Date(b.created_at || b.submitted_at || b.timestamp || 0);
      return timeB - timeA;
    });

    setSortedJobs(sorted);
  }, [jobs, filter]);

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'running': return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]';
      case 'completed': return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.2)]';
      case 'done': return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.2)]';
      case 'failed': return 'text-red-400 border-red-500/50 bg-red-500/10 shadow-[0_0_15px_rgba(248,113,113,0.2)]';
      case 'queued': return 'text-amber-400 border-amber-500/50 bg-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.2)]';
      default: return 'text-slate-400 border-slate-500/30 bg-slate-500/5';
    }
  };

  const getStatusIcon = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'running': return 'Loader';
      case 'completed': return 'CheckCircle';
      case 'done': return 'CheckCircle';
      case 'failed': return 'XCircle';
      case 'queued': return 'Clock';
      default: return 'HelpCircle';
    }
  };

  const formatTimestamp = (job) => {
    const ts = job.created_at || job.submitted_at || job.timestamp;
    if (!ts) return '';
    const date = new Date(ts);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-6 relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <Icon name="Activity" size={20} className="text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Live Feed</h2>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]" />
          <span className="text-xs font-semibold text-emerald-400 tracking-wide">
            {sortedJobs?.length} ACTIVE
          </span>
        </div>
      </div>

      {/* Modern Filters */}
      <div className="flex space-x-2 mb-6 p-1 bg-black/40 rounded-xl border border-white/5 relative z-10">
        {filters.map((opt) => {
          const isActive = filter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider
                  transition-all duration-300 flex-1 justify-center relative overflow-hidden group
                  ${isActive
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }
                `}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-100 rounded-lg shadow-lg" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon name={opt.icon} size={14} className={isActive ? 'text-white' : ''} />
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quantum Job List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar relative z-10">
        {sortedJobs.map((job) => {
          const statusStyle = getStatusColor(job.status);
          const type = job.circuit_type || job.type || 'Custom Circuit';

          return (
            <div
              key={job.job_id || job.id}
              className="group relative p-4 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusStyle.split(' ')[1].replace('text-', 'bg-').replace('border-', 'bg-')}`} />

              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full border ${statusStyle.split(' ').filter(c => c.startsWith('border')).join(' ')} ${statusStyle.split(' ').filter(c => c.startsWith('bg')).join(' ')}`}>
                      <Icon name={getStatusIcon(job.status)} size={12} className={statusStyle.split(' ')[0]} />
                    </span>
                    <span className="font-mono text-xs text-cyan-500/70 tracking-tight">
                      {(job.job_id || job.id || '').slice(0, 8)}...
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Icon name="Server" size={10} />
                      {job.backend}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-200 mb-2 truncate group-hover:text-cyan-400 transition-colors">
                    {type}
                  </h4>

                  {/* Mini Stats Row */}
                  <div className="flex items-center gap-4 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Icon name="Cpu" size={10} />
                      {job.qubits || 'N/A'} Qubits
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={10} />
                      {formatTimestamp(job)}
                    </span>
                  </div>

                </div>

                {/* Action Area */}
                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onJobAction('view', job.job_id || job.id)}
                    className="hover:bg-cyan-500/10 hover:text-cyan-400"
                  >
                    <Icon name="Eye" size={14} />
                  </Button>

                  {(job.status === 'failed' || (job.error_message)) && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/20">
                      ERROR
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {sortedJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-600">
            <Icon name="Inbox" size={48} className="mb-4 opacity-20" />
            <p>No quantum jobs authorized</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveJobFeed;