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
    return jobs?.map(j=>({...j, _normStatus: normalizeStatus(j.status)}))
      ?.filter(job => job._normStatus === stageId);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const running = jobs?.filter(j=>normalizeStatus(j.status)==='running');
      setAnimatingJobs(new Set(running.map(j => j.job_id || j.id)));
    }, 1000);
    return () => clearInterval(interval);
  }, [jobs]);

  return (
    <div className="glass-card p-6 rounded-2xl h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Job Lifecycle Flow</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full pulse-status" />
          <span className="text-xs text-muted-foreground">Live Updates</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 h-full">
        {stages?.map((stage, index) => {
          const stageJobs = getJobsByStage(stage?.id);
          
          return (
            <div key={stage?.id} className="flex flex-col">
              {/* Stage Header */}
              <div className={`
                flex items-center justify-center space-x-2 p-3 rounded-lg mb-4
                ${getStageColor(stage?.color)}
              `}>
                <Icon name={stage?.icon} size={16} />
                <span className="text-sm font-medium">{stage?.label}</span>
                <span className="text-xs bg-black/20 px-2 py-1 rounded-full">
                  {stageJobs?.length}
                </span>
              </div>
              {/* Job Cards */}
              <div className="flex-1 space-y-2 overflow-y-auto max-h-96">
                {stageJobs?.map((job) => (
                  <div
                    key={job?.id}
                    className={`
                      p-3 bg-surface/50 rounded-lg border border-border/50
                      hover:bg-surface/70 transition-all duration-200 cursor-pointer
                      ${animatingJobs?.has(job?.id) ? 'animate-pulse' : ''}
                    `}
                    title={`Job ${job?.id} - ${job?.type} on ${job?.backend}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-accent">
                        #{(job?.job_id || job?.id)?.slice(-6)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {job?.backend}
                      </span>
                    </div>
                    
                    <div className="text-xs text-foreground mb-1">
                      {job?.type}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{job?.qubits} qubits</span>
                      <span>{job?.duration || job?.waitTime}</span>
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
                  <div className="flex items-center justify-center h-20 text-muted-foreground">
                    <div className="text-center">
                      <Icon name="Inbox" size={24} className="mx-auto mb-2 opacity-50" />
                      <span className="text-xs">No jobs</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobLifecycleFlow;