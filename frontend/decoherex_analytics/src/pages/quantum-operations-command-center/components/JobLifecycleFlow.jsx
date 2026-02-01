import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const JobLifecycleFlow = ({ jobs }) => {
  const [animatingJobs, setAnimatingJobs] = useState(new Set());

  const stages = [
    { id: 'queued', label: 'Queued', icon: 'Clock', color: 'slate' },
    { id: 'running', label: 'Running', icon: 'Play', color: 'warning' },
    { id: 'completed', label: 'Completed', icon: 'CheckCircle', color: 'success' },
    { id: 'failed', label: 'Failed', icon: 'XCircle', color: 'error' }
  ];

  const getStageColor = (color) => {
    switch (color) {
      case 'slate':
        return 'bg-slate-600 text-slate-100';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      case 'success':
        return 'bg-success text-success-foreground';
      case 'error':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const normalizeStatus = (status) => {
    if (!status) return 'queued';
    switch (status.toUpperCase()) {
      case 'QUEUED':
        return 'queued';
      case 'RUNNING':
        return 'running';
      case 'DONE':
      case 'COMPLETED':
        return 'completed';
      case 'ERROR':
      case 'FAILED':
      case 'CANCELLED':
        return 'failed';
      default:
        return status.toLowerCase();
    }
  };

  const getJobsByStage = (stageId) => {
    return jobs?.map(j => ({ ...j, _normStatus: normalizeStatus(j.status) }))
      ?.filter(job => job._normStatus === stageId);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const running = jobs?.filter(j => normalizeStatus(j.status) === 'running');
      setAnimatingJobs(new Set(running.map(j => j.job_id || j.id)));
    }, 1000);
    return () => clearInterval(interval);
  }, [jobs]);

  return (
    <div className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Job Lifecycle Flow</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full pulse-status" />
          <span className="text-xs text-muted-foreground">Live Updates</span>
        </div>
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-[280px] sm:min-w-0">
          {stages?.map((stage, index) => {
            const stageJobs = getJobsByStage(stage?.id);

            return (
              <div key={stage?.id || index} className="flex flex-col min-w-0">
                {/* Stage Header */}
                <div className={`
                  flex items-center justify-center space-x-1.5 sm:space-x-2 p-2.5 sm:p-3 rounded-lg mb-3 sm:mb-4
                  ${getStageColor(stage?.color)}
                `}>
                  <Icon name={stage?.icon} size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">{stage?.label}</span>
                  <span className="text-[10px] sm:text-xs bg-black/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {stageJobs?.length}
                  </span>
                </div>
                {/* Job Cards */}
                <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px] sm:max-h-96">
                  {stageJobs?.map((job) => (
                    <div
                      key={job?.job_id || job?.id}
                      className={`
                        p-2.5 sm:p-3 bg-surface/50 rounded-lg border border-border/50
                        hover:bg-surface/70 transition-all duration-200 cursor-pointer
                        ${animatingJobs?.has(job?.job_id || job?.id) ? 'animate-pulse' : ''}
                      `}
                      title={`Job ${job?.id} - ${job?.type} on ${job?.backend}`}
                    >
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
                        <span className="text-[10px] sm:text-xs font-mono text-accent truncate flex-1">
                          #{(job?.job_id || job?.id)?.slice(-6)}
                        </span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
                          {job?.backend}
                        </span>
                      </div>

                      <div className="text-[10px] sm:text-xs text-foreground mb-1 truncate">
                        {job?.type || 'N/A'}
                      </div>

                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground gap-2">
                        <span className="truncate">{job?.qubits || 'N/A'} qubits</span>
                        <span className="truncate">{job?.duration || job?.waitTime || 'N/A'}</span>
                      </div>

                      {/* Progress bar for running jobs */}
                      {stage?.id === 'running' && (
                        <div className="mt-2 w-full bg-muted/30 rounded-full h-1">
                          <div
                            className="bg-warning h-1 rounded-full transition-all duration-1000"
                            style={{ width: `${job?.progress || 0}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {stageJobs?.length === 0 && (
                    <div className="flex items-center justify-center h-16 sm:h-20 text-muted-foreground">
                      <div className="text-center">
                        <Icon name="Inbox" size={20} className="sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 opacity-50" />
                        <span className="text-[10px] sm:text-xs">No jobs</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobLifecycleFlow;