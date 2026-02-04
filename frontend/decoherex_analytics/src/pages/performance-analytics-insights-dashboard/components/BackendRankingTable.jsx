import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BackendRankingTable = ({ data }) => {
  const [sortBy, setSortBy] = useState('overallScore');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const sortedData = (data && Array.isArray(data) && data.length > 0) ? [...data]?.sort((a, b) => {
    const aVal = a?.[sortBy];
    const bVal = b?.[sortBy];
    
    if (sortOrder === 'asc') {
      return aVal - bVal;
    }
    return bVal - aVal;
  }) : [];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'maintenance': return 'bg-warning';
      case 'offline': return 'bg-error';
      default: return 'bg-muted';
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Backend Performance Ranking</h3>
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
        >
          Export
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left py-3 px-2">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Backend</span>
                  <Icon name={getSortIcon('name')} size={14} />
                </button>
              </th>
              <th className="text-center py-3 px-2">Status</th>
              <th className="text-right py-3 px-2">
                <button
                  onClick={() => handleSort('overallScore')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground ml-auto"
                >
                  <span>Score</span>
                  <Icon name={getSortIcon('overallScore')} size={14} />
                </button>
              </th>
              <th className="text-right py-3 px-2">
                <button
                  onClick={() => handleSort('avgExecutionTime')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground ml-auto"
                >
                  <span>Avg Time</span>
                  <Icon name={getSortIcon('avgExecutionTime')} size={14} />
                </button>
              </th>
              <th className="text-right py-3 px-2">
                <button
                  onClick={() => handleSort('successRate')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground ml-auto"
                >
                  <span>Success</span>
                  <Icon name={getSortIcon('successRate')} size={14} />
                </button>
              </th>
              <th className="text-right py-3 px-2">
                <button
                  onClick={() => handleSort('utilization')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground ml-auto"
                >
                  <span>Utilization</span>
                  <Icon name={getSortIcon('utilization')} size={14} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData?.map((backend, index) => (
              <tr key={backend?.id} className="border-b border-slate-700/30 hover:bg-muted/20">
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                      <Icon name="Server" size={16} className="text-accent" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{backend?.name}</div>
                      <div className="text-xs text-muted-foreground">{backend?.description}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(backend?.status)}`} />
                    <span className="text-xs capitalize text-muted-foreground">{backend?.status}</span>
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <span className={`font-semibold ${getScoreColor(backend?.overallScore)}`}>
                    {backend?.overallScore}
                  </span>
                </td>
                <td className="py-4 px-2 text-right text-sm text-foreground">
                  {backend?.avgExecutionTime}ms
                </td>
                <td className="py-4 px-2 text-right text-sm text-foreground">
                  {backend?.successRate}%
                </td>
                <td className="py-4 px-2 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-300"
                        style={{ width: `${backend?.utilization}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">
                      {backend?.utilization}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-4 bg-muted/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-accent mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Ranking Methodology:</p>
            <p>Overall score calculated from weighted metrics: Success Rate (40%), Execution Time (30%), 
            Availability (20%), and Queue Efficiency (10%). Higher scores indicate better performance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendRankingTable;