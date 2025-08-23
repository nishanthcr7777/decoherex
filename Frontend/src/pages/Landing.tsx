import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Activity, BarChart3, Shield } from 'lucide-react';
import Button from '../components/UI/Button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold text-white">Quantum Jobs Tracker</span>
            </div>
            <Link to="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8 animate-pulse">
              <Zap className="w-4 h-4 mr-2" />
              FlightRadar for Quantum Computing
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Track Your
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Quantum Jobs </span>
              in Real-Time
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Monitor quantum computing jobs across multiple backends with real-time updates, 
              comprehensive analytics, and professional-grade observability tools.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/login">
                <Button size="lg" icon={ArrowRight}>
                  Start Tracking Jobs
                </Button>
              </Link>
              <Button variant="ghost" size="lg">
                View Demo
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-24 grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group">
              <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Real-Time Monitoring</h3>
              <p className="text-gray-400 leading-relaxed">
                Watch your quantum jobs execute in real-time with live status updates, 
                progress tracking, and detailed execution logs.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Advanced Analytics</h3>
              <p className="text-gray-400 leading-relaxed">
                Gain insights with comprehensive analytics, success rates, queue times, 
                and performance metrics across all your quantum backends.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group">
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Enterprise Grade</h3>
              <p className="text-gray-400 leading-relaxed">
                Built for production environments with role-based access, 
                admin controls, and enterprise-grade security features.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-24 text-center">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-cyan-400 mb-2">10K+</div>
                <div className="text-gray-400">Jobs Tracked</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-cyan-400 mb-2">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-cyan-400 mb-2">50+</div>
                <div className="text-gray-400">Quantum Backends</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 Quantum Jobs Tracker. Built for the quantum future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;