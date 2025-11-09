import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';
import { cn } from "../../lib/utils";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const navigationItems = [
    {
      label: 'Job Tracker',
      path: '/quantum-operations-command-center',
      icon: 'Activity',
      description: 'Real-time quantum job monitoring and system health oversight'
    },
    {
      label: 'Optimization',
      path: '/ai-powered-backend-optimization-dashboard',
      icon: 'Zap',
      description: 'AI-powered backend recommendations and intelligent job scheduling'
    },
    {
      label: 'Analytics',
      path: '/performance-analytics-insights-dashboard',
      icon: 'BarChart3',
      description: 'Historical performance insights and capacity planning analytics'
    }
  ];


  // Simulate WebSocket connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(prev => Math.random() > 0.1 ? true : prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      // In real implementation, trigger download based on current screen context
      const currentScreen = navigationItems?.find(item => item?.path === location?.pathname);
      console.log(`Exporting data for ${currentScreen?.label || 'current screen'}`);
    }, 2000);
  };

  const getActiveTab = () => {
    return navigationItems?.find(item => item?.path === location?.pathname);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-1000 h-16 bg-background border-b border-slate-700/50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Atom" size={20} className="text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground">DecohereX</h1>
              <span className="text-xs text-muted-foreground -mt-1">Analytics</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1">
            {navigationItems?.map((item) => {
              const isActive = location?.pathname === item?.path;
              return (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 ease-out
                    ${isActive 
                      ? 'bg-accent/20 text-accent border border-accent/30' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                  title={item?.description}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`
              w-2 h-2 rounded-full transition-colors duration-200
              ${isConnected ? 'bg-success pulse-status' : 'bg-error'}
            `} />
            <span className={`text-xs font-medium ${isConnected ? 'text-success' : 'text-error'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Export Control */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
            className="text-xs"
            title="Export current screen data"
          >
            Export
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-2 pl-4 border-l border-slate-700/50">
            <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
              <Icon name="User" size={16} className="text-primary-foreground" />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-medium text-foreground">Nishanth B</span>
              <span className="text-xs text-muted-foreground">Quantum Engineer</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;