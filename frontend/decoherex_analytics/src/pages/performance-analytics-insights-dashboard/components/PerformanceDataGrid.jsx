import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PerformanceDataGrid = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredData = data?.filter(item =>
    item?.jobId?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    item?.backend?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    item?.jobType?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData?.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success/20 text-success';
      case 'failed': return 'bg-error/20 text-error';
      case 'running': return 'bg-warning/20 text-warning';
      case 'queued': return 'bg-muted/20 text-muted-foreground';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000)?.toFixed(1)}s`;
    return `${(ms / 60000)?.toFixed(1)}m`;
  };

  const generateSparklineData = () => {
    return Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
  };

  const SparklineChart = ({ data }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
      <div className="flex items-end space-x-0.5 h-8 w-20">
        {data?.map((value, index) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className="bg-accent/60 w-1.5 rounded-t-sm"
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Detailed Performance Data</h3>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-64"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export CSV
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Job ID</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Backend</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Duration</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Queue Time</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Success Rate</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Trend</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((job) => (
                <tr key={job?.jobId} className="border-b border-slate-700/30 hover:bg-muted/20">
                  <td className="py-4 px-2">
                    <div className="font-mono text-sm text-foreground">{job?.jobId}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(job.timestamp)?.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="Server" size={16} className="text-accent" />
                      <span className="text-sm text-foreground">{job?.backend}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-sm text-foreground capitalize">{job?.jobType}</span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job?.status)}`}>
                      {job?.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right text-sm text-foreground">
                    {formatDuration(job?.executionTime)}
                  </td>
                  <td className="py-4 px-2 text-right text-sm text-foreground">
                    {formatDuration(job?.queueTime)}
                  </td>
                  <td className="py-4 px-2 text-right text-sm text-foreground">
                    {job?.successRate}%
                  </td>
                  <td className="py-4 px-2 text-center">
                    <SparklineChart data={generateSparklineData()} />
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        className="p-1 hover:bg-muted/50 rounded"
                        title="View details"
                      >
                        <Icon name="Eye" size={14} className="text-muted-foreground hover:text-foreground" />
                      </button>
                      <button
                        className="p-1 hover:bg-muted/50 rounded"
                        title="Download results"
                      >
                        <Icon name="Download" size={14} className="text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData?.length)} of {filteredData?.length} jobs
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`
                      w-8 h-8 rounded text-sm font-medium transition-colors
                      ${currentPage === page 
                        ? 'bg-accent text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        </div>
    </div>
  );
};

export default PerformanceDataGrid;