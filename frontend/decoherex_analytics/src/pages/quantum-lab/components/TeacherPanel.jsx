import React from 'react';
import ReactMarkdown from 'react-markdown';
import Icon from '../../../components/AppIcon';
import { motion, AnimatePresence } from 'framer-motion';

// Function to remove emojis and icons from markdown content
const removeEmojisAndIcons = (text) => {
    if (!text) return text;
    
    // Remove emoji Unicode characters (most emojis are in these ranges)
    let cleaned = text.replace(/[\u{1F600}-\u{1F64F}]/gu, ''); // Emoticons
    cleaned = cleaned.replace(/[\u{1F300}-\u{1F5FF}]/gu, ''); // Misc Symbols and Pictographs
    cleaned = cleaned.replace(/[\u{1F680}-\u{1F6FF}]/gu, ''); // Transport and Map
    cleaned = cleaned.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, ''); // Flags
    cleaned = cleaned.replace(/[\u{2600}-\u{26FF}]/gu, ''); // Misc symbols
    cleaned = cleaned.replace(/[\u{2700}-\u{27BF}]/gu, ''); // Dingbats
    cleaned = cleaned.replace(/[\u{1F900}-\u{1F9FF}]/gu, ''); // Supplemental Symbols and Pictographs
    cleaned = cleaned.replace(/[\u{1FA00}-\u{1FA6F}]/gu, ''); // Chess Symbols
    cleaned = cleaned.replace(/[\u{1FA70}-\u{1FAFF}]/gu, ''); // Symbols and Pictographs Extended-A
    cleaned = cleaned.replace(/[\u{FE00}-\u{FE0F}]/gu, ''); // Variation Selectors
    
    // Remove common emoji shortcodes like :smile:, :heart:, etc.
    cleaned = cleaned.replace(/:[a-z_+-]+:/gi, '');
    
    // Remove common icon patterns (expanded list)
    cleaned = cleaned.replace(/[❌✅⚠️🔍📊📈📉💡🎯🚀⭐🌟✨💫🔥💪👍👎👌🤝🙌👏🎉🎊🎈🎁🏆🥇🥈🥉]/g, '');
    
    // Remove emojis at the start of lines (common pattern)
    cleaned = cleaned.replace(/^[\s]*[❌✅⚠️🔍📊📈📉💡🎯🚀⭐🌟✨💫🔥💪👍👎👌🤝🙌👏🎉🎊🎈🎁🏆🥇🥈🥉]/gm, '');
    
    // Clean up spaces around removed emojis (but preserve line structure)
    cleaned = cleaned.split('\n').map(line => {
        // Remove emojis and clean up double spaces, but keep single spaces
        return line.replace(/\s{2,}/g, ' ').trim();
    }).join('\n');
    
    // Clean up multiple consecutive newlines (but keep at least one)
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    return cleaned;
};

const TeacherPanel = ({ isOpen, onClose, markdownContent, isLoading }) => {
    const cleanedContent = markdownContent ? removeEmojisAndIcons(markdownContent) : null;
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
                        <div className="flex-1 overflow-y-auto p-6 leading-relaxed [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full animate-pulse"></div>
                                        <Icon name="Loader" size={48} className="text-purple-400 animate-spin relative z-10" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-purple-200">Analyzing Course Material...</h4>
                                    <p className="text-sm text-slate-400 max-w-xs">Reading your circuit, checking quantum gates, and preparing the lesson.</p>
                                </div>
                            ) : cleanedContent ? (
                                <div className="markdown-content prose prose-invert prose-sm max-w-none 
                                    prose-headings:font-bold prose-headings:text-purple-300 prose-headings:mt-6 prose-headings:mb-4
                                    prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-0 prose-h1:text-purple-200
                                    prose-h2:text-xl prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-6 prose-h2:text-purple-300
                                    prose-h3:text-lg prose-h3:font-semibold prose-h3:mb-2 prose-h3:mt-4 prose-h3:text-purple-300
                                    prose-h4:text-base prose-h4:font-semibold prose-h4:mb-2 prose-h4:mt-4 prose-h4:text-purple-300
                                    prose-p:text-slate-300 prose-p:mb-4 prose-p:leading-7 prose-p:text-[15px]
                                    prose-strong:text-purple-200 prose-strong:font-semibold
                                    prose-ul:my-4 prose-ul:ml-6 prose-ul:list-disc prose-ul:text-slate-300
                                    prose-ol:my-4 prose-ol:ml-6 prose-ol:list-decimal prose-ol:text-slate-300
                                    prose-li:my-2 prose-li:leading-7 prose-li:text-[15px]
                                    prose-code:text-cyan-400 prose-code:bg-slate-800/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                                    prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-700/50 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                                    prose-blockquote:border-l-4 prose-blockquote:border-purple-500/50 prose-blockquote:bg-purple-500/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:my-4 prose-blockquote:text-slate-300 prose-blockquote:italic
                                    prose-table:w-full prose-table:my-4 prose-table:border-collapse
                                    prose-th:border prose-th:border-slate-700/50 prose-th:bg-slate-800/50 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:text-purple-300 prose-th:font-semibold
                                    prose-td:border prose-td:border-slate-700/50 prose-td:px-4 prose-td:py-2 prose-td:text-slate-300
                                    prose-a:text-cyan-400 prose-a:underline prose-a:hover:text-cyan-300
                                    prose-hr:border-slate-700/50 prose-hr:my-6">
                                    <ReactMarkdown>{cleanedContent}</ReactMarkdown>
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
