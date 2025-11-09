import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ 
  statusFilter, 
  setStatusFilter, 
  backendFilter, 
  setBackendFilter, 
  jobTypeFilter, 
  setJobTypeFilter, 
  durationFilter, 
  setDurationFilter 
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'queued', label: 'Queued' },
    { value: 'running', label: 'Running' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' }
  ];

  const backendOptions = [
    { value: 'all', label: 'All Backends' },
    { value: 'ibm_quantum_1', label: 'IBM Quantum 1' },
    { value: 'ibm_quantum_2', label: 'IBM Quantum 2' },
    { value: 'google_sycamore', label: 'Google Sycamore' },
    { value: 'ionq_aria', label: 'IonQ Aria' },
    { value: 'ibm_brisbane', label: 'IBM Brisbane' },
    { value: 'ibm_kyiv', label: 'IBM Kyiv' },
    { value: 'ibm_guadalupe', label: 'IBM Guadalupe' },
    { value: 'ibm_lagos', label: 'IBM Lagos' },
    { value: 'ibm_quito', label: 'IBM Quito' },
    { value: 'ibm_belem', label: 'IBM Belem' },
    { value: 'ibm_jakarta', label: 'IBM Jakarta' },
    { value: 'simulator_1', label: 'Simulator 1' }
  ];

  const jobTypeOptions = [
    { value: 'all', label: 'All Job Types' },
    { value: 'bell-state', label: 'Bell State' },
    { value: 'ghz-state', label: 'GHZ State' },
    { value: 'teleportation', label: 'Quantum Teleportation' },
    { value: 'grover-search', label: "Grover's Search" },
    { value: 'qft', label: 'Quantum Fourier Transform' },
    { value: 'vqe', label: 'VQE' },
    { value: 'qaoa', label: 'QAOA' },
    { value: 'custom', label: 'Custom Circuit' },
    { value: 'random-circuit', label: 'Random Circuit' },
    { value: 'benchmark', label: 'Benchmark' }
  ];

  const durationOptions = [
    { value: 'all', label: 'All Durations' },
    { value: 'last-hour', label: 'Last Hour' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'last-6-hours', label: 'Last 6 Hours' },
    { value: 'last-24-hours', label: 'Last 24 Hours' },
    { value: 'last-3-days', label: 'Last 3 Days' },
    { value: 'last-month', label: 'Last Month' }
  ];

  const hasActiveFilters = statusFilter !== 'all' || backendFilter !== 'all' || jobTypeFilter !== 'all' || durationFilter !== 'all';

  const clearAllFilters = () => {
    setStatusFilter('all');
    setBackendFilter('all');
    setJobTypeFilter('all');
    setDurationFilter('all');
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Filter Controls */}
      <div className="flex items-center space-x-2">
        <Icon name="Filter" size={16} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filters:</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Select
          options={durationOptions}
          value={durationFilter}
          onChange={setDurationFilter}
          placeholder="Duration"
          className="w-32"
        />
        
        <Select
          options={jobTypeOptions}
          value={jobTypeFilter}
          onChange={setJobTypeFilter}
          placeholder="Job Type"
          className="w-36"
        />
        
        <Select
          options={backendOptions}
          value={backendFilter}
          onChange={setBackendFilter}
          placeholder="Backend"
          className="w-40"
        />
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 flex-wrap">
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                Status: {statusOptions.find(opt => opt.value === statusFilter)?.label}
                <button
                  onClick={() => setStatusFilter('all')}
                  className="ml-1 hover:text-accent/70"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {backendFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                Backend: {backendOptions.find(opt => opt.value === backendFilter)?.label}
                <button
                  onClick={() => setBackendFilter('all')}
                  className="ml-1 hover:text-secondary/70"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {jobTypeFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">
                Type: {jobTypeOptions.find(opt => opt.value === jobTypeFilter)?.label}
                <button
                  onClick={() => setJobTypeFilter('all')}
                  className="ml-1 hover:text-warning/70"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {durationFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                Duration: {durationOptions.find(opt => opt.value === durationFilter)?.label}
                <button
                  onClick={() => setDurationFilter('all')}
                  className="ml-1 hover:text-success/70"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
          
          <button
            onClick={clearAllFilters}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
