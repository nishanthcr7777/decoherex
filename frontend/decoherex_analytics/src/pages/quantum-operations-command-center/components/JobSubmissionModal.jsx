import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

// Minimal list matching backend circuit options
const CIRCUIT_OPTIONS = [
  { value: 'quantum_fourier', label: 'QuantumFourier' },
  { value: 'bell_state', label: 'BellState' },
  { value: 'grover', label: 'Grover' },
  { value: 'vqe', label: 'VQE' }
];

// Minimal backend list matching backend UI
const BACKEND_OPTIONS = [
  { value: 'ibm_torino', label: 'IBM Torino' },
  { value: 'ibm_fez', label: 'IBM Fez' },
  { value: 'ibm_marrakesh', label: 'IBM Marrakesh' }
];

const JobSubmissionModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    jobName: '',
    backend: '',
    jobType: '',
    shots: 1024
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.backend) errs.backend = 'Backend is required';
    if (!formData.jobType) errs.jobType = 'Circuit is required';
    if (formData.shots < 1 || formData.shots > 10000) errs.shots = 'Shots must be 1-10000';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    // reset & close
    setFormData({ jobName: '', backend: '', jobType: '', shots: 1024 });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-lg p-6 space-y-6" onClick={(e)=>e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Icon name="Upload" size={24} className="text-accent" /> Submit Quantum Job
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="font-medium">Job Name (optional)</label>
            <Input
              type="text"
              placeholder="e.g., My First Quantum Job"
              value={formData.jobName}
              onChange={(e)=>handleInputChange('jobName', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium">Backend</label>
            <Select
              options={BACKEND_OPTIONS}
              value={formData.backend}
              onChange={(v)=>handleInputChange('backend', v)}
              placeholder="Select a backend..."
            />
            {errors.backend && <p className="text-sm text-red-600">{errors.backend}</p>}
          </div>

          <div className="space-y-1">
            <label className="font-medium">Circuit</label>
            <Select
              options={CIRCUIT_OPTIONS}
              value={formData.jobType}
              onChange={(v)=>handleInputChange('jobType', v)}
              placeholder="Select a circuit..."
            />
            {errors.jobType && <p className="text-sm text-red-600">{errors.jobType}</p>}
          </div>

          <div className="space-y-1">
            <label className="font-medium">Shots</label>
            <Input
              type="number"
              min={1}
              max={10000}
              value={formData.shots}
              onChange={(e)=>handleInputChange('shots', parseInt(e.target.value) || 0)}
            />
            {errors.shots && <p className="text-sm text-red-600">{errors.shots}</p>}
          </div>

          <div className="flex justify-end pt-2 gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Submit Job</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobSubmissionModal;
