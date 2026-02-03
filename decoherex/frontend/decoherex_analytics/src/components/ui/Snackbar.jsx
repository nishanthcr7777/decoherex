import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';

/**
 * @param {string} message - The message to display
 * @param {boolean} isOpen - Whether the snackbar is visible
 * @param {function} onClose - Callback to close the snackbar
 * @param {string} type - 'success' | 'error' | 'info'
 * @param {number} duration - Auto-close duration in ms (default 3000)
 */
const Snackbar = ({ message, isOpen, onClose, type = 'success', duration = 3000 }) => {
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    const bgColors = {
        success: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400',
        error: 'bg-red-500/10 border-red-500/50 text-red-400',
        info: 'bg-blue-500/10 border-blue-500/50 text-blue-400'
    };

    const icons = {
        success: 'CheckCircle',
        error: 'AlertCircle',
        info: 'Info'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className={`fixed top-24 right-6 z-[2000] flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl ${bgColors[type] || bgColors.success}`}
                >
                    <Icon name={icons[type] || 'Info'} size={20} />
                    <span className="text-sm font-medium">{message}</span>
                    <button
                        onClick={onClose}
                        className="ml-2 hover:bg-white/10 p-1 rounded-full transition-colors"
                    >
                        <Icon name="X" size={14} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Snackbar;
