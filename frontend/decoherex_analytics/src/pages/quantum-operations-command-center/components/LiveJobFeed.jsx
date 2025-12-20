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
      filtered = jobs?.filter(job => job?.status === filter);
    }

    // Sort: failed jobs first, then by timestamp
    const sorted = [...filtered]?.sort((a, b) => {
      if (a?.status === 'failed' && b?.status !== 'failed') return -1;
      if (a?.status !== 'failed' && b?.status === 'failed') return 1;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    setSortedJobs(sorted);
  }, [jobs, filter]);

  const getStatusBadge = (status) => {
    const configs = {
      queued: { color: 'bg-slate-600 text-slate-100', icon: 'Clock' },
      running: { color: 'bg-warning text-warning-foreground', icon: 'Play' },
      completed: { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      failed: { color: 'bg-error text-error-foreground', icon: 'XCircle' }
    };

    const config = configs?.[status] || configs?.queued;

    return (
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

    return date?.toLocaleDateString();
  };

  return (
    <div className="glass-card p-6 rounded-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Live Job Feed</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full pulse-status" />
          <span className="text-xs text-muted-foreground">
            {sortedJobs?.length} jobs
          </span>
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4 p-1 bg-muted/20 rounded-lg">
        {filters?.map((filterOption) => (
          <button
            key={filterOption?.id}
            onClick={() => setFilter(filterOption?.id)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium
              transition-all duration-200 flex-1 justify-center
              ${filter === filterOption?.id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            <Icon name={filterOption?.icon} size={14} />
            <span>{filterOption?.label}</span>
          </button>
        ))}
      </div>
      {/* Job List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {sortedJobs?.map((job) => (
          <div
            key={job?.job_id || job?.id}
            className={`
              p-4 bg-surface/30 rounded-lg border transition-all duration-200
              hover:bg-surface/50 cursor-pointer
              ${job?.status === 'failed' ? 'border-error/50 bg-error/5' : 'border-border/50'}
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-mono text-accent">
                    #{(job?.job_id || job?.id)?.slice(-8)}
                  </span>
                  {getStatusBadge(job?.status)}
                </div>
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {job?.type}
                </h4>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Icon name="Server" size={12} />
                    <span>{job?.backend}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Cpu" size={12} />
                    <span>{job?.qubits} qubits</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{formatDuration(job?.duration || job?.waitTime)}</span>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-2">
                  {formatTimestamp(job?.timestamp)}
                </div>
                {job?.status === 'running' && (
                  <div className="w-16 bg-muted/30 rounded-full h-1">
                    <div
                      className="bg-warning h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${job?.progress || 0}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Error Details for Failed Jobs */}
            {job?.status === 'failed' && job?.error && (
              <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={14} className="text-error mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-error mb-1">
                      Error: {job?.error?.code}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {job?.error?.message}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 mt-3">
              <Button
                variant="ghost"
                size="xs"
                iconName="Eye"
                onClick={() => onJobAction('view', job?.job_id || job?.id)}
              >
                Details
              </Button>

              {job?.status === 'failed' && (
                <Button
                  variant="outline"
                  size="xs"
                  iconName="RotateCcw"
                  onClick={() => onJobAction('retry', job?.job_id || job?.id)}
                >
                  Retry
                </Button>
              )}

              {(job?.status === 'queued' || job?.status === 'running') && (
                <Button
                  variant="destructive"
                  size="xs"
                  iconName="X"
                  onClick={() => onJobAction('cancel', job?.job_id || job?.id)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ))}

        {sortedJobs?.length === 0 && (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            <div className="text-center">
              <Icon name="Inbox" size={32} className="mx-auto mb-3 opacity-50" />
              <div className="text-sm font-medium mb-1">No jobs found</div>
              <div className="text-xs">
                {filter === 'all' ? 'No jobs in the system' : `No ${filter} jobs`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveJobFeed;