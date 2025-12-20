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
    customCode: '',
    shots: 1024
  });

  const [submissionMode, setSubmissionMode] = useState('template'); // 'template' | 'custom'

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.backend) errs.backend = 'Backend is required';

    if (submissionMode === 'template') {
      if (!formData.jobType) errs.jobType = 'Circuit is required';
    } else {
      if (!formData.customCode) errs.customCode = 'Code is required';
      if (!formData.customCode.includes('qc =')) errs.customCode = "Code must define 'qc = ...'";
    }

    if (formData.shots < 1 || formData.shots > 10000) errs.shots = 'Shots must be 1-10000';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...formData, mode: submissionMode });
    // reset & close
    setFormData({ jobName: '', backend: '', jobType: '', customCode: '', shots: 1024 });
    setSubmissionMode('template');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-lg p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Icon name="Upload" size={24} className="text-accent" /> Submit Quantum Job
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-border mb-4">
          <button
            type="button"
            onClick={() => setSubmissionMode('template')}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${submissionMode === 'template'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Template Circuit
          </button>
          <button
            type="button"
            onClick={() => setSubmissionMode('custom')}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${submissionMode === 'custom'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Custom Code
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="font-medium">Job Name (optional)</label>
            <Input
              type="text"
              placeholder="e.g., My First Quantum Job"
              value={formData.jobName}
              onChange={(e) => handleInputChange('jobName', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium">Backend</label>
            <Select
              options={BACKEND_OPTIONS}
              value={formData.backend}
              onChange={(v) => handleInputChange('backend', v)}
              placeholder="Select a backend..."
            />
            {errors.backend && <p className="text-sm text-red-600">{errors.backend}</p>}
          </div>



          {submissionMode === 'template' ? (
            <div className="space-y-1">
              <label className="font-medium">Circuit</label>
              <Select
                options={CIRCUIT_OPTIONS}
                value={formData.jobType}
                onChange={(v) => handleInputChange('jobType', v)}
                placeholder="Select a circuit..."
              />
              {errors.jobType && <p className="text-sm text-red-600">{errors.jobType}</p>}
            </div>
          ) : (
            <div className="space-y-1">
              <label className="font-medium">Custom Qiskit Code</label>
              <div className="text-xs text-muted-foreground mb-1">
                Must define <code>qc = QuantumCircuit(...)</code>. Avoid deprecated imports on submit.
              </div>
              <textarea
                className="w-full h-40 p-3 bg-surface border border-border rounded-lg font-mono text-sm focus:border-accent outline-none resize-none"
                placeholder={`from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()`}
                value={formData.customCode}
                onChange={(e) => handleInputChange('customCode', e.target.value)}
              />
              {errors.customCode && <p className="text-sm text-red-600">{errors.customCode}</p>}
            </div>
          )}

          <div className="space-y-1">
            <label className="font-medium">Shots</label>
            <Input
              type="number"
              min={1}
              max={10000}
              value={formData.shots}
              onChange={(e) => handleInputChange('shots', parseInt(e.target.value) || 0)}
            />
            {errors.shots && <p className="text-sm text-red-600">{errors.shots}</p>}
          </div>

          <div className="flex justify-end pt-2 gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Submit Job</Button>
          </div>
        </form>
      </div >
    </div >
  );
};

export default JobSubmissionModal;
