import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Pause, 
  Trash2, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import apiService, { Job, JobCreate } from '../services/api';
import webSocketService, { 
  JobUpdateMessage, 
  JobProgressMessage, 
  JobLogMessage,
  JobSystemOverviewMessage 
} from '../services/websocket';

const JobTracking: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [systemOverview, setSystemOverview] = useState<{
    total_jobs: number;
    pending_jobs: number;
    running_jobs: number;
    completed_jobs: number;
    failed_jobs: number;
    success_rate: number;
  } | null>(null);
  const [websocketStatus, setWebsocketStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  // Form state for creating new job
  const [newJob, setNewJob] = useState<JobCreate>({
    title: '',
    description: '',
    backend_id: 'ibm_osaka',
    shots: 1024,
    qubits: 4,
    depth: 8,
    priority: 'medium'
  });

  useEffect(() => {
    loadJobs();
    setupWebSocket();
    
    return () => {
      // Cleanup WebSocket connections
      webSocketService.disconnect();
    };
  }, []);

  const setupWebSocket = () => {
    setWebsocketStatus('connecting');
    
    webSocketService.connectToJobUpdates({
      onConnect: () => {
        console.log('🔌 WebSocket connected for job updates');
        setWebsocketStatus('connected');
      },
      onDisconnect: () => {
        console.log('🔌 WebSocket disconnected');
        setWebsocketStatus('disconnected');
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
        setWebsocketStatus('disconnected');
      },
      onJobUpdate: (message: JobUpdateMessage) => {
        console.log('📊 Job update received:', message);
        handleJobUpdate(message.data);
      },
      onJobProgress: (message: JobProgressMessage) => {
        console.log('📈 Job progress received:', message);
        handleJobProgress(message.data);
      },
      onJobLog: (message: JobLogMessage) => {
        console.log('📝 Job log received:', message);
        handleJobLog(message.data);
      },
      onJobSystemOverview: (message: JobSystemOverviewMessage) => {
        console.log('🌐 Job system overview received:', message);
        setSystemOverview(message.data);
      }
    });
  };

  const handleJobUpdate = (jobData: any) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.job_id === jobData.job_id 
          ? { ...job, ...jobData }
          : job
      )
    );
  };

  const handleJobProgress = (progressData: any) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.job_id === progressData.job_id 
          ? { ...job, progress: progressData.progress, status: progressData.status }
          : job
      )
    );
  };

  const handleJobLog = (logData: any) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.job_id === logData.job_id 
          ? { ...job, logs: [...(job.logs || []), logData.log_entry] }
          : job
      )
    );
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      const fetchedJobs = await apiService.getJobs();
      setJobs(fetchedJobs);
      setError(null);
    } catch (err) {
      setError('Failed to load jobs. Please check if the backend is running.');
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    try {
      const createdJob = await apiService.createJob(newJob);
      setJobs([createdJob, ...jobs]);
      setShowCreateModal(false);
      setNewJob({
        title: '',
        description: '',
        backend_id: 'ibm_osaka',
        shots: 1024,
        qubits: 4,
        depth: 8,
        priority: 'medium'
      });
      
      // Subscribe to updates for the new job
      webSocketService.subscribeToJob(createdJob.job_id);
    } catch (err) {
      setError('Failed to create job');
      console.error('Error creating job:', err);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await apiService.deleteJob(jobId);
        setJobs(jobs.filter(job => job.job_id !== jobId));
        // Unsubscribe from job updates
        webSocketService.unsubscribeFromJob(jobId);
      } catch (err) {
        setError('Failed to delete job');
        console.error('Error deleting job:', err);
      }
    }
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      await apiService.cancelJob(jobId);
      await loadJobs(); // Reload to get updated status
    } catch (err) {
      setError('Failed to cancel job');
      console.error('Error cancelling job:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading jobs...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Tracking</h1>
          <p className="text-gray-600">Monitor and manage your quantum computing jobs</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Job
        </button>
      </div>

      {/* WebSocket Status and System Overview */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                websocketStatus === 'connected' ? 'bg-green-500' : 
                websocketStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                {websocketStatus === 'connected' ? 'Real-time updates active' :
                 websocketStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          {systemOverview && (
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900">{systemOverview.total_jobs}</div>
                <div className="text-gray-500">Total Jobs</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">{systemOverview.running_jobs}</div>
                <div className="text-gray-500">Running</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">{systemOverview.completed_jobs}</div>
                <div className="text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-red-600">{systemOverview.failed_jobs}</div>
                <div className="text-gray-500">Failed</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">{Math.round(systemOverview.success_rate * 100)}%</div>
                <div className="text-gray-500">Success Rate</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={loadJobs}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Backend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <tr key={job.job_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.description}</div>
                      <div className="text-xs text-gray-400">ID: {job.job_id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{job.backend_id}</div>
                    <div className="text-xs text-gray-500">{job.qubits} qubits, {job.shots} shots</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{job.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(job.submitted_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(job.submitted_at).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowJobDetails(true);
                          // Subscribe to updates for this specific job
                          webSocketService.subscribeToJob(job.job_id);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {job.status === 'running' && (
                        <button
                          onClick={() => handleCancelJob(job.job_id)}
                          className="text-red-600 hover:text-red-800"
                          title="Cancel Job"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteJob(job.job_id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredJobs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || statusFilter !== 'all' ? 'No jobs match your filters' : 'No jobs found'}
          </div>
        )}
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Job</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter job title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter job description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backend</label>
                  <select
                    value={newJob.backend_id}
                    onChange={(e) => setNewJob({...newJob, backend_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ibm_osaka">IBM Osaka</option>
                    <option value="google_sycamore">Google Sycamore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newJob.priority}
                    onChange={(e) => setNewJob({...newJob, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qubits</label>
                  <input
                    type="number"
                    value={newJob.qubits}
                    onChange={(e) => setNewJob({...newJob, qubits: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Depth</label>
                  <input
                    type="number"
                    value={newJob.depth}
                    onChange={(e) => setNewJob({...newJob, depth: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shots</label>
                  <input
                    type="number"
                    value={newJob.shots}
                    onChange={(e) => setNewJob({...newJob, shots: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="10000"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateJob}
                disabled={!newJob.title}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedJob.title}</h2>
              <button
                onClick={() => {
                  setShowJobDetails(false);
                  // Unsubscribe from job updates when closing details
                  webSocketService.unsubscribeFromJob(selectedJob.job_id);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Job Information</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">ID:</span> {selectedJob.job_id}</div>
                  <div><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedJob.status)}`}>
                      {selectedJob.status}
                    </span>
                  </div>
                  <div><span className="font-medium">Priority:</span> {selectedJob.priority}</div>
                  <div><span className="font-medium">Backend:</span> {selectedJob.backend_id}</div>
                  <div><span className="font-medium">Progress:</span> {selectedJob.progress}%</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Technical Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Qubits:</span> {selectedJob.qubits}</div>
                  <div><span className="font-medium">Depth:</span> {selectedJob.depth}</div>
                  <div><span className="font-medium">Shots:</span> {selectedJob.shots}</div>
                  <div><span className="font-medium">Estimated Time:</span> {selectedJob.estimated_time}</div>
                </div>
              </div>
            </div>
            
            {selectedJob.description && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-600">{selectedJob.description}</p>
              </div>
            )}
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Execution Logs</h3>
              <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                {selectedJob.logs.map((log, index) => (
                  <div key={index} className="text-sm text-gray-700 mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </div>
            
            {selectedJob.results && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Results</h3>
                <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(selectedJob.results, null, 2)}
                </pre>
              </div>
            )}
            
            {selectedJob.error_message && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-red-600">Error</h3>
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {selectedJob.error_message}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTracking;