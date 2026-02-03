import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Snackbar from '../../../components/ui/Snackbar';

import SavedCircuitsList from './SavedCircuitsList';

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
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, msg: '', type: 'success' });

  // Save Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newCircuitName, setNewCircuitName] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const showToast = (msg, type = 'success') => {
    setToast({ open: true, msg, type });
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

  // Open the custom Save Modal instead of prompt
  const openSaveModal = () => {
    if (!formData.customCode) {
      showToast("Please enter some code first.", 'error');
      return;
    }
    setNewCircuitName('');
    setIsSaveModalOpen(true);
  };

  const confirmSaveCircuit = async () => {
    if (!newCircuitName) return;

    try {
      const res = await fetch('http://localhost:5001/api/circuits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCircuitName,
          code: formData.customCode,
          description: "Saved from Job Editor",
          backend_preference: formData.backend || "ibm_torino"
        })
      });
      if (res.ok) {
        setIsSaveModalOpen(false); // Close mini modal
        showToast("Circuit Saved Successfully!", 'success');
      } else {
        showToast("Failed to save circuit.", 'error');
      }
    } catch (e) {
      console.error(e);
      showToast("Error saving circuit.", 'error');
    }
  };

  const handleLoadCircuit = (circuit) => {
    handleInputChange('customCode', circuit.code);
    if (circuit.backend_preference) handleInputChange('backend', circuit.backend_preference);
    setIsLibraryOpen(false);
    showToast(`Loaded "${circuit.name}"`, 'info');
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <span className="flex items-center gap-2">
            <Icon name="Upload" size={20} className="text-accent" />
            Submit Quantum Job
          </span>
        }
        // INCREASED SIZE: max-w-2xl and larger min-height
        contentClassName="bg-slate-800/80 border border-slate-700/50 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-2xl p-6 flex flex-col max-h-[85vh]"
        bodyClassName="overflow-y-auto scrollbar-hide min-h-0"
      >
        {/* Mode Tabs */}
        <div className="flex border-b border-slate-700/50 -mx-6 px-6 mb-6">
          <button
            type="button"
            onClick={() => setSubmissionMode('template')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${submissionMode === 'template'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Template Circuit
          </button>
          <button
            type="button"
            onClick={() => setSubmissionMode('custom')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${submissionMode === 'custom'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Custom Code
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Job Name (optional)</label>
              <Input
                type="text"
                placeholder="e.g., My First Quantum Job"
                value={formData.jobName}
                onChange={(e) => handleInputChange('jobName', e.target.value)}
                className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-input bg-slate-900/50"
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
              {errors.backend && <p className="text-sm text-destructive">{errors.backend}</p>}
            </div>
          </div>

          {submissionMode === 'template' ? (
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Circuit Template</label>
              <Select
                options={CIRCUIT_OPTIONS}
                value={formData.jobType}
                onChange={(v) => handleInputChange('jobType', v)}
                placeholder="Select a circuit..."
              />
              {errors.jobType && <p className="text-sm text-destructive">{errors.jobType}</p>}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Custom Qiskit Code</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsLibraryOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/50 text-xs font-medium text-accent hover:bg-slate-700 transition"
                  >
                    <Icon name="BookOpen" size={14} /> Library
                  </button>
                  <button
                    type="button"
                    onClick={openSaveModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/50 text-xs font-medium text-green-400 hover:bg-slate-700 transition"
                  >
                    <Icon name="Save" size={14} /> Save Code
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  className="w-full min-h-[200px] p-4 rounded-lg font-mono text-sm border border-slate-700/50 bg-slate-950 text-blue-100 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 resize-y overflow-y-auto scrollbar-hide leading-relaxed"
                  placeholder={`from qiskit import QuantumCircuit\n\n# Your custom circuit\nqc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()`}
                  value={formData.customCode}
                  onChange={(e) => handleInputChange('customCode', e.target.value)}
                />
                <div className="absolute top-2 right-2 text-[10px] text-muted-foreground bg-black/40 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                  Python / Qiskit
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Requirement: Define <code className="px-1.5 py-0.5 rounded bg-slate-800 text-accent">qc = QuantumCircuit(...)</code> in your code.
              </div>
              {errors.customCode && <p className="text-sm text-destructive">{errors.customCode}</p>}
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
              className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-input bg-slate-900/50"
            />
            {errors.shots && <p className="text-sm text-destructive">{errors.shots}</p>}
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-700/50 mt-6">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-accent to-purple-600 text-white hover:opacity-90 transition-all shadow-lg hover:shadow-accent/20"
            >
              <Icon name="Play" size={16} className="fill-current" />
              Submit Quantum Job
            </button>
          </div>
        </form>
      </Modal>

      <SavedCircuitsList
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelect={handleLoadCircuit}
      />

      {/* Mini Modal for Saving Circuit Name */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Name Your Circuit"
        contentClassName="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-sm p-6"
      >
        <div className="space-y-4 pt-2">
          <Input
            autoFocus
            placeholder="e.g. My Entanglement Test"
            value={newCircuitName}
            onChange={(e) => setNewCircuitName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && confirmSaveCircuit()}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsSaveModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmSaveCircuit} disabled={!newCircuitName.trim()}>Save</Button>
          </div>
        </div>
      </Modal>

      <Snackbar
        isOpen={toast.open}
        message={toast.msg}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
      />
    </>
  );
};

export default JobSubmissionModal;
