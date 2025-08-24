// API service for communicating with the Decoherex backend
const API_BASE_URL = 'http://localhost:8000';

export interface Job {
  id: string;
  job_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  backend_id: string;
  shots: number;
  qubits?: number;
  depth?: number;
  user_id: string;
  submitted_at: string;
  started_at?: string;
  completed_at?: string;
  estimated_time: string;
  progress: number;
  results?: any;
  logs: string[];
  error_message?: string;
}

export interface JobCreate {
  title: string;
  description?: string;
  backend_id: string;
  shots: number;
  qubits?: number;
  depth?: number;
  priority?: 'low' | 'medium' | 'high';
}

export interface JobUpdate {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  backend_id?: string;
  shots?: number;
  qubits?: number;
  depth?: number;
}

// Backend Management Interfaces
export interface BackendStatus {
  backend_id: string;
  status: string;
  last_heartbeat: string;
  uptime_seconds: number;
  total_jobs_processed: number;
  current_queue_length: number;
  error_count: number;
  last_error?: string;
  hardware_info?: {
    temperature: number;
    coherence_time: number;
    gate_fidelity: number;
  };
}

export interface QueueInfo {
  backend_id: string;
  queue_length: number;
  estimated_wait_time: string;
  priority_distribution: {
    low: number;
    medium: number;
    high: number;
  };
  oldest_job_age: string;
  average_processing_time: string;
  queue_status: string;
}

export interface BackendMetrics {
  backend_id: string;
  timestamp: string;
  jobs_per_hour: number;
  success_rate: number;
  average_execution_time: number;
  error_rate: number;
  queue_efficiency: number;
  resource_utilization: number;
  cost_per_job?: number;
}

export interface BackendHealth {
  backend_id: string;
  health_score: number;
  status: string;
  issues: string[];
  recommendations: string[];
  last_maintenance?: string;
  next_maintenance?: string;
}

export interface BackendResponse {
  backend_id: string;
  name: string;
  provider: string;
  location: string;
  qubits: number;
  status: BackendStatus;
  queue: QueueInfo;
  metrics: BackendMetrics;
  health: BackendHealth;
  created_at: string;
  updated_at: string;
}

export interface SystemOverview {
  total_backends: number;
  online_backends: number;
  offline_backends: number;
  total_jobs: number;
  pending_jobs: number;
  running_jobs: number;
  completed_jobs: number;
  failed_jobs: number;
  success_rate: number;
  system_status: string;
  last_updated: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Job Management
  async getJobs(params?: {
    status?: string;
    backend_id?: string;
    limit?: number;
    skip?: number;
  }): Promise<Job[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.backend_id) queryParams.append('backend_id', params.backend_id);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());

    const endpoint = `/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<Job[]>(endpoint);
  }

  async getJob(jobId: string): Promise<Job> {
    return this.request<Job>(`/jobs/${jobId}`);
  }

  async createJob(jobData: JobCreate): Promise<Job> {
    return this.request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(jobId: string, jobData: JobUpdate): Promise<Job> {
    return this.request<Job>(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(jobId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  async getJobLogs(jobId: string): Promise<{ logs: string[]; total_logs: number }> {
    return this.request<{ logs: string[]; total_logs: number }>(`/jobs/${jobId}/logs`);
  }

  async getJobResults(jobId: string): Promise<{
    results: any;
    completed_at: string;
    execution_time: string;
  }> {
    return this.request<{
      results: any;
      completed_at: string;
      execution_time: string;
    }>(`/jobs/${jobId}/results`);
  }

  async cancelJob(jobId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/jobs/${jobId}/cancel`, {
      method: 'POST',
    });
  }

  async addJobLog(jobId: string, logMessage: string): Promise<{ message: string; log: string }> {
    return this.request<{ message: string; log: string }>(`/jobs/${jobId}/logs`, {
      method: 'POST',
      body: JSON.stringify({ log_message: logMessage }),
    });
  }

  // Backend Management
  async getBackends(): Promise<BackendResponse[]> {
    return this.request<BackendResponse[]>('/backends');
  }

  async getBackend(backendId: string): Promise<BackendResponse> {
    return this.request<BackendResponse>(`/backends/${backendId}`);
  }

  async getBackendStatus(backendId: string): Promise<BackendStatus> {
    return this.request<BackendStatus>(`/backends/${backendId}/status`);
  }

  async getBackendQueue(backendId: string): Promise<QueueInfo> {
    return this.request<QueueInfo>(`/backends/${backendId}/queue`);
  }

  async getBackendMetrics(backendId: string): Promise<BackendMetrics> {
    return this.request<BackendMetrics>(`/backends/${backendId}/metrics`);
  }

  async getBackendHealth(backendId: string): Promise<BackendHealth> {
    return this.request<BackendHealth>(`/backends/${backendId}/health`);
  }

  async getSystemOverview(): Promise<SystemOverview> {
    return this.request<SystemOverview>('/backends/system/overview');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
