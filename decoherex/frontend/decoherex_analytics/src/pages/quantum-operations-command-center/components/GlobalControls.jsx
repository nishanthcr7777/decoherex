import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const GlobalControls = ({ 
  jobTypeFilter,
  setJobTypeFilter,
  autoRefresh,
  setAutoRefresh,
  isConnected,
  onExport
}) => {

  const jobTypeOptions = [
    { value: 'all', label: 'All Job Types' },
    { value: 'bell_state', label: 'Bell State' },
    { value: 'ghz_state', label: 'GHZ State' },
    { value: 'random_circuit', label: 'Random Circuit' },
    { value: 'custom_circuit', label: 'Custom Circuit' },
    { value: 'benchmark', label: 'Benchmark' }
  ];

  const refreshIntervalOptions = [
    { value: 'off', label: 'Manual' },
    { value: '10', label: '10 seconds' },
    { value: '30', label: '30 seconds' },
    { value: '60', label: '1 minute' }
  ];

  return (
    <div className="bg-background/95 backdrop-blur-sm border-b border-slate-700/50 p-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Filters */}
        <div className="flex items-center space-x-4">
          {/* Job Type Filter */}
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-muted-foreground" />
            <Select
              options={jobTypeOptions}
              value={jobTypeFilter}
              onChange={setJobTypeFilter}
              placeholder="Filter by job type"
              className="w-44"
              label=""
            />
          </div>
        </div>

        {/* Right Side - Controls */}
        <div className="flex items-center space-x-4">
          {/* Auto Refresh */}
          <div className="flex items-center space-x-2">
            <Icon name="RefreshCw" size={16} className="text-muted-foreground" />
            <Select
              options={refreshIntervalOptions}
              value={autoRefresh}
              onChange={setAutoRefresh}
              placeholder="Auto refresh"
              className="w-32"
              label=""
            />
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-surface/50 rounded-lg">
            <div className={`
              w-2 h-2 rounded-full transition-colors duration-200
              ${isConnected ? 'bg-success pulse-status' : 'bg-error'}
            `} />
            <span className={`text-xs font-medium ${isConnected ? 'text-success' : 'text-error'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            <span className="text-xs text-muted-foreground">
              WebSocket
            </span>
          </div>

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
            className="text-xs"
          >
            Export Data
          </Button>

          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            onClick={() => window.location?.reload()}
            title="Manual refresh"
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalControls;