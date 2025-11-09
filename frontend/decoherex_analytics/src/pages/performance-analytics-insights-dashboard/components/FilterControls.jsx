import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterControls = ({
  dateRange,
  setDateRange,
  selectedBackends,
  setSelectedBackends,
  jobTypes,
  setJobTypes,
  comparisonMode,
  setComparisonMode,
  onRefresh,
  isRefreshing
}) => {
  const dateRangeOptions = [
    { value: '7d', label: '7 days' },
    { value: '14d', label: '14 days' },
    { value: '30d', label: '30 days' },
    { value: 'custom', label: 'Custom range' }
  ];

  const backendOptions = [
    { value: 'quantum-1', label: 'IBM Quantum 1', description: '127 qubits' },
    { value: 'quantum-2', label: 'Google Sycamore', description: '70 qubits' },
    { value: 'quantum-3', label: 'IonQ Aria', description: '32 qubits' },
    { value: 'simulator-1', label: 'Quantum Simulator 1', description: 'High-fidelity' },
    { value: 'simulator-2', label: 'Quantum Simulator 2', description: 'Noise-aware' }
  ];

  const jobTypeOptions = [
    { value: 'bell-state', label: 'Bell State' },
    { value: 'ghz', label: 'GHZ' },
    { value: 'random-circuit', label: 'Random Circuit' },
    { value: 'custom', label: 'Custom' },
    { value: 'bmit', label: 'BMIt' }
  ];

  const comparisonOptions = [
    { value: 'period', label: 'Period-over-Period' },
    { value: 'backend', label: 'Backend-to-Backend' }
  ];

  return (
    <div className="glass-card p-6 rounded-2xl mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <Select
            options={dateRangeOptions}
            value={dateRange}
            onChange={setDateRange}
            placeholder="Date range"
            className="w-32"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Icon name="Server" size={16} className="text-muted-foreground" />
          <Select
            options={backendOptions}
            value={selectedBackends}
            onChange={setSelectedBackends}
            multiple
            searchable
            placeholder="Select backends"
            className="w-48"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Icon name="Layers" size={16} className="text-muted-foreground" />
          <Select
            options={jobTypeOptions}
            value={jobTypes}
            onChange={setJobTypes}
            multiple
            placeholder="Job types"
            className="w-40"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Icon name="GitCompare" size={16} className="text-muted-foreground" />
          <Select
            options={comparisonOptions}
            value={comparisonMode}
            onChange={setComparisonMode}
            placeholder="Comparison"
            className="w-44"
          />
        </div>

        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            loading={isRefreshing}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;