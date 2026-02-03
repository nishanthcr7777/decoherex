import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Modal from '../../../components/ui/Modal';
import { Card, CardContent } from '../../../components/ui/card';
import Snackbar from '../../../components/ui/Snackbar';

const SavedCircuitsList = ({ isOpen, onClose, onSelect, embedded = false }) => {
    const [circuits, setCircuits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ open: false, msg: '', type: 'success' });
    const [expandedId, setExpandedId] = useState(null);

    const fetchCircuits = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5001/api/circuits');
            if (res.ok) {
                const data = await res.json();
                setCircuits(data);
            }
        } catch (e) {
            console.error("Failed to load circuits", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (embedded || isOpen) fetchCircuits();
    }, [isOpen, embedded]);

    const showToast = (msg, type = 'success') => {
        setToast({ open: true, msg, type });
    };

    const handleCopy = (circuit, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(circuit.code);
        showToast(`Snippet "${circuit.name}" copied to clipboard!`, 'success');
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Delete this circuit?")) return;
        try {
            await fetch(`http://localhost:5001/api/circuits/${id}`, { method: 'DELETE' });
            setCircuits(prev => prev.filter(c => c.id !== id));
            if (expandedId === id) setExpandedId(null);
            showToast('Circuit deleted', 'info');
        } catch (err) {
            showToast('Failed to delete', 'error');
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const Content = (
        <div className="space-y-3">
            {loading ? (
                <div className="flex justify-center p-8 text-muted-foreground animate-pulse">Loading Library...</div>
            ) : circuits.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">No saved circuits found. Save one from the editor!</div>
            ) : (
                circuits.map(circuit => {
                    const isExpanded = expandedId === circuit.id;
                    return (
                        <Card
                            key={circuit.id}
                            className={`bg-slate-900/50 border-slate-700/50 transition-all cursor-pointer overflow-hidden group ${isExpanded ? 'ring-1 ring-accent/50 shadow-lg shadow-accent/10' : 'hover:bg-slate-800/50'}`}
                            onClick={() => toggleExpand(circuit.id)}
                        >
                            <CardContent className="p-0">
                                {/* Header - Always Visible */}
                                <div className="p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-accent/20 text-accent' : 'bg-slate-800 text-muted-foreground group-hover:text-accent'}`}>
                                            <Icon name={isExpanded ? "ChevronDown" : "ChevronRight"} size={16} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                                                {circuit.name}
                                                {circuit.backend_preference && (
                                                    <span className="text-[10px] font-normal text-muted-foreground px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                                                        {circuit.backend_preference}
                                                    </span>
                                                )}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {new Date(circuit.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => handleDelete(circuit.id, e)}
                                            className="p-2 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete"
                                        >
                                            <Icon name="Trash2" size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Content - Code Editor View */}
                                {isExpanded && (
                                    <div className="border-t border-slate-800/50 bg-slate-950/30 animate-in slide-in-from-top-2 duration-200">
                                        <div className="p-4 space-y-3">
                                            {circuit.description && (
                                                <p className="text-sm text-muted-foreground italic border-l-2 border-accent/30 pl-3">
                                                    {circuit.description}
                                                </p>
                                            )}

                                            <div className="relative group/code rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                                                <div className="flex items-center justify-between px-3 py-2 bg-slate-900/50 border-b border-slate-800">
                                                    <span className="text-xs font-mono text-muted-foreground">main.py</span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => handleCopy(circuit, e)}
                                                            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-800 text-xs font-medium text-muted-foreground hover:text-white transition-colors"
                                                        >
                                                            <Icon name="Copy" size={12} /> Copy Code
                                                        </button>
                                                        {onSelect && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onSelect(circuit); }}
                                                                className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent text-xs font-medium text-white hover:bg-accent/90 shadow-lg shadow-accent/20 transition-colors"
                                                            >
                                                                <Icon name="Upload" size={12} /> Load Circuit
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <pre className="p-4 font-mono text-xs text-blue-100 overflow-x-auto scrollbar-hide leading-relaxed">
                                                    {circuit.code}
                                                </pre>
                                            </div>

                                            {circuit.tags && circuit.tags.length > 0 && (
                                                <div className="flex gap-2 pt-1">
                                                    {circuit.tags.map(t => (
                                                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium border border-slate-700">{t}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })
            )}

            <Snackbar
                isOpen={toast.open}
                message={toast.msg}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, open: false }))}
            />
        </div>
    );

    if (embedded) {
        return (
            <div className="w-full h-full overflow-y-auto scrollbar-hide py-2">
                {Content}
            </div>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={<span className="flex items-center gap-2"><Icon name="Library" size={20} className="text-accent" /> Saved Circuits</span>}
            contentClassName="bg-slate-800/95 border border-slate-700/50 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-3xl p-6 flex flex-col max-h-[85vh]"
            bodyClassName="overflow-y-auto scrollbar-hide min-h-0 space-y-3"
        >
            {Content}
        </Modal>
    );
};

export default SavedCircuitsList;
