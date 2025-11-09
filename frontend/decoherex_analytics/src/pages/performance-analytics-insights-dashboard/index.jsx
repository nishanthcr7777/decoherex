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
import Button from '../../components/ui/Button'; // Corrected import
import { RefreshCw } from 'lucide-react';


const PerformanceAnalyticsInsightsDashboard = () => {
  const [activeTab, setActiveTab] = useState('trends');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [backends, setBackends] = useState([]);
  const [loadingBackends, setLoadingBackends] = useState(true);
  const [errorBackends, setErrorBackends] = useState(null);

  const backendControllerRef = useRef(null);

  const fetchBackends = async () => {
    if (backendControllerRef.current) {
      console.log('Aborting previous fetch request.');
      backendControllerRef.current.abort();
    }
    backendControllerRef.current = new AbortController();
    const controller = backendControllerRef.current;

    setLoadingBackends(true);
    setErrorBackends(null);
    try {
      console.log('Fetching backends...');
      const response = await fetch('http://localhost:5001/backends', { signal: controller.signal });
      console.log('Backend response:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Backend data received:', data);
      setBackends(data);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch backends aborted by AbortController.');
        return;
      }
      console.error("Error fetching backends:", error);
      setErrorBackends("Failed to load backend statistics.");
    } finally {
      setLoadingBackends(false);
    }
  };

  useEffect(() => {
    console.log('PerformanceAnalyticsInsightsDashboard: useEffect triggered.');
    fetchBackends();

    const backendInterval = setInterval(() => {
      console.log('PerformanceAnalyticsInsightsDashboard: Interval triggered, fetching backends.');
      fetchBackends();
    }, 15000); // Refresh every 15 seconds

    return () => {
      console.log('PerformanceAnalyticsInsightsDashboard: Cleanup function called.');
      clearInterval(backendInterval);
      if (backendControllerRef.current) {
        console.log('PerformanceAnalyticsInsightsDashboard: Aborting ongoing fetch request during cleanup.');
        backendControllerRef.current.abort();
      }
    };
  }, []);

  // Mock KPI data
  const kpiData = [
    {
      title: "Total Job Volume",
      value: "300",
      change: "+8.2%",
      trend: "up",
      icon: "Activity",
      color: "accent"
    },
    {
      title: "Avg Execution Time",
      value: "2.34s",
      change: "-12.5%",
      trend: "down",
      icon: "Clock",
      color: "success"
    },
    {
      title: "Success Rate",
      value: "94.7%",
      change: "+2.1%",
      trend: "up",
      icon: "CheckCircle",
      color: "success"
    },
    {
      title: "Backend Utilization",
      value: "78.3%",
      change: "+5.4%",
      trend: "up",
      icon: "Server",
      color: "warning"
    }
  ];

  // Mock performance trends data
  const performanceTrendsData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date?.setDate(date?.getDate() - (29 - i));
    return {
      date: date?.toISOString(),
      avgExecutionTime: 2000 + Math.random() * 1000 + Math.sin(i * 0.2) * 500,
      successRate: 90 + Math.random() * 8 + Math.sin(i * 0.1) * 3,
      errorRate: 2 + Math.random() * 6 + Math.cos(i * 0.15) * 2
    };
  });

  // Mock volume analysis data
  const volumeAnalysisData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date?.setDate(date?.getDate() - (29 - i));
    return {
      date: date?.toISOString(),
      'bell-state': Math.floor(Math.random() * 50) + 20,
      'ghz': Math.floor(Math.random() * 40) + 15,
      'random-circuit': Math.floor(Math.random() * 60) + 30,
      'custom': Math.floor(Math.random() * 30) + 10,
      'bmit': Math.floor(Math.random() * 25) + 5
    };
  });

  // Mock capacity utilization data
  const capacityUtilizationData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date?.setDate(date?.getDate() - (29 - i));
    const current = 60 + Math.random() * 30 + Math.sin(i * 0.2) * 10;
    return {
      date: date?.toISOString(),
      current: Math.max(0, Math.min(100, current)),
      forecast: Math.max(0, Math.min(100, current + Math.random() * 20 - 10)),
      capacity: 100
    };
  });

  // Mock execution time distribution data
  const executionTimeDistribution = [
    { range: '0-500ms', frequency: 1250, value: 250 },
    { range: '500ms-1s', frequency: 2100, value: 750 },
    { range: '1-2s', frequency: 3200, value: 1500 },
    { range: '2-3s', frequency: 2800, value: 2500 },
    { range: '3-5s', frequency: 1900, value: 4000 },
    { range: '5-10s', frequency: 1200, value: 7500 },
    { range: '10s+', frequency: 397, value: 15000 }
  ];

  // Mock backend ranking data
  const backendRankingData = [
    {
      id: 'quantum-1',
      name: 'IBM Quantum 1',
      description: '127 qubits',
      status: 'online',
      overallScore: 94,
      avgExecutionTime: 2340,
      successRate: 96.2,
      utilization: 82
    },
    {
      id: 'quantum-2',
      name: 'Google Sycamore',
      description: '70 qubits',
      status: 'online',
      overallScore: 89,
      avgExecutionTime: 1890,
      successRate: 94.8,
      utilization: 75
    },
    {
      id: 'quantum-3',
      name: 'IonQ Aria',
      description: '32 qubits',
      status: 'maintenance',
      overallScore: 76,
      avgExecutionTime: 3200,
      successRate: 91.3,
      utilization: 45
    },
    {
      id: 'simulator-1',
      name: 'Quantum Simulator 1',
      description: 'High-fidelity',
      status: 'online',
      overallScore: 98,
      avgExecutionTime: 1200,
      successRate: 99.1,
      utilization: 88
    },
    {
      id: 'simulator-2',
      name: 'Quantum Simulator 2',
      description: 'Noise-aware',
      status: 'online',
      overallScore: 92,
      avgExecutionTime: 1450,
      successRate: 97.6,
      utilization: 71
    }
  ];

  // Mock detailed performance data
  const performanceGridData = Array.from({ length: 100 }, (_, i) => {
    const jobTypes = ['bell-state', 'ghz', 'random-circuit', 'custom', 'bmit'];
    const backends = ['IBM Quantum 1', 'Google Sycamore', 'IonQ Aria', 'Simulator 1', 'Simulator 2'];
    const statuses = ['completed', 'failed', 'running', 'queued'];
    
    return {
      jobId: `QJ-${String(i + 1)?.padStart(6, '0')}`,
      backend: backends?.[Math.floor(Math.random() * backends?.length)],
      jobType: jobTypes?.[Math.floor(Math.random() * jobTypes?.length)],
      status: statuses?.[Math.floor(Math.random() * statuses?.length)],
      executionTime: Math.floor(Math.random() * 10000) + 500,
      queueTime: Math.floor(Math.random() * 30000) + 1000,
      successRate: Math.floor(Math.random() * 30) + 70,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)?.toISOString()
    };
  });

  // Mock error patterns data
  const errorPatternsData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date?.setDate(date?.getDate() - (29 - i));
    
    const backends = ['IBM Quantum 1', 'Google Sycamore', 'IonQ Aria', 'Simulator 1', 'Simulator 2'];
    const errorTypes = [
      'calibration_error', 'gate_error', 'readout_error', 'coherence_error', 
      'connectivity_error', 'timing_error', 'memory_error', 'network_error'
    ];
    
    const errorCount = Math.floor(Math.random() * 15) + 1;
    const selectedErrorTypes = errorTypes?.slice(0, Math.floor(Math.random() * 4) + 1);
    
    return {
      date: date?.toISOString(),
      backend: backends?.[Math.floor(Math.random() * backends?.length)],
      errorCount: errorCount,
      errorTypes: selectedErrorTypes,
      severity: errorCount > 10 ? 'critical' : errorCount > 5 ? 'warning' : 'info'
    };
  });



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
      <main className="pt-20 px-6 pb-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="pt-4">
            <h1 className="text-3xl font-bold text-foreground">Performance Analytics & Insights</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive analysis of quantum job performance trends and optimization opportunities
            </p>
          </div>


          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData?.map((kpi, index) => (
              <KPICard key={index} {...kpi} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Visualization Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Chart Tabs */}
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-1">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`
                          flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                          transition-all duration-200
                          ${activeTab === tab?.id
                            ? 'bg-accent/20 text-accent border border-accent/30' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }
                        `}
                      >
                        <Icon name={tab?.icon} size={16} />
                        <span>{tab?.label}</span>
                      </button>
                    ))}
                  </div>

                  {activeTab === 'trends' && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Metric:</span>
                      <select
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e?.target?.value)}
                        className="bg-input border border-border rounded-lg px-3 py-1 text-sm text-foreground"
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
                <div className="h-[400px]">
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
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Statistical Distribution */}
              <StatisticalDistribution
                data={executionTimeDistribution}
                title="Execution Time Distribution"
                metric="executionTime"
              />
            </div>
          </div>

          {/* Full Width Backend Ranking Table */}
          <div className="w-full">
            <BackendRankingTable data={backendRankingData} />
          </div>

          {/* Full Width Performance Data Grid */}
          <div className="w-full">
            <PerformanceDataGrid data={performanceGridData} />
          </div>

          {/* Live Backend Statistics */}
          <div className="w-full">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Live Backend Statistics</CardTitle>
                <Button variant="ghost" size="icon" onClick={fetchBackends} disabled={loadingBackends}>
                  <RefreshCw className={loadingBackends ? "animate-spin" : ""} size={20} />
                </Button>
              </CardHeader>
              <CardContent>
                {loadingBackends ? (
                  <p>Loading backend statistics...</p>
                ) : errorBackends ? (
                  <p className="text-red-500">{errorBackends}</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Backend</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Queued Jobs</TableHead>
                        <TableHead>Pending Jobs</TableHead>
                        <TableCell>{"1.0.0"}</TableCell>
                        <TableHead>Qubits</TableHead>
                        <TableHead>Operational</TableHead>
                        <TableHead>Processor Type</TableHead>
                        <TableHead>2Q Error (Best)</TableHead>
                        <TableHead>2Q Error (Layered)</TableHead>
                        <TableCell>{"1000 CLOPS"}</TableCell>
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
                          <TableCell>{backend.total_pending_jobs || 'N/A'}</TableCell>
                          <TableCell>{backend.total_pending_jobs || 'N/A'}</TableCell>
                          <TableCell>{backend.version || 'N/A'}</TableCell>
                          <TableCell>{backend.qubits || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={backend.operational ? 'default' : 'destructive'}>
                              {backend.operational ? 'Yes' : 'No'}
                            </Badge>
                          </TableCell>
                          <TableCell>{backend.processor_type || 'N/A'}</TableCell>
                          <TableCell>{backend.two_q_error_best || 'N/A'}</TableCell>
                          <TableCell>{backend.two_q_error_layered || 'N/A'}</TableCell>
                          <TableCell>
                            {backend.name === 'ibm_torino' ? '210K CLOPS' : backend.name === 'ibm_brisbane' ? '180K CLOPS' : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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