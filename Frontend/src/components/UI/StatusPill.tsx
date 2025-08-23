import React from 'react';

interface StatusPillProps {
  status: 'running' | 'completed' | 'failed' | 'queued' | 'cancelled';
  size?: 'sm' | 'md';
}

const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'md' }) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'queued':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span 
      className={`
        inline-flex items-center rounded-full font-medium border
        ${getStatusStyle(status)} 
        ${sizeClasses[size]}
      `}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusPill;