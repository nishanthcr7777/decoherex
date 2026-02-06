import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/ui/Header';
import KPICard from './components/KPICard';
import PerformanceTrendsChart from './components/PerformanceTrendsChart';
import VolumeAnalysisChart from './components/VolumeAnalysisChart';
import CapacityUtilizationChart from './components/CapacityUtilizationChart';
import ErrorPatternsChart from './components/ErrorPatternsChart';
import StatisticalDistribution from './components/StatisticalDistribution';
import BackendRankingTable from './components/BackendRankingTable';
import PerformanceDataGrid from './components/PerformanceDataGrid';
import Icon from '../../components/AppIcon';
import { Badge } from '../../components/ui/badge';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { RefreshCw } from 'lucide-react';


const PerformanceAnalyticsInsightsDashboard = () => {
  const [activeTab, setActiveTab] = useState('trends');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [backends, setBackends] = useState([]);
  const [loadingBackends, setLoadingBackends] = useState(true);
  const [errorBackends, setErrorBackends] = useState(null);

  // REAL DATA STATES
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const backendControllerRef = useRef(null);

  // FETCH CSV/DB DASHBOARD DATA
  const fetchDashboardData = async (silent = false) => {
    try {
      if (!silent) setLoadingDashboard(true);
      const response = await fetch('http://localhost:5001/api/dashboard-data');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      if (!silent) setLoadingDashboard(false);
    }
  };

  const fetchBackends = async () => {
    if (backendControllerRef.current) {
      backendControllerRef.current.abort();
    }
    backendControllerRef.current = new AbortController();
    const controller = backendControllerRef.current;

    setLoadingBackends(true);
    setErrorBackends(null);
    try {
      const response = await fetch('http://localhost:5001/backends', { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBackends(data);
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error("Error fetching backends:", error);
      setErrorBackends("Failed to load backend statistics.");
    } finally {
      setLoadingBackends(false);
    }
  };

  useEffect(() => {
    fetchBackends();
    fetchDashboardData(false); // Initial load with spinner

    const backendInterval = setInterval(() => {
      fetchBackends();
    }, 15000);

    // Auto-refresh dashboard data every 30 seconds (silent)
    const dashboardInterval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);

    return () => {
      clearInterval(backendInterval);
      clearInterval(dashboardInterval);
      if (backendControllerRef.current) {
        backendControllerRef.current.abort();
      }
    };
  }, []);

  // Compute KPI Data dynamically if possible, or use dashboardData
  // ADDED ROBUST NULL CHECKS HERE
  const kpiData = [
    {
      title: "Total Job Volume",
      value: (dashboardData?.global_stats?.totalVolume)
        ? dashboardData.global_stats.totalVolume.toLocaleString()
        : (dashboardData?.volume && Array.isArray(dashboardData.volume))
          ? dashboardData.volume.reduce((acc, curr) => acc + (curr.BellState || 0) + (curr.Grover || 0) + (curr.QAOA || 0) + (curr.QuantumFourier || 0) + (curr.VQE || 0), 0).toString()
          : "...",
      change: "+8.2%",
      trend: "up",
      icon: "Activity",
      color: "accent"
    },
    {
      title: "Avg Execution Time",
      value: (dashboardData?.global_stats?.avgExecutionTimeMs)
        ? `${dashboardData.global_stats.avgExecutionTimeMs}ms`
        : (dashboardData?.trends && Array.isArray(dashboardData.trends) && dashboardData.trends.length > 0)
          ? `${dashboardData.trends[dashboardData.trends.length - 1]?.avgExecutionTime}ms`
          : "...",
      change: "-12.5%",
      trend: "down",
      icon: "Clock",
      color: "success"
    },
    {
      title: "Success Rate",
      value: (dashboardData?.global_stats?.successRate)
        ? `${dashboardData.global_stats.successRate}%`
        : (dashboardData?.trends && Array.isArray(dashboardData.trends) && dashboardData.trends.length > 0)
          ? `${dashboardData.trends[dashboardData.trends.length - 1]?.successRate}%`
          : "...",
      change: "+2.1%",
      trend: "up",
      icon: "CheckCircle",
      color: "success"
    },
    {
      title: "Backend Utilization",
      value: (dashboardData?.global_stats?.utilization)
        ? `${dashboardData.global_stats.utilization}%`
        : (dashboardData?.capacity && Array.isArray(dashboardData.capacity) && dashboardData.capacity.length > 0)
          ? `${dashboardData.capacity[dashboardData.capacity.length - 1]?.current}%`
          : "...",
      change: "+5.4%",
      trend: "up",
      icon: "Server",
      color: "warning"
    }
  ];

  // Map Data from API to Chart Props with Safety Checks
  const performanceTrendsData = Array.isArray(dashboardData?.trends) ? dashboardData.trends : [];
  const volumeAnalysisData = Array.isArray(dashboardData?.volume) ? dashboardData.volume : [];
  const capacityUtilizationData = Array.isArray(dashboardData?.capacity) ? dashboardData.capacity : [];
  const errorPatternsData = Array.isArray(dashboardData?.errors) ? dashboardData.errors : [];

  // Use Ranking Data from CSV instead of 'backends' for the generic table if preferred
  const backendRankingData = Array.isArray(dashboardData?.ranking) ? dashboardData.ranking : [];

  const performanceGridData = Array.isArray(dashboardData?.jobs) ? dashboardData.jobs : [];

  // Mock execution time distribution data (Keep static or derive later if needed)
  const executionTimeDistribution = [
    { range: '0-500ms', frequency: 1250, value: 250 },
    { range: '500ms-1s', frequency: 2100, value: 750 },
    { range: '1-2s', frequency: 3200, value: 1500 },
    { range: '2-3s', frequency: 2800, value: 2500 },
    { range: '3-5s', frequency: 1900, value: 4000 },
    { range: '5-10s', frequency: 1200, value: 7500 },
    { range: '10s+', frequency: 397, value: 15000 }
  ];

  const tabs = [
    { id: 'trends', label: 'Performance Trends', icon: 'TrendingUp' },
    { id: 'volume', label: 'Volume Analysis', icon: 'BarChart3' },
    { id: 'capacity', label: 'Capacity Utilization', icon: 'Gauge' },
    { id: 'errors', label: 'Error Patterns', icon: 'AlertTriangle' }
  ];

  const metricOptions = [
    { value: 'all', label: 'All Metrics' },
    { value: 'avgExecutionTime', label: 'Execution Time' },
    { value: 'successRate', label: 'Success Rate' },
    { value: 'errorRate', label: 'Error Rate' }
  ];


  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-[3.75rem] px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Page Header */}
          <div className="pt-2 sm:pt-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Performance Analytics & Insights</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Comprehensive analysis of quantum job performance trends and optimization opportunities
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {kpiData?.map((kpi, index) => (
              <KPICard key={index} {...kpi} />
            ))}
          </div>

          {/* Main Content Grid - same height as Execution Time Distribution, left content scrollable */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:min-h-[500px] lg:items-stretch">
            {/* Main Visualization Area */}
            <div className="lg:col-span-3 flex flex-col min-h-0">
              {/* Chart Tabs */}
              <div className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col flex-1 min-h-0 h-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6 shrink-0">
                  <div className="flex items-center space-x-2 overflow-x-auto overflow-y-hidden scrollbar-hide pb-2 sm:pb-0">
                    {tabs?.map((tab) => {
                      const isActive = activeTab === tab?.id;
                      return (
                        <button
                          key={tab?.id}
                          onClick={() => setActiveTab(tab?.id)}
                          className={`
                            flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap
                            transition-all duration-200
                            ${isActive
                              ? 'bg-transparent text-accent ring-2 ring-accent/60 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                              : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:ring-1 hover:ring-slate-500/40 border border-transparent'
                            }
                          `}
                        >
                          <Icon name={tab?.icon} size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="hidden sm:inline">{tab?.label}</span>
                          <span className="sm:hidden">{tab?.label.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {activeTab === 'trends' && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm text-muted-foreground shrink-0">Metric:</span>
                      <Select
                        options={metricOptions}
                        value={selectedMetric}
                        onChange={setSelectedMetric}
                        placeholder="Metric"
                        className="w-32 min-w-0"
                      />
                    </div>
                  )}
                </div>

                {/* Chart Content - scrollable when it exceeds; height aligned to Execution Time Distribution */}
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                  {loadingDashboard ? (
                    <div className="flex items-center justify-center min-h-[280px] text-muted-foreground">Loading AI Model Data...</div>
                  ) : (
                    <div className="min-h-[280px] h-[300px] sm:h-[360px]">
                      {activeTab === 'trends' && (
                        <PerformanceTrendsChart
                          data={performanceTrendsData}
                          selectedMetric={selectedMetric}
                        />
                      )}
                      {activeTab === 'volume' && (
                        <VolumeAnalysisChart data={volumeAnalysisData} />
                      )}
                      {activeTab === 'capacity' && (
                        <CapacityUtilizationChart data={capacityUtilizationData} />
                      )}
                      {activeTab === 'errors' && (
                        <ErrorPatternsChart data={errorPatternsData} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar - same height as left */}
            <div className="flex flex-col min-h-0 h-full">
              <StatisticalDistribution
                data={executionTimeDistribution}
                title="Execution Time Distribution"
                metric="executionTime"
              />
            </div>
          </div>

          {/* Full Width Backend Ranking Table - USING CSV DATA */}
          <div className="w-full overflow-x-auto scrollbar-hide">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">Top Performing Backends (Historical Analysis)</h3>
            <BackendRankingTable data={loadingDashboard ? [] : backendRankingData} />
          </div>

          {/* Full Width Performance Data Grid - USING CSV DATA */}
          <div className="w-full overflow-x-auto scrollbar-hide">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">Recent Job Executions</h3>
            <PerformanceDataGrid data={loadingDashboard ? [] : performanceGridData} />
          </div>

          {/* Live Backend Statistics (Keep original 'backends' usage for Real-Time comparison) */}
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-4 mb-4 border-b border-slate-700/50">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">Live Backend Statistics (Real-Time API)</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 px-2 py-1 bg-success/10 text-success rounded-full text-[10px] sm:text-xs animate-pulse border border-success/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                    <span className="font-medium hidden sm:inline">Live Updates</span>
                    <span className="font-medium sm:hidden">Live</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => fetchBackends()} disabled={loadingBackends}>
                    <RefreshCw className={`${loadingBackends ? "animate-spin" : ""} sm:w-5 sm:h-5`} size={18} />
                  </Button>
                </div>
              </div>
              {errorBackends ? (
                <p className="text-sm text-red-500">{errorBackends}</p>
              ) : (
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Backend</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Queued Jobs</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Pending Jobs</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Version</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Qubits</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Operational</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Processor Type</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">2Q Error (Best)</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">2Q Error (Layered)</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">CLOPS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingBackends ? (
                        <tr>
                          <td colSpan="11" className="py-8 px-2 text-center text-sm text-muted-foreground">
                            Loading backend statistics...
                          </td>
                        </tr>
                      ) : (
                        backends.map((backend) => (
                          <tr key={backend.name} className="border-b border-slate-700/30 hover:bg-muted/20">
                            <td className="py-4 px-2 font-medium text-foreground">{backend.name}</td>
                            <td className="py-4 px-2">
                              <Badge variant={backend.status === 'active' ? 'default' : 'destructive'}>
                                {backend.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-2 text-sm text-foreground">{backend.total_pending_jobs !== undefined ? backend.total_pending_jobs : 'N/A'}</td>
                            <td className="py-4 px-2 text-sm text-foreground">{backend.total_pending_jobs !== undefined ? backend.total_pending_jobs : 'N/A'}</td>
                            <td className="py-4 px-2 text-sm text-foreground">{backend.version || 'N/A'}</td>
                            <td className="py-4 px-2 text-sm text-foreground">{backend.qubits || 'N/A'}</td>
                            <td className="py-4 px-2">
                              <Badge variant={backend.operational ? 'default' : 'destructive'}>
                                {backend.operational ? 'Yes' : 'No'}
                              </Badge>
                            </td>
                            <td className="py-4 px-2 text-sm text-foreground">{backend.processor_type || 'N/A'}</td>
                            <td className="py-4 px-2 text-sm text-foreground">
                              {backend.two_q_error_best ? Number(backend.two_q_error_best).toFixed(6) : 'N/A'}
                            </td>
                            <td className="py-4 px-2 text-sm text-foreground">
                              {backend.two_q_error_layered ? Number(backend.two_q_error_layered).toFixed(6) : 'N/A'}
                            </td>
                            <td className="py-4 px-2 text-sm text-foreground">
                              {backend.name === 'ibm_torino' ? '210K CLOPS' : backend.name === 'ibm_brisbane' ? '180K CLOPS' : 'N/A'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PerformanceAnalyticsInsightsDashboard;