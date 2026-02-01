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
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import Button from '../../components/ui/Button';
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
      value: (dashboardData?.volume && Array.isArray(dashboardData.volume))
        ? dashboardData.volume.reduce((acc, curr) => acc + (curr.BellState || 0) + (curr.Grover || 0) + (curr.QAOA || 0) + (curr.QuantumFourier || 0) + (curr.VQE || 0), 0).toString()
        : "...",
      change: "+8.2%",
      trend: "up",
      icon: "Activity",
      color: "accent"
    },
    {
      title: "Avg Execution Time",
      value: (dashboardData?.trends && Array.isArray(dashboardData.trends) && dashboardData.trends.length > 0)
        ? `${dashboardData.trends[dashboardData.trends.length - 1]?.avgExecutionTime}ms`
        : "...",
      change: "-12.5%",
      trend: "down",
      icon: "Clock",
      color: "success"
    },
    {
      title: "Success Rate",
      value: (dashboardData?.trends && Array.isArray(dashboardData.trends) && dashboardData.trends.length > 0)
        ? `${dashboardData.trends[dashboardData.trends.length - 1]?.successRate}%`
        : "...",
      change: "+2.1%",
      trend: "up",
      icon: "CheckCircle",
      color: "success"
    },
    {
      title: "Backend Utilization",
      value: (dashboardData?.capacity && Array.isArray(dashboardData.capacity) && dashboardData.capacity.length > 0)
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[4.25rem] px-4 sm:px-6 pb-4 sm:pb-6">
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Main Visualization Area */}
            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
              {/* Chart Tabs */}
              <div className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-1 overflow-x-auto pb-2 sm:pb-0">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`
                          flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap
                          transition-all duration-200
                          ${activeTab === tab?.id
                            ? 'bg-accent/20 text-accent border border-accent/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }
                        `}
                      >
                        <Icon name={tab?.icon} size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{tab?.label}</span>
                        <span className="sm:hidden">{tab?.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>

                  {activeTab === 'trends' && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">Metric:</span>
                      <select
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e?.target?.value)}
                        className="bg-input border border-border rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm text-foreground"
                      >
                        {metricOptions?.map((option) => (
                          <option key={option?.value} value={option?.value}>
                            {option?.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Chart Content */}
                <div className="h-[300px] sm:h-[400px]">
                  {loadingDashboard ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">Loading AI Model Data...</div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Statistical Distribution */}
              <StatisticalDistribution
                data={executionTimeDistribution}
                title="Execution Time Distribution"
                metric="executionTime"
              />
            </div>
          </div>

          {/* Full Width Backend Ranking Table - USING CSV DATA */}
          <div className="w-full overflow-x-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">Top Performing Backends (Historical Analysis)</h3>
            {loadingDashboard ? <p className="text-sm text-muted-foreground">Loading...</p> : <BackendRankingTable data={backendRankingData} />}
          </div>

          {/* Full Width Performance Data Grid - USING CSV DATA */}
          <div className="w-full overflow-x-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">Recent Job Executions</h3>
            {loadingDashboard ? <p className="text-sm text-muted-foreground">Loading...</p> : <PerformanceDataGrid data={performanceGridData} />}
          </div>

          {/* Live Backend Statistics (Keep original 'backends' usage for Real-Time comparison) */}
          <div className="w-full overflow-x-auto">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-2">
                <CardTitle className="text-base sm:text-lg font-medium">Live Backend Statistics (Real-Time API)</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] sm:text-xs animate-pulse border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="font-medium hidden sm:inline">Live Updates</span>
                    <span className="font-medium sm:hidden">Live</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => fetchBackends()} disabled={loadingBackends}>
                    <RefreshCw className={loadingBackends ? "animate-spin" : ""} size={18} className="sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingBackends ? (
                  <p className="text-sm text-muted-foreground">Loading backend statistics...</p>
                ) : errorBackends ? (
                  <p className="text-sm text-red-500">{errorBackends}</p>
                ) : (
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Backend</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Queued Jobs</TableHead>
                          <TableHead>Pending Jobs</TableHead>
                          <TableHead>Version</TableHead>
                          <TableHead>Qubits</TableHead>
                          <TableHead>Operational</TableHead>
                          <TableHead>Processor Type</TableHead>
                          <TableHead>2Q Error (Best)</TableHead>
                          <TableHead>2Q Error (Layered)</TableHead>
                          <TableHead>CLOPS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {backends.map((backend) => (
                          <TableRow key={backend.name}>
                            <TableCell className="font-medium">{backend.name}</TableCell>
                            <TableCell>
                              <Badge variant={backend.status === 'active' ? 'default' : 'destructive'}>
                                {backend.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{backend.total_pending_jobs !== undefined ? backend.total_pending_jobs : 'N/A'}</TableCell>
                            <TableCell>{backend.total_pending_jobs !== undefined ? backend.total_pending_jobs : 'N/A'}</TableCell>
                            <TableCell>{backend.version || 'N/A'}</TableCell>
                            <TableCell>{backend.qubits || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant={backend.operational ? 'default' : 'destructive'}>
                                {backend.operational ? 'Yes' : 'No'}
                              </Badge>
                            </TableCell>
                            <TableCell>{backend.processor_type || 'N/A'}</TableCell>
                            <TableCell>
                              {backend.two_q_error_best ? Number(backend.two_q_error_best).toFixed(6) : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {backend.two_q_error_layered ? Number(backend.two_q_error_layered).toFixed(6) : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {backend.name === 'ibm_torino' ? '210K CLOPS' : backend.name === 'ibm_brisbane' ? '180K CLOPS' : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PerformanceAnalyticsInsightsDashboard;