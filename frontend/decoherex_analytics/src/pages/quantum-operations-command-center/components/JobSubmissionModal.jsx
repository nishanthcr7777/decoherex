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

  // Predict State
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  const handlePredict = async () => {
    if (!formData.customCode) {
      showToast("Please enter some code first.", 'error');
      return;
    }

    setIsPredicting(true);
    try {
      const res = await fetch('http://localhost:5001/api/ai/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.customCode,
          backend_options: BACKEND_OPTIONS.map(b => b.value)
        })
      });
      const data = await res.json();
      setPredictionData(data);
      setIsAnalysisOpen(true);
      showToast("Analysis Complete", 'success');
    } catch (e) {
      console.error(e);
      showToast("Prediction Service Failed", 'error');
    } finally {
      setIsPredicting(false);
    }
  };

  const AnalysisModal = () => (
    <Modal
      isOpen={isAnalysisOpen}
      onClose={() => setIsAnalysisOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <Icon name="Sparkles" size={20} className="text-purple-400" />
          <span className="bg-gradient-to-r from-purple-400 to-accent bg-clip-text text-transparent font-bold">
            AI Pre-flight Analysis
          </span>
        </div>
      }
      contentClassName="bg-slate-900/95 border border-purple-500/30 backdrop-blur-xl rounded-xl shadow-2xl w-full max-w-lg p-6"
    >
      {predictionData && (
        <div className="space-y-6">
          {/* Traffic Light, Error Prob & Time */}
          <div className="flex gap-4">
            <div className="flex-1 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Failure Risk</span>
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${predictionData.failure_risk === 'Low' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' :
                predictionData.failure_risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                  'bg-red-500/20 text-red-400 border-red-500/50'
                }`}>
                {predictionData.failure_risk}
              </div>
            </div>
            <div className="flex-1 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Error Prob.</span>
              <span className="text-xl font-mono text-pink-200">{predictionData.error_probability || "~10%"}</span>
            </div>
            <div className="flex-1 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Est. Time</span>
              <span className="text-xl font-mono text-blue-200">{predictionData.estimated_time || "N/A"}</span>
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-20"><Icon name="Cpu" size={48} /></div>
            <h4 className="text-sm font-medium text-purple-300 mb-1">Recommended Backend</h4>
            <div className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              {predictionData.recommended_backend}
              <button
                className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition-colors"
                onClick={() => {
                  handleInputChange('backend', predictionData.recommended_backend);
                  showToast("Backend auto-selected!", 'success');
                }}
              >
                Apply
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-[90%]">
              {predictionData.reasoning}
            </p>
          </div>

          {/* Warnings */}
          {predictionData.warnings && predictionData.warnings.length > 0 && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <h4 className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-2">
                <Icon name="AlertTriangle" size={14} /> Potential Issues
              </h4>
              <ul className="space-y-1">
                {predictionData.warnings.map((w, i) => (
                  <li key={i} className="text-xs text-red-300/80 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-red-500">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button onClick={() => setIsAnalysisOpen(false)} className="w-full">
              Close Report
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );

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
                <div className="absolute top-2 right-2 flex gap-4 pointer-events-none">
                  <span className="text-[10px] text-muted-foreground bg-black/40 px-2 py-1 rounded backdrop-blur-sm">Python / Qiskit</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Requirement: Define <code className="px-1.5 py-0.5 rounded bg-slate-800 text-accent">qc = QuantumCircuit(...)</code></span>

                {/* PREDICT BUTTON added here */}
                <button
                  type="button"
                  onClick={handlePredict}
                  disabled={isPredicting || !formData.customCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-500/50 transition-all disabled:opacity-50"
                >
                  {isPredicting ? <Icon name="Loader" size={14} className="animate-spin" /> : <Icon name="Sparkles" size={14} />}
                  {isPredicting ? "Analyzing..." : "Predict Details"}
                </button>
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

      {/* ADDED Analysis Modal Component */}
      <AnalysisModal />

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
