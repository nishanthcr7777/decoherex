import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import QuantumOperationsCommandCenter from './pages/quantum-operations-command-center';
import AIBackendOptimizationDashboard from './pages/ai-powered-backend-optimization-dashboard';
import PerformanceAnalyticsInsightsDashboard from './pages/performance-analytics-insights-dashboard';
import LiveJobs from './pages/live-jobs';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AIBackendOptimizationDashboard />} />
        <Route path="/quantum-operations-command-center" element={<QuantumOperationsCommandCenter />} />
        <Route path="/ai-powered-backend-optimization-dashboard" element={<AIBackendOptimizationDashboard />} />
        <Route path="/live-jobs" element={<LiveJobs />} />
        <Route path="/performance-analytics-insights-dashboard" element={<PerformanceAnalyticsInsightsDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
