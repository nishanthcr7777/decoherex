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
  setDurationFilter,
  compact = false,
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

  const selectClass = compact ? 'w-28 min-w-0' : 'w-32';
  const selectClassJob = compact ? 'w-28 min-w-0' : 'w-36';
  const selectClassBackend = compact ? 'w-32 min-w-0' : 'w-40';

  return (
    <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap gap-y-2">
      {/* Filter Controls - hide label when compact */}
      {!compact && (
        <div className="hidden sm:flex items-center space-x-2">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filters:</span>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Select
          options={durationOptions}
          value={durationFilter}
          onChange={setDurationFilter}
          placeholder="Duration"
          className={selectClass}
        />
        
        <Select
          options={jobTypeOptions}
          value={jobTypeFilter}
          onChange={setJobTypeFilter}
          placeholder="Job Type"
          className={selectClassJob}
        />
        
        <Select
          options={backendOptions}
          value={backendFilter}
          onChange={setBackendFilter}
          placeholder="Backend"
          className={selectClassBackend}
        />
      </div>
    </div>
  );
};

export default FilterPanel;
