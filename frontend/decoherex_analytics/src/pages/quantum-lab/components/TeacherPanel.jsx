import React from 'react';
import ReactMarkdown from 'react-markdown';
import Icon from '../../../components/AppIcon';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherPanel = ({ isOpen, onClose, markdownContent, isLoading }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pointer-events-none"
                >
                    <div className="w-full max-w-4xl bg-slate-900/95 border-t border-x border-slate-700/50 rounded-t-2xl shadow-2xl backdrop-blur-xl pointer-events-auto max-h-[85vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-800/50 bg-slate-900/50 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Icon name="GraduationCap" size={24} className="text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">Quantum Code Explainer</h3>
                                    <p className="text-xs text-muted-foreground">AI Teacher Mode • Powered by Grok</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                            >
                                <Icon name="X" size={20} />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar leading-relaxed">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full animate-pulse"></div>
                                        <Icon name="Loader" size={48} className="text-purple-400 animate-spin relative z-10" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-purple-200">Analyzing Course Material...</h4>
                                    <p className="text-sm text-slate-400 max-w-xs">Reading your circuit, checking quantum gates, and preparing the lesson.</p>
                                </div>
                            ) : markdownContent ? (
                                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-purple-300 prose-strong:text-purple-200 prose-code:text-accent prose-code:bg-slate-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-950 prose-blockquote:border-l-purple-500/50 prose-blockquote:bg-purple-500/5 prose-blockquote:py-1">
                                    <ReactMarkdown>{markdownContent}</ReactMarkdown>
                                </div>
                            ) : (
                                <div className="text-center py-20 text-muted-foreground">
                                    <p>No explanation generated yet.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-slate-800/50 bg-slate-950/30 text-center text-xs text-slate-500">
                            Interactive Learning Module
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TeacherPanel;
