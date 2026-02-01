import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <header className="fixed top-0 left-0 right-0 z-1000 h-[4.25rem] bg-background border-b border-slate-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.25),0_0_40px_rgba(6,182,212,0.08)]">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-4 sm:space-x-8">
          <h1 
              className="text-lg sm:text-xl font-semibold text-foreground"
              style={{ textShadow: '0 0 24px rgba(6, 182, 212, 0.4), 0 0 48px rgba(6, 182, 212, 0.2)' }}
            >
              DecohereX
            </h1>

          {/* Navigation Tabs - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => {
              const isActive = location?.pathname === item?.path;
              return (
                <motion.button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={cn(
                    'relative flex items-center space-x-2 px-3 xl:px-4 py-2.5 rounded-lg text-sm font-medium overflow-hidden',
                    isActive
                      ? 'text-accent'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  title={item?.description}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-accent/20 border border-accent/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center space-x-2">
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.label}</span>
                  </span>
                </motion.button>
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
          <div className="fixed top-[4.25rem] right-0 w-64 bg-background border-l border-b border-slate-700/50 z-1000 lg:hidden shadow-xl">
            <nav className="flex flex-col p-4 space-y-2">
              {navigationItems?.map((item, index) => {
                const isActive = location?.pathname === item?.path;
                return (
                  <motion.button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium w-full text-left',
                      isActive
                        ? 'bg-accent/20 text-accent border border-accent/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon name={item?.icon} size={18} />
                    <span>{item?.label}</span>
                  </motion.button>
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