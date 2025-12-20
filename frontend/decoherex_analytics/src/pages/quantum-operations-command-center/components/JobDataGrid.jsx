import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const JobDataGrid = ({
  jobs,
  onJobAction,
  onExport,
  statusFilter,
  backendFilter,
  jobTypeFilter,
  durationFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('submitted_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedJobs, setSelectedJobs] = useState(new Set());


  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered?.filter(job =>
        (job?.job_id || job?.id)?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        job?.type?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        (job?.job_id || job?.id)?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        (job?.circuit || job?.type || '')?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        job?.backend?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        (job?.job_name && job?.job_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered?.filter(job => job?.status === statusFilter);
    }

    // Apply backend filter
    if (backendFilter !== 'all') {
      filtered = filtered?.filter(job => job?.backend === backendFilter);
    }

    // Apply job type filter
    if (jobTypeFilter !== 'all') {
      filtered = filtered?.filter(job => {
        const jobType = job?.type?.toLowerCase();
        return jobType?.includes(jobTypeFilter?.replace('-', ' ')) ||
          jobType?.includes(jobTypeFilter?.replace('-', '_'));
      });
    }

    // Apply duration filter
    if (durationFilter !== 'all') {
      const now = new Date();
      filtered = filtered?.filter(job => {
        const jobTime = new Date(job?.timestamp);
        const timeDiff = now - jobTime;

        switch (durationFilter) {
          case 'last-hour':
            return timeDiff <= 60 * 60 * 1000;
          case 'last-6-hours':
            return timeDiff <= 6 * 60 * 60 * 1000;
          case 'last-24-hours':
            return timeDiff <= 24 * 60 * 60 * 1000;
          case 'last-3-days':
            return timeDiff <= 3 * 24 * 60 * 60 * 1000;
          case 'last-week':
            return timeDiff <= 7 * 24 * 60 * 60 * 1000;
          case 'last-month':
            return timeDiff <= 30 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];

      if (sortField === 'submitted_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [jobs, searchTerm, statusFilter, backendFilter, jobTypeFilter, durationFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectJob = (jobId) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected?.has(jobId)) {
      newSelected?.delete(jobId);
    } else {
      newSelected?.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedJobs?.size === filteredAndSortedJobs?.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(filteredAndSortedJobs.map(job => job.job_id || job.id)));
    }
  };

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
    return new Date(timestamp)?.toLocaleString();
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Job Management</h2>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">
            {filteredAndSortedJobs?.length} of {jobs?.length} jobs
          </span>
          {selectedJobs?.size > 0 && (
            <span className="text-sm text-accent">
              {selectedJobs?.size} selected
            </span>
          )}
        </div>
      </div>
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search jobs by ID, type, backend, or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Bulk Actions */}
      {selectedJobs?.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-accent/10 border border-accent/20 rounded-lg mb-4">
          <span className="text-sm text-accent font-medium">
            {selectedJobs?.size} job{selectedJobs?.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              onClick={() => onExport(Array.from(selectedJobs))}
            >
              Export Selected
            </Button>
            <Button
              variant="destructive"
              size="sm"
              iconName="Trash2"
              onClick={() => {
                selectedJobs?.forEach(jobId => onJobAction('delete', jobId));
                setSelectedJobs(new Set());
              }}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}
      {/* Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left p-3">
                <input
                  type="checkbox"
                  checked={selectedJobs?.size === filteredAndSortedJobs?.length && filteredAndSortedJobs?.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border/50 bg-input text-accent focus:ring-accent"
                />
              </th>
              {/* Job Name */}
              <th
                className="text-left p-3 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => handleSort('job_name')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Job Name</span>
                  <Icon name={getSortIcon('job_name')} size={14} className="text-muted-foreground" />
                </div>
              </th>
              {/* Job ID */}
              <th
                className="text-left p-3 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => handleSort('job_id')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Job ID</span>
                  <Icon name={getSortIcon('job_id')} size={14} className="text-muted-foreground" />
                </div>
              </th>
              {/* Backend */}
              <th
                className="text-left p-3 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => handleSort('backend')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Backend</span>
                  <Icon name={getSortIcon('backend')} size={14} className="text-muted-foreground" />
                </div>
              </th>
              {/* Circuit */}
              <th
                className="text-left p-3 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => handleSort('circuit')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Circuit</span>
                  <Icon name={getSortIcon('circuit')} size={14} className="text-muted-foreground" />
                </div>
              </th>
              {/* Status */}
              <th className="text-left p-3">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
              </th>
              {/* Progress */}
              <th className="text-left p-3">
                <span className="text-sm font-medium text-muted-foreground">Progress</span>
              </th>
              {/* Submitted At */}
              <th
                className="text-left p-3 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => handleSort('submitted_at')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Submitted At</span>
                  <Icon name={getSortIcon('submitted_at')} size={14} className="text-muted-foreground" />
                </div>
              </th>
              {/* Actions */}
              <th className="text-left p-3">
                <span className="text-sm font-medium text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedJobs?.map((job) => (
              <tr
                key={job?.id || job?.job_id}
                className="border-b border-border/30 hover:bg-muted/20 transition-colors"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedJobs?.has(job?.job_id || job?.id)}
                    onChange={() => handleSelectJob(job?.job_id || job?.id)}
                    className="rounded border-border/50 bg-input text-accent focus:ring-accent"
                  />
                </td>
                {/* Job Name */}
                <td className="p-3">
                  <span className="text-sm text-foreground">{job?.job_name || `Job-${(job?.job_id || job?.id)?.slice(-4)}`}</span>
                </td>
                {/* Job ID */}
                <td className="p-3">
                  <span className="text-sm font-mono text-accent">{(job?.job_id || job?.id)?.slice(0, 8)}...</span>
                </td>
                {/* Backend */}
                <td className="p-3">
                  <span className="text-sm text-foreground">{job?.backend}</span>
                </td>
                {/* Circuit */}
                <td className="p-3">
                  <span className="text-sm text-foreground">{job?.circuit}</span>
                </td>
                {/* Status */}
                <td className="p-3">
                  {getStatusBadge(job?.status)}
                </td>
                {/* Progress */}
                <td className="p-3 w-32">
                  <div className="w-full bg-border rounded-full h-2">
                    <div className={`h-2 rounded-full bg-accent transition-all`} style={{ width: `${job?.progress || (job?.status === 'completed' || job?.status === 'DONE' ? 100 : 0)}%` }} />
                  </div>
                </td>
                {/* Submitted At */}
                <td className="p-3">
                  <span className="text-sm text-muted-foreground">{formatTimestamp(job?.submitted_at || job?.timestamp)}</span>
                </td>
                {/* Actions */}
                <td className="p-3">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Eye"
                      onClick={() => onJobAction('view', job?.job_id || job?.id)}
                      title="View details"
                    />
                    {job?.status === 'failed' && (
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="RotateCcw"
                        onClick={() => onJobAction('retry', job?.job_id || job?.id)}
                        title="Retry job"
                      />
                    )}
                    {(job?.status === 'queued' || job?.status === 'running') && (
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="X"
                        onClick={() => onJobAction('cancel', job?.job_id || job?.id)}
                        title="Cancel job"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="MoreHorizontal"
                      onClick={() => onJobAction('menu', job?.job_id || job?.id)}
                      title="More actions"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedJobs?.length === 0 && (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            <div className="text-center">
              <Icon name="Search" size={32} className="mx-auto mb-3 opacity-50" />
              <div className="text-sm font-medium mb-1">No jobs found</div>
              <div className="text-xs">
                Try adjusting your search or filter criteria
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDataGrid;