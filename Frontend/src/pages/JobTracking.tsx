import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronRight, Play, Pause, BarChart3, FileText } from 'lucide-react';
import StatusPill from '../components/UI/StatusPill';
import Button from '../components/UI/Button';

interface Job {
  id: string;
  backend: string;
  status: 'running' | 'completed' | 'failed' | 'queued' | 'cancelled';
  shots: number;
  submittedAt: string;
  progress?: number;
  qubits?: number;
  depth?: number;
  estimatedTime?: string;
  logs?: string[];
  results?: { [key: string]: number };
}

const JobTracking = () => {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 'qj_001_2024',
      backend: 'ibm_osaka',
      status: 'running',
      shots: 1024,
      submittedAt: '2024-01-15T10:30:00Z',
      progress: 75,
      qubits: 5,
      depth: 12,
      estimatedTime: '2m 15s',
      logs: [
        '10:30:15 - Job submitted to queue',
        '10:31:22 - Starting compilation',
        '10:31:45 - Compilation complete',
        '10:32:00 - Executing on quantum hardware...',
      ],
      results: {}
    },
    {
      id: 'qj_002_2024',
      backend: 'ibm_kyoto',
      status: 'completed',
      shots: 4096,
      submittedAt: '2024-01-15T10:15:00Z',
      progress: 100,
      qubits: 3,
      depth: 8,
      logs: [
        '10:15:15 - Job submitted to queue',
        '10:16:22 - Starting compilation',
        '10:16:45 - Compilation complete',
        '10:17:00 - Executing on quantum hardware...',
        '10:19:30 - Execution complete',
        '10:19:35 - Results ready for download'
      ],
      results: { '000': 2048, '001': 1024, '010': 512, '011': 256, '100': 128, '101': 64, '110': 32, '111': 32 }
    },
    {
      id: 'qj_003_2024',
      backend: 'simulator',
      status: 'failed',
      shots: 8192,
      submittedAt: '2024-01-15T10:00:00Z',
      qubits: 10,
      depth: 25,
      logs: [
        '10:00:15 - Job submitted to queue',
        '10:01:22 - Starting compilation',
        '10:02:45 - Error: Circuit depth exceeds backend limit',
        '10:02:46 - Job failed'
      ],
      results: {}
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  // Simulate WebSocket updates
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs(prevJobs => 
        prevJobs.map(job => {
          if (job.status === 'running' && job.progress !== undefined && job.progress < 100) {
            const newProgress = Math.min(100, job.progress + Math.random() * 10);
            return { 
              ...job, 
              progress: newProgress,
              status: newProgress >= 100 ? 'completed' : 'running'
            };
          }
          return job;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.backend.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Tracking</h1>
          <p className="text-gray-400 mt-1">Monitor your quantum computing jobs in real-time</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button>Submit New Job</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by ID or backend..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Status</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="queued">Queued</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-slate-600">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Job ID</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Backend</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Shots</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Submitted At</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredJobs.map((job) => (
                <React.Fragment key={job.id}>
                  <tr className="hover:bg-slate-700/30 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <button
                          onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                          className="mr-2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                        >
                          {expandedJob === job.id ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        <span className="font-mono text-cyan-400">{job.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white">{job.backend}</td>
                    <td className="py-4 px-6">
                      <StatusPill status={job.status} size="sm" />
                    </td>
                    <td className="py-4 px-6 text-white">{job.shots.toLocaleString()}</td>
                    <td className="py-4 px-6 text-gray-300">{formatDate(job.submittedAt)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {job.status === 'running' ? (
                          <Button size="sm" variant="ghost" icon={Pause}>
                            Cancel
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost" icon={Play}>
                            Rerun
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row */}
                  {expandedJob === job.id && (
                    <tr>
                      <td colSpan={6} className="py-0">
                        <div className="bg-slate-900/50 border-t border-slate-700">
                          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Job Details */}
                            <div>
                              <h4 className="text-lg font-semibold text-white mb-4">Job Details</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Qubits:</span>
                                  <span className="text-white">{job.qubits}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Circuit Depth:</span>
                                  <span className="text-white">{job.depth}</span>
                                </div>
                                {job.estimatedTime && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Est. Time:</span>
                                    <span className="text-white">{job.estimatedTime}</span>
                                  </div>
                                )}
                                {job.progress !== undefined && (
                                  <div>
                                    <div className="flex justify-between mb-2">
                                      <span className="text-gray-400">Progress:</span>
                                      <span className="text-white">{job.progress.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(job.progress)}`}
                                        style={{ width: `${job.progress}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Logs */}
                            <div>
                              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                Execution Logs
                              </h4>
                              <div className="bg-slate-800 rounded-lg p-4 max-h-40 overflow-y-auto">
                                <div className="space-y-1">
                                  {job.logs?.map((log, index) => (
                                    <div key={index} className="text-sm font-mono text-gray-300">
                                      {log}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Results */}
                            {job.results && Object.keys(job.results).length > 0 && (
                              <div className="lg:col-span-2">
                                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                                  <BarChart3 className="w-5 h-5 mr-2" />
                                  Results Histogram
                                </h4>
                                <div className="bg-slate-800 rounded-lg p-4">
                                  <div className="grid grid-cols-8 gap-2">
                                    {Object.entries(job.results).map(([state, count]) => (
                                      <div key={state} className="text-center">
                                        <div className="text-xs text-gray-400 mb-1">{state}</div>
                                        <div 
                                          className="bg-cyan-500 rounded-t"
                                          style={{ 
                                            height: `${Math.max(8, (count / Math.max(...Object.values(job.results))) * 60)}px` 
                                          }}
                                        ></div>
                                        <div className="text-xs text-white mt-1">{count}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400">No jobs found matching your criteria</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobTracking;