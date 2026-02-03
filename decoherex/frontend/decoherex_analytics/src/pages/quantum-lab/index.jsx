import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Snackbar from '../../components/ui/Snackbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SavedCircuitsList from '../quantum-operations-command-center/components/SavedCircuitsList';

const QuantumLab = () => {
    const [prompt, setPrompt] = useState('');
    const [code, setCode] = useState('');
    const [diagram, setDiagram] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState(null);

    // Circuit explanation (fetched after simulation)
    const [explanation, setExplanation] = useState(null);
    const [explainLoading, setExplainLoading] = useState(false);

    // Toast State
    const [toast, setToast] = useState({ open: false, msg: '', type: 'success' });

    // Library & Save State
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [newCircuitName, setNewCircuitName] = useState('');

    const showToast = (msg, type = 'success') => {
        setToast({ open: true, msg, type });
    };

    const handleGenerate = async () => {
        if (!prompt) return;
        setGenerating(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5001/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data = await response.json();
            setCode(data.code);
            setDiagram(null);
            setResults(null);
            setExplanation(null);
        } catch (err) {
            setError('Failed to generate code');
            showToast('Failed to generate code', 'error');
        } finally {
            setGenerating(false);
        }
    };

    const handleSimulate = async () => {
        if (!code) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5001/api/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setDiagram(data.diagram);

            // Transform counts for Recharts
            const chartData = Object.entries(data.counts).map(([state, count]) => ({
                state: `|${state}⟩`,
                count,
            }));
            setResults(chartData);
            showToast('Simulation complete', 'success');

            // Fetch circuit explanation
            setExplainLoading(true);
            setExplanation(null);
            try {
                // Pass code + metrics to explanation API
                const explainPayload = {
                    code: code,
                    counts: data.counts,
                    shots: 1024, // simplified, could be dynamic
                    depth: data.metrics ? data.metrics.depth : null,
                    num_qubits: data.metrics ? data.metrics.num_qubits : null,
                    gates: data.metrics ? data.metrics.gates : null
                };

                const explainRes = await fetch('http://localhost:5001/api/ai/explain', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(explainPayload),
                });
                const explainData = await explainRes.json();
                setExplanation(explainData);
            } catch (e) {
                setExplanation({ summary: '', description: 'Could not load explanation.', concepts: [] });
            } finally {
                setExplainLoading(false);
            }
        } catch (err) {
            setError(err.message || 'Simulation failed');
            showToast('Simulation failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openSaveModal = () => {
        if (!code) {
            showToast('Cannot save empty code.', 'error');
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
                    code: code,
                    description: "Saved from Quantum Lab",
                    backend_preference: "simulator"
                })
            });
            if (res.ok) {
                setIsSaveModalOpen(false);
                showToast("Circuit Saved Successfully!", 'success');
            } else {
                showToast("Failed to save.", 'error');
            }
        } catch (e) {
            console.error(e);
            showToast("Error saving circuit.", 'error');
        }
    };

    const handleLoadCircuit = (circuit) => {
        setCode(circuit.code);
        setDiagram(null);
        setResults(null);
        setExplanation(null);
        setIsLibraryOpen(false);
        showToast(`Loaded "${circuit.name}"`, 'success');
    };

    return (
        <div className="min-h-screen text-foreground">
            <Header />
            <main className="pt-[3.75rem]">
                <div className="p-4 sm:p-6">
                    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Quantum Lab</h1>
                            <p className="text-sm sm:text-base text-muted-foreground mt-1">
                                Generate, visualize, and simulate quantum circuits instantly.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 min-h-[calc(100vh-14rem)] overflow-x-auto scrollbar-hide">
                            {/* Left Panel: Input & Code */}
                            <div className="flex flex-col space-y-4 sm:space-y-6">
                                {/* AI Input */}
                                <div className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                                    <label className="text-xs sm:text-sm font-medium text-foreground mb-2 block">
                                        Describe your circuit
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                                        <input
                                            type="text"
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="e.g., Create a Bell State..."
                                            className="flex-1 bg-input border border-slate-700/50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground focus:outline-none transition-all"
                                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGenerate}
                                            disabled={generating}
                                            className="shrink-0 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                            {generating ? (
                                                <span className="animate-spin h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full" />
                                            ) : (
                                                <Icon name="Sparkles" size={16} className="flex-shrink-0" />
                                            )}
                                            <span className="hidden sm:inline">Generate</span>
                                            <span className="sm:hidden">Gen</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Code Editor */}
                                <div className="flex-1 min-h-[300px] sm:min-h-0 glass-card rounded-xl sm:rounded-2xl overflow-hidden flex flex-col">
                                    <div className="bg-muted/30 px-3 sm:px-4 py-2 border-b border-slate-700/50 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">main.py</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setIsLibraryOpen(true)} className="text-xs flex items-center gap-1 text-accent hover:underline" title="Open Library">
                                                <Icon name="BookOpen" size={12} /> Library
                                            </button>
                                            <button onClick={openSaveModal} className="text-xs flex items-center gap-1 text-green-400 hover:underline" title="Save Code">
                                                <Icon name="Save" size={12} /> Save
                                            </button>
                                            <div className="flex space-x-1.5 sm:space-x-2 ml-2">
                                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                            </div>
                                        </div>
                                    </div>
                                    <textarea
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="flex-1 bg-transparent p-3 sm:p-4 font-mono text-xs sm:text-sm text-accent resize-none focus:outline-none focus:border-transparent focus:ring-0 focus:shadow-none leading-relaxed placeholder:text-muted-foreground overflow-y-auto scrollbar-hide"
                                        spellCheck={false}
                                        placeholder="# Generated code will appear here"
                                    />
                                    <div className="p-3 sm:p-4 border-t border-slate-700/50 bg-muted/20 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleSimulate}
                                            disabled={!code || loading}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                            {loading ? (
                                                <span className="animate-spin h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full" />
                                            ) : (
                                                <Icon name="Play" size={16} className="flex-shrink-0" />
                                            )}
                                            <span className="hidden sm:inline">Run Simulation</span>
                                            <span className="sm:hidden">Run</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Visualization & Results */}
                            <div className="flex flex-col space-y-4 sm:space-y-6">
                                {/* Circuit Diagram */}
                                <div className="flex-1 min-h-[250px] sm:min-h-0 glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col">
                                    <h3 className="text-xs sm:text-sm font-medium text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                                        <Icon name="Activity" size={16} className="text-accent" />
                                        Circuit Topology
                                    </h3>
                                    <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg sm:rounded-xl border border-slate-700/50 overflow-hidden relative">
                                        {diagram ? (
                                            <img src={diagram} alt="Circuit Diagram" className="max-w-full max-h-full object-contain p-2 sm:p-4" />
                                        ) : (
                                            <div className="text-muted-foreground text-xs sm:text-sm flex flex-col items-center text-center px-4">
                                                <Icon name="Cpu" size={24} className="sm:w-8 sm:h-8 mb-2 opacity-50" />
                                                <span className="hidden sm:inline">Generate code to see topology</span>
                                                <span className="sm:hidden">Generate code</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Simulation Results */}
                                <div className="flex-1 min-h-[250px] sm:min-h-0 glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col">
                                    <h3 className="text-xs sm:text-sm font-medium text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                                        <Icon name="BarChart" size={16} className="text-accent" />
                                        <span className="hidden sm:inline">Simulation Results (Counts)</span>
                                        <span className="sm:hidden">Results</span>
                                    </h3>
                                    <div className="flex-1 min-h-[200px]">
                                        {results ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={results}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                                    <XAxis dataKey="state" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                    />
                                                    <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} animationDuration={1000} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-muted-foreground text-xs sm:text-sm text-center px-4">
                                                Run simulation to view measurement results
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Circuit Description / Explanation */}
                                <div className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col">
                                    <h3 className="text-xs sm:text-sm font-medium text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                                        <Icon name="BookOpen" size={16} className="text-accent" />
                                        Circuit Explanation
                                    </h3>
                                    <div className="min-h-[120px] bg-muted/20 rounded-lg sm:rounded-xl border border-slate-700/50 p-3 sm:p-4 overflow-y-auto">
                                        {explainLoading ? (
                                            <div className="flex items-center justify-center h-24 text-muted-foreground">
                                                <span className="animate-spin h-5 w-5 border-2 border-accent/30 border-t-accent rounded-full mr-2" />
                                                <span className="text-xs sm:text-sm">Explaining circuit...</span>
                                            </div>
                                        ) : explanation ? (
                                            <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                                                {explanation.summary && (
                                                    <p className="font-medium text-accent">{explanation.summary}</p>
                                                )}
                                                {explanation.description && (
                                                    <p className="whitespace-pre-wrap">{explanation.description}</p>
                                                )}
                                                {explanation.concepts && explanation.concepts.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                        {explanation.concepts.map((c) => (
                                                            <span
                                                                key={c}
                                                                className="inline-flex items-center px-2 py-0.5 rounded-md bg-accent/20 text-accent text-[10px] sm:text-xs"
                                                            >
                                                                {c}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-muted-foreground text-xs sm:text-sm text-center px-4">
                                                Run simulation to see the circuit explanation
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 left-4 sm:left-auto bg-error/10 border border-error/50 text-error-foreground px-4 sm:px-6 py-3 sm:py-4 rounded-xl backdrop-blur-sm max-w-sm sm:max-w-none">
                        <div className="flex items-center">
                            <Icon name="AlertCircle" size={18} className="sm:w-5 sm:h-5 mr-2 sm:mr-3 text-error flex-shrink-0" />
                            <span className="text-xs sm:text-sm">{error}</span>
                        </div>
                    </div>
                )}
            </main>

            {/* Library Modal */}
            <SavedCircuitsList
                isOpen={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
                onSelect={handleLoadCircuit}
            />

            {/* Save Modal */}
            <Modal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                title="Name Your Circuit"
                contentClassName="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-sm p-6"
            >
                <div className="space-y-4 pt-2">
                    <Input
                        autoFocus
                        placeholder="e.g. Bell State Experiment"
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
        </div>
    );
};

export default QuantumLab;
