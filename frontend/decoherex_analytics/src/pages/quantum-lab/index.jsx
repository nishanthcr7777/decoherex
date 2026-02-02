import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const QuantumLab = () => {
    const [prompt, setPrompt] = useState('');
    const [code, setCode] = useState('');
    const [diagram, setDiagram] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState(null);

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
        } catch (err) {
            setError('Failed to generate code');
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
        } catch (err) {
            setError(err.message || 'Simulation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="pt-20 px-6 pb-8 max-w-7xl mx-auto">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Icon name="Cpu" size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Quantum AI Architect
                        </h1>
                        <p className="text-muted-foreground">
                            Generate, visualize, and simulate quantum circuits instantly.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
                    {/* Left Panel: Input & Code */}
                    <div className="flex flex-col space-y-6">
                        {/* AI Input */}
                        <div className="bg-card/30 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl">
                            <label className="text-sm font-medium text-slate-300 mb-2 block">
                                Describe your circuit
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g., Create a Bell State pairwise entanglement..."
                                    className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                />
                                <Button
                                    onClick={handleGenerate}
                                    loading={generating}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    <Icon name="Sparkles" size={16} className="mr-2" />
                                    Generate
                                </Button>
                            </div>
                        </div>

                        {/* Code Editor */}
                        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                            <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                                <span className="text-xs font-mono text-slate-400">main.py</span>
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                </div>
                            </div>
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="flex-1 bg-transparent p-4 font-mono text-sm text-blue-300 resize-none focus:outline-none leading-relaxed"
                                spellCheck={false}
                            />
                            <div className="p-4 border-t border-slate-800 bg-slate-900/30 flex justify-end">
                                <Button
                                    onClick={handleSimulate}
                                    loading={loading}
                                    disabled={!code}
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                    <Icon name="Play" size={16} className="mr-2" />
                                    Run Simulation
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Visualization & Results */}
                    <div className="flex flex-col space-y-6">
                        {/* Circuit Diagram */}
                        <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col">
                            <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center">
                                <Icon name="Activity" size={16} className="mr-2 text-blue-400" />
                                Circuit Topology
                            </h3>
                            <div className="flex-1 flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800/50 overflow-hidden relative">
                                {diagram ? (
                                    <img src={diagram} alt="Circuit Diagram" className="max-w-full max-h-full object-contain p-4 mix-blend-screen" />
                                ) : (
                                    <div className="text-slate-600 text-sm flex flex-col items-center">
                                        <Icon name="Cpu" size={32} className="mb-2 opacity-50" />
                                        Generate code to see topology
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Simulation Results */}
                        <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col">
                            <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center">
                                <Icon name="BarChart" size={16} className="mr-2 text-emerald-400" />
                                Simulation Results (Counts)
                            </h3>
                            <div className="flex-1 min-h-[200px]">
                                {results ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={results}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                            <XAxis dataKey="state" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                            <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            />
                                            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} animationDuration={1000} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-600 text-sm">
                                        Run simulation to view measurement results
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="fixed bottom-8 right-8 bg-red-500/10 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center">
                            <Icon name="AlertCircle" size={20} className="mr-3 text-red-400" />
                            {error}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default QuantumLab;
