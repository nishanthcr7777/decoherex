import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Modal from '../../../components/ui/Modal';
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <Icon name="Upload" size={20} className="text-accent" />
          Submit Quantum Job
        </span>
      }
    >
      {/* Mode Tabs */}
      <div className="flex border-b border-border -mx-6 px-6 mb-4">
        <button
          type="button"
          onClick={() => setSubmissionMode('template')}
          className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${submissionMode === 'template'
            ? 'border-accent text-accent'
            : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          Template Circuit
        </button>
        <button
          type="button"
          onClick={() => setSubmissionMode('custom')}
          className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${submissionMode === 'custom'
            ? 'border-accent text-accent'
            : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          Custom Code
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Job Name (optional)</label>
          <Input
            type="text"
            placeholder="e.g., My First Quantum Job"
            value={formData.jobName}
            onChange={(e) => handleInputChange('jobName', e.target.value)}
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-input"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Backend</label>
          <Select
            options={BACKEND_OPTIONS}
            value={formData.backend}
            onChange={(v) => handleInputChange('backend', v)}
            placeholder="Select a backend..."
          />
          {errors.backend && <p className="text-sm text-error">{errors.backend}</p>}
        </div>

        {submissionMode === 'template' ? (
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Circuit</label>
            <Select
              options={CIRCUIT_OPTIONS}
              value={formData.jobType}
              onChange={(v) => handleInputChange('jobType', v)}
              placeholder="Select a circuit..."
            />
            {errors.jobType && <p className="text-sm text-error">{errors.jobType}</p>}
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Custom Qiskit Code</label>
            <div className="text-xs text-muted-foreground mb-1">
              Must define <code className="px-1 py-0.5 rounded bg-muted text-accent">qc = QuantumCircuit(...)</code>
            </div>
            <textarea
              className="w-full min-h-[140px] p-3 rounded-lg font-mono text-sm border border-border bg-input text-foreground focus:outline-none focus:ring-0 focus:border-border focus:shadow-none resize-y"
              placeholder={`from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()`}
              value={formData.customCode}
              onChange={(e) => handleInputChange('customCode', e.target.value)}
            />
            {errors.customCode && <p className="text-sm text-error">{errors.customCode}</p>}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Shots</label>
          <Input
            type="number"
            min={1}
            max={10000}
            value={formData.shots}
            onChange={(e) => handleInputChange('shots', parseInt(e.target.value) || 0)}
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-input"
          />
          {errors.shots && <p className="text-sm text-error">{errors.shots}</p>}
        </div>

        <div className="flex justify-end pt-4 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium border border-border bg-background hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            Submit Job
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default JobSubmissionModal;
