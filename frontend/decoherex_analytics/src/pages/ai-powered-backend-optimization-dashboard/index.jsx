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
        const AI_MODEL_API_BASE = import.meta.env.VITE_API_BASE1 || 'http://127.0.0.1:7777/recommend_backends';
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
    // Initial fetch of recommendations when the component mounts
    fetchRecommendations({
      circuit_depth: 10,
      gate_count: 25,
      error_tolerance: 0.01,
      job_type: 'BellState',
      priority_level: 'Medium',
      max_wait_time: 30
    });
  }, [fetchRecommendations]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Simulate minor fluctuations in metrics
      // In real implementation, this would be WebSocket updates
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI-Powered Backend Optimization</h1>
              <p className="text-muted-foreground mt-1">
                Intelligent quantum backend recommendations powered by machine learning
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Clock" size={16} />
              <span>Last updated: {lastUpdated?.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Spacing between header and content */}
          <div className="mb-8"></div>

          {/* Job Constraints Panel */}
          <div className="mb-8">
            <JobConstraintPanel
              onConstraintsChange={handleConstraintsChange}
              isRefreshing={loading}
            />
          </div>

          {/* Top Recommendations Strip */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                <Icon name="Star" size={18} className="text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Top AI Recommendations</h2>
                <p className="text-sm text-muted-foreground">
                  Best backend matches based on your job constraints and historical performance
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Icon name="Loader" size={24} className="animate-spin text-accent" />
                <span className="ml-2 text-muted-foreground">Loading recommendations...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Backend Comparison Matrix - 2 columns */}
            <div className="xl:col-span-2">
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
          <div className="mb-8">
            <PredictiveAnalyticsSection constraints={constraints} />
          </div>

          {/* AI Model Information */}
          <div className="bg-card/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-xl flex items-center justify-center">
                <Icon name="Cpu" size={24} className="text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">AI Model Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Model Version</p>
                    <p className="text-foreground font-medium">QuantumOpt v2.1.3</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Training Data</p>
                    <p className="text-foreground font-medium">2.3M quantum jobs</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Accuracy Rate</p>
                    <p className="text-foreground font-medium">94.7%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Retrained</p>
                    <p className="text-foreground font-medium">2 days ago</p>
                  </div>
                </div>
                <p className="text-muted-foreground mt-3">
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