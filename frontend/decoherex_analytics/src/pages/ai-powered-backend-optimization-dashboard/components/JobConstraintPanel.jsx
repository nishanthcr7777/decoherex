import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const JobConstraintPanel = ({ onConstraintsChange, isRefreshing }) => {
  const [constraints, setConstraints] = useState({
    circuitDepth: 10,
    gateCount: 25,
    errorTolerance: 0.01,
    jobType: 'BellState',
    priority: 'Medium',
    maxWaitTime: 30
  });

  const jobTypeOptions = [
    { value: 'QuantumFourier', label: 'QuantumFourier' },
    { value: 'BellState', label: 'BellState' },
    { value: 'Grover', label: 'Grover' },
    { value: 'VQE', label: 'VQE' },
    { value: 'QAOA', label: 'QAOA' }
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low Priority', description: 'Standard queue processing' },
    { value: 'Medium', label: 'Medium Priority', description: 'Balanced performance' },
    { value: 'High', label: 'High Priority', description: 'Expedited processing' }
  ];

  // Remove this useEffect as onConstraintsChange will be called on submit
  // useEffect(() => {
  //   onConstraintsChange(constraints);
  // }, [constraints, onConstraintsChange]);

  const handleConstraintChange = (field, value) => {
    setConstraints(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setConstraints({
      circuitDepth: 10,
      gateCount: 25,
      errorTolerance: 0.01,
      jobType: 'bell-state',
      priority: 'medium',
      maxWaitTime: 30
    });
    onConstraintsChange({ // Call onConstraintsChange with reset values
      circuit_depth: 10,
      gate_count: 25,
      error_tolerance: 0.01,
      job_type: 'bell-state',
      priority_level: 'medium',
      max_wait_time: 30
    });
  };

  const handleSubmit = () => {
    const formattedConstraints = {
      circuit_depth: constraints.circuitDepth,
      gate_count: constraints.gateCount,
      error_tolerance: constraints.errorTolerance,
      job_type: constraints.jobType,
      priority_level: constraints.priority,
      max_wait_time: constraints.maxWaitTime
    };
    onConstraintsChange(formattedConstraints);
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Settings" size={16} className="sm:w-[18px] sm:h-[18px] text-accent" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Job Constraints</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Configure quantum job parameters for optimal backend matching</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          {isRefreshing && (
            <div className="flex items-center space-x-2 text-accent">
              <Icon name="RefreshCw" size={14} className="sm:w-4 sm:h-4 animate-spin" />
              <span className="text-xs sm:text-sm font-medium">Updating...</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            iconName="RotateCcw"
            iconPosition="left"
            className="text-xs sm:text-sm px-3 sm:px-4"
          >
            <span className="hidden sm:inline">Reset</span>
            <span className="sm:hidden">R</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            iconName="Check"
            iconPosition="left"
            className="text-xs sm:text-sm px-3 sm:px-4"
          >
            <span className="hidden sm:inline">Submit</span>
            <span className="sm:hidden">S</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Input
            label="Circuit Depth"
            type="number"
            value={constraints?.circuitDepth}
            onChange={(e) => handleConstraintChange('circuitDepth', parseInt(e?.target?.value))}
            min={1}
            max={100}
            description="Number of quantum gate layers"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Gate Count"
            type="number"
            value={constraints?.gateCount}
            onChange={(e) => handleConstraintChange('gateCount', parseInt(e?.target?.value))}
            min={1}
            max={1000}
            description="Total quantum gates in circuit"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Error Tolerance"
            type="number"
            step="0.001"
            value={constraints?.errorTolerance}
            onChange={(e) => handleConstraintChange('errorTolerance', parseFloat(e?.target?.value))}
            min={0.001}
            max={0.1}
            description="Maximum acceptable error rate"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Select
            label="Job Type"
            options={jobTypeOptions}
            value={constraints?.jobType}
            onChange={(value) => handleConstraintChange('jobType', value)}
            description="Quantum algorithm category"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Select
            label="Priority Level"
            options={priorityOptions}
            value={constraints?.priority}
            onChange={(value) => handleConstraintChange('priority', value)}
            description="Job execution priority"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Max Wait Time (min)"
            type="number"
            value={constraints?.maxWaitTime}
            onChange={(e) => handleConstraintChange('maxWaitTime', parseInt(e?.target?.value))}
            min={1}
            max={1440}
            description="Maximum acceptable queue time"
            className="w-full"
          />
        </div>
      </div>
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/20 rounded-lg border border-slate-700/30">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <Icon name="Lightbulb" size={14} className="sm:w-4 sm:h-4 text-warning mt-0.5 flex-shrink-0" />
          <div className="text-xs sm:text-sm min-w-0">
            <p className="text-foreground font-medium mb-1">AI Optimization Tips</p>
            <p className="text-muted-foreground">
              Lower error tolerance and circuit depth improve backend matching accuracy. 
              High priority jobs may have longer wait times on premium backends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobConstraintPanel;