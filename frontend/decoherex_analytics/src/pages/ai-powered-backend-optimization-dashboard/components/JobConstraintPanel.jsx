import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-2xl border border-slate-700/40 shadow-xl shadow-black/20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-4 mb-5 sm:mb-6">
        <div className="flex items-center space-x-3 sm:space-x-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-8 sm:h-8 bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20">
            <Icon name="Settings" size={18} className="sm:w-[18px] sm:h-[18px] text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">Job Constraints</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Configure quantum job parameters for optimal backend matching</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0 flex-wrap w-full sm:w-auto">
          {isRefreshing && (
            <motion.div
              className="flex items-center gap-2 text-accent px-3 py-2 rounded-xl bg-accent/10 border border-accent/30 shadow-lg shadow-accent/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Icon name="RefreshCw" size={14} className="sm:w-4 sm:h-4 animate-spin" />
              <span className="text-xs sm:text-sm font-semibold">Updating...</span>
            </motion.div>
          )}
          <motion.div whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="flex-1 sm:flex-none">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              iconName="RotateCcw"
              iconPosition="left"
              className="rounded-xl border border-slate-600/60 bg-slate-800/40 hover:bg-slate-700/60 hover:border-slate-500 text-muted-foreground hover:text-foreground h-10 sm:h-9 min-h-10 sm:min-h-9 px-4 sm:px-4 gap-2 sm:gap-2 font-semibold transition-all shadow-md text-sm sm:text-sm w-full sm:w-[7.25rem] sm:min-w-[7.25rem]"
            >
              Reset
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="flex-1 sm:flex-none">
            <Button
              size="sm"
              onClick={handleSubmit}
              className="rounded-xl border border-transparent bg-accent text-accent-foreground hover:bg-accent/90 shadow-md shadow-accent/20 sm:shadow-lg sm:shadow-accent/30 h-10 sm:h-9 min-h-10 sm:min-h-9 px-4 sm:px-4 gap-2 sm:gap-2 font-semibold transition-all hover:shadow-accent/30 sm:hover:shadow-accent/40 text-sm sm:text-sm w-full sm:w-[7.25rem] sm:min-w-[7.25rem]"
            >
              Submit
            </Button>
          </motion.div>
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
      <div className="mt-4 sm:mt-6 p-4 sm:p-4 bg-gradient-to-r from-warning/10 via-warning/5 to-transparent rounded-xl border border-warning/20 shadow-lg">
        <div className="flex items-start space-x-3 sm:space-x-3">
          <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
            <Icon name="Lightbulb" size={16} className="sm:w-4 sm:h-4 text-warning" />
          </div>
          <div className="text-xs sm:text-sm min-w-0 flex-1">
            <p className="text-foreground font-bold mb-1.5 text-sm sm:text-sm">AI Recommendation Tips</p>
            <p className="text-muted-foreground leading-relaxed">
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