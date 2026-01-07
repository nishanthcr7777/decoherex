import React, { useState, useRef, useEffect } from 'react';
import Icon from './AppIcon';

const QuantumAIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "👋 Hi! I'm Quo, your Quantum Assistant. Ask me about your job status or system health!"
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg = inputText.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInputText('');
        setIsLoading(true);

        try {
            const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
            const response = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });

            const data = await response.json();
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response || "I didn't catch that. Try again?"
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "⚠️ Connection error. My quantum link is unstable."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">

            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 h-[500px] bg-card/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto transition-all duration-300 animate-in slide-in-from-bottom-10 fade-in">

                    {/* Header */}
                    <div className="p-4 bg-accent/10 border-b border-slate-700 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-tr from-accent to-purple-500 rounded-lg flex items-center justify-center">
                                <Icon name="Bot" size={18} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Quo AI</h3>
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-xs text-muted-foreground">Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <Icon name="X" size={16} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-accent text-white rounded-br-none'
                                        : 'bg-secondary/50 text-foreground border border-slate-700/50 rounded-bl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-secondary/50 p-3 rounded-2xl rounded-bl-none border border-slate-700/50 flex space-x-1 items-center">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-slate-700 bg-card">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask about jobs..."
                                className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-4 pr-12 text-sm text-black placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !inputText.trim()}
                                className="absolute right-2 p-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Icon name="Send" size={16} />
                            </button>
                        </div>
                    </div>

                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto h-14 w-14 bg-gradient-to-tr from-accent to-purple-600 rounded-full shadow-lg shadow-accent/25 flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 group"
            >
                {isOpen ? (
                    <Icon name="ChevronDown" size={24} />
                ) : (
                    <Icon name="MessageSquare" size={24} className="group-hover:animate-wiggle" />
                )}
            </button>

        </div>
    );
};

export default QuantumAIChatWidget;
