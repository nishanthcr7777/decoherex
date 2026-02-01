import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
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
      description: 'Real-time quantum job monitoring and system health oversight'
    },
    {
      label: 'Optimization',
      path: '/ai-powered-backend-optimization-dashboard',
      description: 'AI-powered backend recommendations and intelligent job scheduling'
    },
    {
      label: 'Analytics',
      path: '/performance-analytics-insights-dashboard',
      description: 'Historical performance insights and capacity planning analytics'
    },
    {
      label: 'Quantum Lab',
      path: '/quantum-lab',
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
    <header className="fixed top-0 left-0 right-0 z-1000 h-[3.75rem] bg-app-gradient border-b border-slate-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.25),0_0_40px_rgba(6,182,212,0.08)]">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-8 sm:gap-10 lg:gap-12">
          <h1
            className="text-xl sm:text-2xl font-bold text-foreground tracking-tight select-none"
            style={{
              textShadow: '0 0 20px rgba(4, 100, 130, 0.5), 0 0 40px rgba(4, 100, 130, 0.35), 0 0 60px rgba(2, 70, 95, 0.25)',
              filter: 'drop-shadow(0 0 8px rgba(4, 100, 130, 0.45))',
            }}
          >
            DecohereX
          </h1>

          {/* Navigation Tabs - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-2">
            {navigationItems?.map((item) => {
              const isActive = location?.pathname === item?.path;
              return (
                <motion.button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={cn(
                    'relative flex items-center px-4 xl:px-5 py-2.5 text-sm font-medium overflow-hidden',
                    isActive
                      ? 'text-accent'
                      : 'text-foreground/80 hover:text-foreground bg-muted/30 hover:bg-muted/50'
                  )}
                  title={item?.description}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-2xl bg-accent/20 border border-accent/40"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item?.label}</span>
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

          {/* Export - same tab style as nav */}
          <motion.button
            onClick={handleExport}
            disabled={isExporting}
            className={cn(
              'hidden sm:flex relative items-center gap-2 px-4 xl:px-5 py-2.5 text-sm font-medium overflow-hidden rounded-2xl',
              isExporting
                ? 'text-accent'
                : 'text-foreground/80 hover:text-foreground bg-muted/30 hover:bg-muted/50'
            )}
            title="Export current screen data"
            whileHover={isExporting ? undefined : { scale: 1.02 }}
            whileTap={isExporting ? undefined : { scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {isExporting && (
              <motion.span
                layoutId="nav-export-active"
                className="absolute inset-0 rounded-2xl bg-accent/20 border border-accent/40"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {isExporting ? (
                <Icon name="Loader" size={16} className="animate-spin" />
              ) : (
                <Icon name="Download" size={16} />
              )}
              <span className="hidden md:inline">Export</span>
            </span>
          </motion.button>

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
          <div className="fixed top-[3.75rem] right-0 w-64 bg-app-gradient border-l border-b border-slate-700/50 z-1000 lg:hidden shadow-xl">
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
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium w-full text-left border',
                    isExporting
                      ? 'bg-accent/20 text-accent border-accent/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent'
                  )}
                >
                  {isExporting ? (
                    <Icon name="Loader" size={18} className="animate-spin flex-shrink-0" />
                  ) : (
                    <Icon name="Download" size={18} className="flex-shrink-0" />
                  )}
                  <span>Export Data</span>
                </button>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;