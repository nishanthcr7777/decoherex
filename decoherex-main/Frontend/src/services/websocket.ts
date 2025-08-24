// WebSocket service for real-time updates
export interface WebSocketMessage {
  type: string;
  timestamp: string;
  [key: string]: any;
}

export interface JobUpdateMessage extends WebSocketMessage {
  type: 'job_update';
  job_id: string;
  data: {
    job_id: string;
    title: string;
    status: string;
    progress: number;
    logs: string[];
    results?: any;
    error_message?: string;
  };
}

export interface JobProgressMessage extends WebSocketMessage {
  type: 'job_progress';
  job_id: string;
  data: {
    job_id: string;
    progress: number;
    status: string;
  };
}

export interface JobLogMessage extends WebSocketMessage {
  type: 'job_log';
  job_id: string;
  data: {
    job_id: string;
    log_entry: string;
    total_logs: number;
  };
}

export interface JobStatusMessage extends WebSocketMessage {
  type: 'job_status';
  job_id: string;
  data: {
    job_id: string;
    title: string;
    status: string;
    progress: number;
    logs: string[];
    results?: any;
    error_message?: string;
  };
}

export interface JobSystemOverviewMessage extends WebSocketMessage {
  type: 'job_system_overview';
  data: {
    total_jobs: number;
    pending_jobs: number;
    running_jobs: number;
    completed_jobs: number;
    failed_jobs: number;
    success_rate: number;
  };
}

export interface BackendStatusMessage extends WebSocketMessage {
  type: 'backend_status_update';
  backend_id: string;
  data: {
    backend_id: string;
    name: string;
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
  };
}

export interface SystemOverviewMessage extends WebSocketMessage {
  type: 'system_overview_update';
  data: {
    total_backends: number;
    online_backends: number;
    offline_backends: number;
    system_status: string;
  };
}

export interface PongMessage extends WebSocketMessage {
  type: 'pong';
}

export type WebSocketEventMap = {
  'job_update': JobUpdateMessage;
  'job_progress': JobProgressMessage;
  'job_log': JobLogMessage;
  'job_status': JobStatusMessage;
  'job_system_overview': JobSystemOverviewMessage;
  'backend_status_update': BackendStatusMessage;
  'system_overview_update': SystemOverviewMessage;
  'pong': PongMessage;
};

export type WebSocketEventType = keyof WebSocketEventMap;

export interface WebSocketCallbacks {
  onJobUpdate?: (message: JobUpdateMessage) => void;
  onJobProgress?: (message: JobProgressMessage) => void;
  onJobLog?: (message: JobLogMessage) => void;
  onJobStatus?: (message: JobStatusMessage) => void;
  onJobSystemOverview?: (message: JobSystemOverviewMessage) => void;
  onBackendStatusUpdate?: (message: BackendStatusMessage) => void;
  onSystemOverviewUpdate?: (message: SystemOverviewMessage) => void;
  onPong?: (message: PongMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

class WebSocketService {
  private jobSocket: WebSocket | null = null;
  private backendSocket: WebSocket | null = null;
  private callbacks: WebSocketCallbacks = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  constructor() {
    this.setupPingInterval();
  }

  private setupPingInterval() {
    // Send ping every 30 seconds to keep connections alive
    setInterval(() => {
      if (this.jobSocket?.readyState === WebSocket.OPEN) {
        this.jobSocket.send(JSON.stringify({ type: 'ping' }));
      }
      if (this.backendSocket?.readyState === WebSocket.OPEN) {
        this.backendSocket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  }

  // Connect to job updates WebSocket
  connectToJobUpdates(callbacks: WebSocketCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
    
    if (this.jobSocket?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    this.jobSocket = new WebSocket('ws://localhost:8000/ws/job-updates');
    
    this.jobSocket.onopen = () => {
      console.log('🔌 Connected to job updates WebSocket');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      this.callbacks.onConnect?.();
    };

    this.jobSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleJobMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.jobSocket.onclose = () => {
      console.log('🔌 Job updates WebSocket disconnected');
      this.callbacks.onDisconnect?.();
      this.attemptReconnect('job');
    };

    this.jobSocket.onerror = (error) => {
      console.error('Job WebSocket error:', error);
      this.callbacks.onError?.(error);
    };
  }

  // Connect to backend status WebSocket
  connectToBackendStatus(callbacks: WebSocketCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
    
    if (this.backendSocket?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    this.backendSocket = new WebSocket('ws://localhost:8000/ws/backend-status');
    
    this.backendSocket.onopen = () => {
      console.log('🔌 Connected to backend status WebSocket');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      this.callbacks.onConnect?.();
    };

    this.backendSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleBackendMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.backendSocket.onclose = () => {
      console.log('🔌 Backend status WebSocket disconnected');
      this.callbacks.onDisconnect?.();
      this.attemptReconnect('backend');
    };

    this.backendSocket.onerror = (error) => {
      console.error('Backend WebSocket error:', error);
      this.callbacks.onError?.(error);
    };
  }

  // Subscribe to specific job updates
  subscribeToJob(jobId: string) {
    if (this.jobSocket?.readyState === WebSocket.OPEN) {
      this.jobSocket.send(JSON.stringify({
        type: 'subscribe_job',
        job_id: jobId
      }));
    }
  }

  // Unsubscribe from specific job updates
  unsubscribeFromJob(jobId: string) {
    if (this.jobSocket?.readyState === WebSocket.OPEN) {
      this.jobSocket.send(JSON.stringify({
        type: 'unsubscribe_job',
        job_id: jobId
      }));
    }
  }

  // Get current status of a specific job
  getJobStatus(jobId: string) {
    if (this.jobSocket?.readyState === WebSocket.OPEN) {
      this.jobSocket.send(JSON.stringify({
        type: 'get_job_status',
        job_id: jobId
      }));
    }
  }

  private handleJobMessage(message: any) {
    const messageType = message.type as WebSocketEventType;
    
    switch (messageType) {
      case 'job_update':
        this.callbacks.onJobUpdate?.(message as JobUpdateMessage);
        break;
      case 'job_progress':
        this.callbacks.onJobProgress?.(message as JobProgressMessage);
        break;
      case 'job_log':
        this.callbacks.onJobLog?.(message as JobLogMessage);
        break;
      case 'job_status':
        this.callbacks.onJobStatus?.(message as JobStatusMessage);
        break;
      case 'job_system_overview':
        this.callbacks.onJobSystemOverview?.(message as JobSystemOverviewMessage);
        break;
      case 'pong':
        this.callbacks.onPong?.(message as PongMessage);
        break;
      default:
        console.log('Unknown job message type:', messageType);
    }
  }

  private handleBackendMessage(message: any) {
    const messageType = message.type as WebSocketEventType;
    
    switch (messageType) {
      case 'backend_status_update':
        this.callbacks.onBackendStatusUpdate?.(message as BackendStatusMessage);
        break;
      case 'system_overview_update':
        this.callbacks.onSystemOverviewUpdate?.(message as SystemOverviewMessage);
        break;
      case 'pong':
        this.callbacks.onPong?.(message as PongMessage);
        break;
      default:
        console.log('Unknown backend message type:', messageType);
    }
  }

  private attemptReconnect(type: 'job' | 'backend') {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`Max reconnection attempts reached for ${type} WebSocket`);
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect ${type} WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      if (type === 'job') {
        this.connectToJobUpdates(this.callbacks);
      } else {
        this.connectToBackendStatus(this.callbacks);
      }
    }, this.reconnectDelay);

    // Exponential backoff
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
  }

  // Disconnect all WebSocket connections
  disconnect() {
    if (this.jobSocket) {
      this.jobSocket.close();
      this.jobSocket = null;
    }
    if (this.backendSocket) {
      this.backendSocket.close();
      this.backendSocket = null;
    }
    console.log('🔌 All WebSocket connections closed');
  }

  // Check if WebSockets are connected
  isConnected(): boolean {
    return (
      (this.jobSocket?.readyState === WebSocket.OPEN) ||
      (this.backendSocket?.readyState === WebSocket.OPEN)
    );
  }

  // Get connection status
  getConnectionStatus() {
    return {
      jobSocket: this.jobSocket?.readyState === WebSocket.OPEN,
      backendSocket: this.backendSocket?.readyState === WebSocket.OPEN,
      connected: this.isConnected()
    };
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
export default webSocketService;
