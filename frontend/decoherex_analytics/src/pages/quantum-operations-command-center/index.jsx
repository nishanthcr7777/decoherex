import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { LineChart, BarChart, PieChart } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import KPICard from './components/KPICard';
import JobLifecycleFlow from './components/JobLifecycleFlow';
import LiveJobFeed from './components/LiveJobFeed';
import JobDataGrid from './components/JobDataGrid';
import JobSubmissionModal from './components/JobSubmissionModal';
import FilterPanel from './components/FilterPanel';
import JobDetailsModal from './components/JobDetailsModal';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

const liveJobsKpiData = [
  {
    title: "Active Jobs",
    value: "24",
    unit: "",
    change: "+12%",
    changeType: "increase",
    icon: "activity",
  },
  {
    title: "Queue Length",
    value: "8",
    unit: "jobs",
    change: "-15%",
    changeType: "decrease",
    icon: "clock",
  },
  {
    title: "Avg Wait Time",
    value: "4.2",
    unit: "min",
    change: "-8%",
    changeType: "decrease",
    icon: "clock",
  },
  {
    title: "Success Rate",
    value: "94.7",
    unit: "%",
    change: "+2.1%",
    changeType: "increase",
    icon: "checkCircle",
  },
  {
    title: "Backend Availability",
    value: "87",
    unit: "%",
    change: "-0%",
    changeType: "neutral",
    icon: "server",
  },
  {
    title: "Error Rate",
    value: "5.3",
    unit: "%",
    change: "-1.2%",
    changeType: "decrease",
    icon: "alertTriangle",
  },
];

const QuantumOperationsCommandCenter = () => {
  const [jobs, setJobs] = useState([]);
  const [kpiData, setKpiData] = useState({});
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [backendFilter, setBackendFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');

  // IBM Token configuration modal
  const [tokenConfigured, setTokenConfigured] = useState(true);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  // Base URL for backend API
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

  // Mock job data
  const mockJobs = [
    {
      id: 'qjob_67f8a9b2c3d4e5f6',
      type: 'Bell State Preparation',
      status: 'running',
      backend: 'ibm_quantum_1',
      qubits: 2,
      duration: 45000,
      progress: 65,
      timestamp: new Date(Date.now() - 300000),
      waitTime: 120000
    },
    {
      id: 'qjob_12a3b4c5d6e7f8g9',
      type: 'GHZ State Creation',
      status: 'completed',
      backend: 'google_sycamore',
      qubits: 3,
      duration: 78000,
      timestamp: new Date(Date.now() - 600000),
      waitTime: 90000
    },
    {
      id: 'qjob_98h7i6j5k4l3m2n1',
      type: 'Random Circuit Benchmark',
      status: 'failed',
      backend: 'ionq_aria',
      qubits: 8,
      duration: 12000,
      timestamp: new Date(Date.now() - 900000),
      waitTime: 180000,
      error: {
        code: 'CALIBRATION_ERROR',
        message: 'Qubit 5 calibration failed during gate execution. Backend requires recalibration.'
      }
    },
    {
      id: 'qjob_a1b2c3d4e5f6g7h8',
      type: 'Custom Quantum Algorithm',
      status: 'queued',
      backend: 'ibm_quantum_2',
      qubits: 16,
      timestamp: new Date(Date.now() - 60000),
      waitTime: 450000
    },
    {
      id: 'qjob_z9y8x7w6v5u4t3s2',
      type: 'Variational Quantum Eigensolver',
      status: 'running',
      backend: 'simulator_1',
      qubits: 12,
      duration: 156000,
      progress: 23,
      timestamp: new Date(Date.now() - 1200000),
      waitTime: 30000
    },
    {
      id: 'qjob_p0o9i8u7y6t5r4e3',
      type: 'Quantum Fourier Transform',
      status: 'completed',
      backend: 'ibm_quantum_1',
      qubits: 4,
      duration: 89000,
      timestamp: new Date(Date.now() - 1800000),
      waitTime: 75000
    },
    {
      id: 'qjob_m1n2b3v4c5x6z7a8',
      type: 'Quantum Teleportation',
      status: 'queued',
      backend: 'google_sycamore',
      qubits: 3,
      timestamp: new Date(Date.now() - 120000),
      waitTime: 320000
    },
    {
      id: 'qjob_q2w3e4r5t6y7u8i9',
      type: 'Grover Search Algorithm',
      status: 'failed',
      backend: 'ionq_aria',
      qubits: 6,
      duration: 34000,
      timestamp: new Date(Date.now() - 2400000),
      waitTime: 200000,
      error: {
        code: 'TIMEOUT_ERROR',
        message: 'Job execution exceeded maximum allowed time limit of 30 seconds.'
      }
    }
  ];

  // Mock KPI data
  const mockKpiData = {
    activeJobs: {
      title: 'Active Jobs',
      value: '24',
      unit: '',
      trend: 'up',
      trendValue: '+12%',
      status: 'success',
      sparklineData: [18, 22, 19, 24, 26, 24, 28, 24],
      icon: 'Activity'
    },
    queueLength: {
      title: 'Queue Length',
      value: '8',
      unit: 'jobs',
      trend: 'down',
      trendValue: '-15%',
      status: 'warning',
      sparklineData: [12, 15, 11, 8, 10, 8, 6, 8],
      icon: 'Clock'
    },
    avgWaitTime: {
      title: 'Avg Wait Time',
      value: '4.2',
      unit: 'min',
      trend: 'down',
      trendValue: '-8%',
      status: 'success',
      sparklineData: [6.1, 5.8, 4.9, 4.2, 4.5, 4.2, 3.8, 4.2],
      icon: 'Timer'
    },
    successRate: {
      title: 'Success Rate',
      value: '94.7',
      unit: '%',
      trend: 'up',
      trendValue: '+2.1%',
      status: 'success',
      sparklineData: [91.2, 92.8, 93.1, 94.7, 93.9, 94.7, 95.2, 94.7],
      icon: 'CheckCircle'
    },
    backendAvailability: {
      title: 'Backend Availability',
      value: '87',
      unit: '%',
      trend: 'stable',
      trendValue: '0%',
      status: 'warning',
      sparklineData: [89, 87, 88, 87, 86, 87, 88, 87],
      icon: 'Server'
    },
    errorRate: {
      title: 'Error Rate',
      value: '5.3',
      unit: '%',
      trend: 'down',
      trendValue: '-1.2%',
      status: 'success',
      sparklineData: [7.1, 6.8, 6.2, 5.3, 5.8, 5.3, 4.9, 5.3],
      icon: 'AlertTriangle'
    }
  };

  // Initialize data
  useEffect(() => {
    setJobs(mockJobs);
    // setKpiData(mockKpiData); // Remove this line
  }, []);

  // Fetch KPI data
  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        const response = await fetch(`${API_BASE}/kpis`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const newKpiDataArray = [
          {
            title: "Queued Jobs",
            value: data?.total_pending_jobs !== undefined ? data.total_pending_jobs : 'N/A',
            unit: "",
            trend: "up",
            trendValue: "",
            status: "",
            sparklineData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
          },
          {
            title: "Pending Jobs",
            value: data?.total_pending_jobs !== undefined ? data.total_pending_jobs : 'N/A',
            unit: "",
            trend: "down",
            trendValue: "",
            status: "",
            sparklineData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
          },
          {
            title: "Version",
            value: "N/A",
            unit: "",
            trend: "neutral",
            trendValue: "",
            status: "",
            sparklineData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
          },
          {
            title: "Backend Status",
            value: data?.backend_status !== undefined ? data.backend_status : 'N/A',
            unit: "",
            trend: "up",
            trendValue: "",
            status: "",
            sparklineData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
          },
          {
            title: "Qubits",
            value: data?.qubits !== undefined ? data.qubits : 'N/A',
            unit: "",
            trend: "up",
            trendValue: "",
            status: "",
            sparklineData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
          },
          {
            title: "Operational",
            value: data?.operational !== undefined ? (data.operational ? 'Yes' : 'No') : 'N/A',
            unit: "",
            trend: "up",
            trendValue: "",
            status: "",
            sparklineData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
          },
          {
            title: "Processor Type",
            value: data?.processor_type !== undefined ? data.processor_type : 'N/A',
            unit: "",
            trend: "up",
            trendValue: "",
            status: "",
            sparklineData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
          },
          {
            title: "2Q Error (Best)",
            value: data?.two_q_error_best !== undefined ? data.two_q_error_best : 'N/A',
            unit: "",
            trend: "down",
            trendValue: "",
            status: "",
            sparklineData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
          },
          {
            title: "2Q Error (Layered)",
            value: data?.two_q_error_layered !== undefined ? data.two_q_error_layered : 'N/A',
            unit: "",
            trend: "down",
            trendValue: "",
            status: "",
            sparklineData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
          },
          {
            title: "CLOPS",
            value: data?.clops !== undefined ? data.clops : 'N/A',
            unit: "",
            trend: "up",
            trendValue: "",
            status: "",
            sparklineData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
          }
        ];

        const newKpiDataObject = newKpiDataArray.reduce((acc, kpi) => {
          acc[kpi.title.replace(/\s/g, '')] = kpi;
          return acc;
        }, {});

        setKpiData(newKpiDataObject);
      } catch (error) {
        console.error("Error fetching KPI data:", error);
        // Fallback to mock data if API fails
        setKpiData(mockKpiData);
      }
    };

    fetchKpiData();
    const interval = setInterval(fetchKpiData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [API_BASE]);

  // Simulate real-time updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      // Simulate job status updates
      setJobs(prevJobs => {
        return prevJobs?.map(job => {
          if (job?.status === 'running' && Math.random() > 0.7) {
            const newProgress = Math.min(100, (job?.progress || 0) + Math.random() * 20);
            if (newProgress >= 100) {
              return { ...job, status: 'completed', progress: 100, duration: job?.duration + Math.random() * 10000 };
            }
            return { ...job, progress: newProgress };
          }
          if (job?.status === 'queued' && Math.random() > 0.8) {
            return { ...job, status: 'running', progress: Math.random() * 30 };
          }
          return job;
        });
      });

      // Update KPI sparklines
      setKpiData(prevKpi => {
        const updatedKpi = { ...prevKpi };
        Object.keys(updatedKpi)?.forEach(key => {
          const data = [...updatedKpi?.[key]?.sparklineData];
          data?.shift();
          data?.push(data?.[data?.length - 1] + (Math.random() - 0.5) * 2);
          updatedKpi[key] = { ...updatedKpi?.[key], sparklineData: data };
        });
        return updatedKpi;
      });
    }, 10000); // Update every 10 seconds

    return () => {
      if (updateInterval) clearInterval(updateInterval);
    };
  }, []);

  const handleJobAction = (action, jobId) => {
    console.log(`Action: ${action} on job: ${jobId}`);

    switch (action) {
      case 'cancel':
        setJobs(prevJobs =>
          prevJobs?.map(job =>
            job?.id === jobId ? { ...job, status: 'failed', error: { code: 'USER_CANCELLED', message: 'Job cancelled by user' } } : job
          )
        );
        break;
      case 'retry':
        setJobs(prevJobs =>
          prevJobs?.map(job =>
            job?.id === jobId ? { ...job, status: 'queued', error: null, progress: 0 } : job
          )
        );
        break;
      case 'view':
        const job = jobs.find(j => j.id === jobId || j.job_id === jobId);
        if (job) {
          setSelectedJob(job);
          setIsDetailsOpen(true);
        }
        break;
      case 'delete':
        setJobs(prevJobs => prevJobs?.filter(job => job?.id !== jobId));
        break;
      default:
        console.log(`Unhandled action: ${action}`);
    }
  };

  const handleExport = (selectedJobIds = null) => {
    const jobsToExport = selectedJobIds ? jobs?.filter(job => selectedJobIds?.includes(job?.id)) : jobs;
    const csvContent = [
      ['Job ID', 'Type', 'Status', 'Backend', 'Qubits', 'Duration (ms)', 'Created'],
      ...jobsToExport?.map(job => [
        job?.id,
        job?.type,
        job?.status,
        job?.backend,
        job?.qubits,
        job?.duration || job?.waitTime || 'N/A',
        new Date(job.timestamp)?.toISOString()
      ])
    ]?.map(row => row?.join(','))?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-jobs-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Initialize data fetching and realtime updates
  useEffect(() => {
    // initial fetch
    const fetchInitial = async () => {
      try {
        const resp = await fetch(`${API_BASE}/jobs`);
        const data = await resp.json();
        if (data.jobs) setJobs(data.jobs);
      } catch (e) {
        console.error('Initial jobs fetch failed', e);
      }
    };
    fetchInitial();

    // websocket
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsHost = API_BASE.replace(/^http/, proto);
    const ws = new WebSocket(`${wsHost}/ws/jobs`);
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'initial_jobs') {
          setJobs(msg.data || []);
        } else if (msg.type === 'job_update') {
          setJobs(prev => {
            const idx = prev.findIndex(j => j.job_id === msg.data.job_id);
            if (idx !== -1) {
              const updated = [...prev];
              updated[idx] = msg.data;
              return updated;
            }
            return [msg.data, ...prev];
          });
        }
      } catch (err) {
        console.error('WS parse error', err);
      }
    };
    return () => ws.close();
  }, []);

  const handleJobSubmission = async (jobData) => {
    try {
      const form = new FormData();
      form.append('job_name', jobData.jobName || '');
      form.append('backend_name', jobData.backend);

      if (jobData.mode === 'custom' && jobData.customCode) {
        form.append('custom_code', jobData.customCode);
      } else {
        form.append('circuit_type', jobData.jobType);
      }

      form.append('shots', jobData.shots || 1024);
      const resp = await fetch(`${API_BASE}/submit-job`, {
        method: 'POST',
        body: form,
      });
      if (!resp.ok) {
        const data = await resp.json();
        alert(`Submission failed: ${data.detail || resp.statusText}`);
      } else {
        setIsJobModalOpen(false);
      }
    } catch (e) {
      alert(`Submission error: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 relative">
              <div className="flex-1 pr-24 sm:pr-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Job Tracker</h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1 leading-relaxed">
                  Real-time quantum job monitoring<br />
                  and system health oversight
                </p>
              </div>
              <div className="absolute top-0 right-0 sm:relative sm:top-auto sm:right-auto flex flex-col items-end gap-2">
                <Button
                  onClick={() => setIsJobModalOpen(true)}
                  className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm shadow-lg"
                  iconName="Plus"
                  iconPosition="left"
                >
                  <span className="hidden sm:inline">Submit Job</span>
                  <span className="sm:hidden">Submit</span>
                </Button>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                  <Icon name="Clock" size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Last updated: </span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Filter Panel */}
            <div className="flex justify-end">
              <FilterPanel
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                backendFilter={backendFilter}
                setBackendFilter={setBackendFilter}
                jobTypeFilter={jobTypeFilter}
                setJobTypeFilter={setJobTypeFilter}
                durationFilter={durationFilter}
                setDurationFilter={setDurationFilter}
              />
            </div>

            {/* KPI Cards - Curated Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {/* Using a curated list of important metrics to avoid clutter */}
              {[
                { key: 'ActiveJobs', title: 'Active Jobs', icon: 'Activity', fallback: liveJobsKpiData.find(x => x.title === 'Active Jobs') },
                { key: 'QueueLength', title: 'Queue Length', icon: 'Clock', fallback: liveJobsKpiData.find(x => x.title === 'Queue Length') },
                { key: 'SuccessRate', title: 'Success Rate', icon: 'CheckCircle', fallback: liveJobsKpiData.find(x => x.title === 'Success Rate') },
                { key: 'AvgWaitTime', title: 'Avg Wait Time', icon: 'Timer', fallback: liveJobsKpiData.find(x => x.title === 'Avg Wait Time') },
                { key: 'BackendAvailability', title: 'System Availability', icon: 'Server', fallback: liveJobsKpiData.find(x => x.title === 'Backend Availability') },
                { key: 'ErrorRate', title: 'Error Rate', icon: 'AlertTriangle', fallback: liveJobsKpiData.find(x => x.title === 'Error Rate') },
                { key: 'PendingJobs', title: 'Global Pending', icon: 'Loader', fallback: { value: '0', unit: '', change: '' } }
              ].map((metric) => {
                const apiData = kpiData[metric.key];
                // If API data exists and is valid, use it. Otherwise fallback.
                // Prefer API data even if 0.
                const useApi = apiData && apiData.value !== 'N/A' && apiData.value !== undefined;

                const displayData = useApi ? apiData : metric.fallback;
                if (!displayData || displayData.value === 'N/A') return null;

                return (
                  <KPICard
                    key={metric.key}
                    title={metric.title}
                    value={displayData.value}
                    unit={displayData.unit}
                    trend={displayData.changeType || displayData.trend || 'neutral'}
                    trendValue={displayData.change || displayData.trendValue}
                    status={displayData.status || (displayData.changeType === 'increase' ? 'success' : 'neutral')}
                    sparklineData={displayData.sparklineData || [50, 50, 50, 50, 50]}
                    icon={metric.icon}
                  />
                );
              })}
            </div>

            {/* Job Lifecycle Flow */}
            <div className="mb-4 sm:mb-6 overflow-x-auto">
              <JobLifecycleFlow jobs={jobs} />
            </div>

            {/* Live Job Feed */}
            <div className="mb-6 sm:mb-8">
              <LiveJobFeed jobs={jobs} onJobAction={handleJobAction} />
            </div>

            {/* Job Data Grid */}
            <JobDataGrid
              jobs={jobs}
              onJobAction={handleJobAction}
              onExport={handleExport}
              statusFilter={statusFilter}
              backendFilter={backendFilter}
              jobTypeFilter={jobTypeFilter}
              durationFilter={durationFilter}
            />
          </div>
        </div>
      </main>

      {/* Job Submission Modal */}
      <JobSubmissionModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSubmit={handleJobSubmission}
      />

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* Token Setup Modal */}
      {!tokenConfigured && (
        <Modal isOpen={isTokenModalOpen} onClose={() => { }} title="Setup IBM Quantum API Token">
          <div className="space-y-4">
            <p>Enter your IBM Quantum API token to enable job submission.</p>
            <Input type="password" placeholder="Token" id="token-input" />
            <Button onClick={() => {
              const val = document.getElementById('token-input').value;
              handleSaveToken(val);
            }}>Save Token</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QuantumOperationsCommandCenter;