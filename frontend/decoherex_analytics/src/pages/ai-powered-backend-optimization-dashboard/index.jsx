import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import JobConstraintPanel from './components/JobConstraintPanel';
import RecommendationCard from './components/RecommendationCard';
import BackendComparisonMatrix from './components/BackendComparisonMatrix';
import PerformanceTrendsPanel from './components/PerformanceTrendsPanel';
import PredictiveAnalyticsSection from './components/PredictiveAnalyticsSection';
import Icon from '../../components/AppIcon';

const AIBackendOptimizationDashboard = () => {
  const [constraints, setConstraints] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBackend, setSelectedBackend] = useState(null);
  const [selectedBackendsForComparison, setSelectedBackendsForComparison] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchRecommendations = useCallback(async (currentConstraints) => {
    setLoading(true);
    try {
      const AI_MODEL_API_BASE = import.meta.env.VITE_API_BASE1 || 'http://127.0.0.1:5001/api/recommend_backends';
      console.log("Attempting to fetch recommendations from:", AI_MODEL_API_BASE);
      console.log("Sending constraints to backend:", currentConstraints);
      const response = await fetch(AI_MODEL_API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentConstraints),
      });
      console.log("Fetch response:", response);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log("Received data from backend:", data);
      console.log("Recommendations array:", data.recommendations);
      // Ensure data is an array before mapping
      const recommendationsArray = Array.isArray(data.recommendations) ? data.recommendations : [];
      // Transform backend data to match frontend RecommendationCard expectations
      const transformedRecommendations = recommendationsArray.map(backend => {
        console.log('Raw backend data:', backend); // Log raw backend data
        return {
          id: backend.backend_name, // Assuming backend_name can serve as a unique ID
          name: backend.backend_name, // Map backend_name to name
          description: backend.processor_desc, // Map processor_desc to description
          type: backend.job_type === 'quantum_computing' ? 'quantum' : 'classical', // Determine type based on job_type
          status: 'online', // Assuming all recommended backends are online
          suitabilityScore: Math.round(backend.suitability * 100), // Convert suitability to percentage
          predictedWaitTime: backend.wait_time, // Map wait_time to predictedWaitTime
          successProbability: Math.round(backend.success_rate * 100), // Convert success_rate to percentage
          queueLength: backend.queue, // Map queue to queueLength
          aiConfidence: Math.round(backend.ai_confidence * 100), // Convert ai_confidence to percentage
          features: [
            `Circuit Depth: ${backend.circuit_depth}`,
            `Gate Count: ${backend.gate_count}`,
          ],
        }; // Closing curly brace for the object
      }); // Closing parenthesis for the map function
      setRecommendations(transformedRecommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations({
      circuit_depth: 10,
      gate_count: 25,
      error_tolerance: 0.01,
      job_type: 'BellState',
      priority_level: 'Medium',
      max_wait_time: 30
    });
  }, [fetchRecommendations]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleConstraintsChange = useCallback((newConstraints) => {
    setConstraints(newConstraints);
    fetchRecommendations(newConstraints);
  }, [fetchRecommendations]);

  const handleRecommendationSelect = (backend) => {
    setSelectedBackend(backend);
  };

  const handleBackendComparisonSelect = (backend) => {
    setSelectedBackendsForComparison(prev => {
      const exists = prev?.some(b => b?.id === backend?.id);
      if (exists) {
        return prev?.filter(b => b?.id !== backend?.id);
      } else if (prev?.length < 5) {
        return [...prev, backend];
      }
      return prev;
    });
  };

  // Get top 3 recommendations
  const topRecommendations = recommendations?.slice(0, 3);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-[3.75rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text tracking-tight">
                AI-Powered Backend Recommendation
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
                Intelligent quantum backend recommendations powered by machine learning
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-2 text-xs sm:text-sm text-muted-foreground shrink-0 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30 backdrop-blur-sm">
              <Icon name="Clock" size={14} className="sm:w-4 sm:h-4 text-accent/80" />
              <span className="hidden sm:inline">Last updated: </span>
              <span className="text-xs sm:text-sm font-medium">{lastUpdated?.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Job Constraints Panel */}
          <div className="mb-4 sm:mb-8">
            <JobConstraintPanel
              onConstraintsChange={handleConstraintsChange}
              isRefreshing={loading}
            />
          </div>

          {/* Top Recommendations Strip */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 sm:space-x-3 mb-5 sm:mb-6 p-4 rounded-xl bg-gradient-to-r from-accent/5 via-accent/3 to-transparent border border-accent/10">
              <div className="w-10 h-10 sm:w-8 sm:h-8 bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20">
                <Icon name="Star" size={18} className="sm:w-[18px] sm:h-[18px] text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1">Top AI Recommendations</h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Best backend matches based on your job constraints and historical performance
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col sm:flex-row justify-center items-center h-32 sm:h-32 gap-3 p-8 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <Icon name="Loader" size={20} className="sm:w-6 sm:h-6 animate-spin text-accent" />
                <span className="text-sm sm:text-base text-muted-foreground font-medium">Loading recommendations...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {topRecommendations?.map((backend, index) => (
                  <RecommendationCard
                    key={`${backend?.id}-${index}`}
                    backend={backend}
                    rank={index + 1}
                    isSelected={selectedBackend?.id === backend?.id}
                    onClick={handleRecommendationSelect}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-8 mb-6 sm:mb-8">
            {/* Backend Comparison Matrix - 2 columns */}
            <div className="xl:col-span-2 min-w-0">
              <BackendComparisonMatrix
                backends={recommendations}
                selectedBackends={selectedBackendsForComparison}
                onBackendSelect={handleBackendComparisonSelect}
              />
            </div>

            {/* Performance Trends Panel - 1 column */}
            <div className="xl:col-span-1">
              <PerformanceTrendsPanel selectedBackend={selectedBackend} />
            </div>
          </div>

          {/* Predictive Analytics Section - Full Width */}
          <div className="mb-6 sm:mb-8">
            <PredictiveAnalyticsSection constraints={constraints} />
          </div>

          {/* AI Model Information */}
          <div className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-2xl border border-slate-700/40 shadow-xl shadow-black/20">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-12 h-12 sm:w-12 sm:h-12 bg-gradient-to-br from-accent via-accent/80 to-secondary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/30">
                <Icon name="Cpu" size={20} className="sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-2">AI Model Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                  <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/30">
                    <p className="text-muted-foreground text-xs sm:text-sm mb-1">Model Version</p>
                    <p className="text-foreground font-semibold text-sm sm:text-sm">QuantumOpt v2.1.3</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/30">
                    <p className="text-muted-foreground text-xs sm:text-sm mb-1">Training Data</p>
                    <p className="text-foreground font-semibold text-sm sm:text-sm">2.3M quantum jobs</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/30">
                    <p className="text-muted-foreground text-xs sm:text-sm mb-1">Accuracy Rate</p>
                    <p className="text-foreground font-semibold text-sm sm:text-sm text-success">94.7%</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/30">
                    <p className="text-muted-foreground text-xs sm:text-sm mb-1">Last Retrained</p>
                    <p className="text-foreground font-semibold text-sm sm:text-sm">2 days ago</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 leading-relaxed">
                  Our AI recommendation engine analyzes historical job performance, backend characteristics,
                  and real-time queue dynamics to provide optimal backend suggestions with confidence scoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIBackendOptimizationDashboard;