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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    },
    {
      label: 'Quantum Lab',
      path: '/quantum-lab',
      icon: 'Cpu',
      description: 'AI-assisted circuit generation and simulation'
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
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
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
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-4 sm:space-x-8">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Atom" size={18} className="sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg font-semibold text-foreground">DecohereX</h1>
              <span className="text-[10px] sm:text-xs text-muted-foreground -mt-1">Analytics</span>
            </div>
          </div>

          {/* Navigation Tabs - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => {
              const isActive = location?.pathname === item?.path;
              return (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`
                    flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg text-sm font-medium
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
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Connection Status - Hidden on small mobile */}
          <div className="hidden sm:flex items-center space-x-2">
            <div className={`
              w-2 h-2 rounded-full transition-colors duration-200
              ${isConnected ? 'bg-success pulse-status' : 'bg-error'}
            `} />
            <span className={`text-xs font-medium ${isConnected ? 'text-success' : 'text-error'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Export Control - Hidden on small mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
            className="hidden sm:flex text-xs px-3 sm:px-4"
            title="Export current screen data"
          >
            <span className="hidden md:inline">Export</span>
          </Button>

          {/* User Menu - Simplified on mobile */}
          <div className="flex items-center space-x-2 pl-2 sm:pl-4 border-l border-slate-700/50">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
              <Icon name="User" size={14} className="sm:w-4 sm:h-4 text-primary-foreground" />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-medium text-foreground">Nishanth B</span>
              <span className="text-xs text-muted-foreground">Quantum Engineer</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            aria-label="Toggle menu"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} className="text-foreground" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-999 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-16 right-0 w-64 bg-background border-l border-b border-slate-700/50 z-1000 lg:hidden shadow-xl">
            <nav className="flex flex-col p-4 space-y-2">
              {navigationItems?.map((item) => {
                const isActive = location?.pathname === item?.path;
                return (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`
                      flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-200 ease-out w-full text-left
                      ${isActive 
                        ? 'bg-accent/20 text-accent border border-accent/30' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    <Icon name={item?.icon} size={18} />
                    <span>{item?.label}</span>
                  </button>
                );
              })}
              {/* Mobile-only controls */}
              <div className="pt-4 mt-4 border-t border-slate-700/50 space-y-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className={`
                      w-2 h-2 rounded-full transition-colors duration-200
                      ${isConnected ? 'bg-success pulse-status' : 'bg-error'}
                    `} />
                    <span className={`text-sm font-medium ${isConnected ? 'text-success' : 'text-error'}`}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  loading={isExporting}
                  iconName="Download"
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  Export Data
                </Button>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;