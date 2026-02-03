let ws = null;
let reconnectInterval = null;

async function checkTokenStatus() {
    try {
        const response = await fetch('/token-status');
        const data = await response.json();
        
        if (data.configured) {
            document.getElementById('token-setup').style.display = 'none';
            document.getElementById('job-form-section').style.display = 'block';
            document.getElementById('jobs-section').style.display = 'block';
            connectWebSocket();
            loadJobs();
            fetchKpis(); // Fetch KPIs when token is configured
        } else {
            document.getElementById('token-setup').style.display = 'block';
            document.getElementById('job-form-section').style.display = 'none';
            document.getElementById('jobs-section').style.display = 'none';
        }
    } catch (error) {
        console.error('Error checking token status:', error);
        document.getElementById('token-setup').style.display = 'block';
    }
}

document.getElementById('token-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = document.getElementById('api-token').value;
    const messageDiv = document.getElementById('token-message');
    
    try {
        const formData = new FormData();
        formData.append('token', token);
        
        const response = await fetch('/save-token', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = 'API token saved successfully! Loading dashboard...';
            messageDiv.style.display = 'block';
            
            setTimeout(() => {
                checkTokenStatus();
            }, 1500);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = `Error: ${data.detail || 'Failed to save token'}`;
            messageDiv.style.display = 'block';
        }
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = `Error: ${error.message}`;
        messageDiv.style.display = 'block';
    }
});

document.getElementById('job-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const messageDiv = document.getElementById('submit-message');
    
    try {
        const response = await fetch('/submit-job', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = `Job submitted successfully! Job ID: ${data.job_id}`;
            messageDiv.style.display = 'block';
            
            e.target.reset();
            document.getElementById('shots').value = '1024';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = `Error: ${data.detail || 'Failed to submit job'}`;
            messageDiv.style.display = 'block';
        }
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = `Error: ${error.message}`;
        messageDiv.style.display = 'block';
    }
});

function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/jobs`;
    
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
        console.log('WebSocket connected');
        document.getElementById('connection-status').className = 'status-dot connected';
        document.getElementById('connection-text').textContent = 'Connected';
        
        if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
        }
    };
    
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'initial_jobs') {
            renderJobs(message.data);
        } else if (message.type === 'job_update') {
            updateJob(message.data);
        }
    };
    
    ws.onclose = () => {
        console.log('WebSocket disconnected');
        document.getElementById('connection-status').className = 'status-dot disconnected';
        document.getElementById('connection-text').textContent = 'Disconnected';
        
        if (!reconnectInterval) {
            reconnectInterval = setInterval(() => {
                console.log('Attempting to reconnect...');
                connectWebSocket();
            }, 5000);
        }
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

async function loadJobs() {
    try {
        const response = await fetch('/jobs');
        const data = await response.json();
        renderJobs(data.jobs);
    } catch (error) {
        console.error('Error loading jobs:', error);
    }
}

function renderJobs(jobs) {
    const tbody = document.getElementById('jobs-tbody');
    
    if (!jobs || jobs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-jobs">No jobs yet. Submit your first quantum job above!</td></tr>';
        return;
    }
    
    tbody.innerHTML = jobs.map(job => createJobRow(job)).join('');
}

function createJobRow(job) {
    const statusClass = `status-${job.status.toLowerCase()}`;
    const submittedDate = new Date(job.submitted_at).toLocaleString();
    const jobIdShort = job.job_id.substring(0, 8) + '...';
    
    return `
        <tr id="job-${job.job_id}">
            <td><strong>${escapeHtml(job.job_name)}</strong></td>
            <td class="job-id" title="${escapeHtml(job.job_id)}">${escapeHtml(jobIdShort)}</td>
            <td>${escapeHtml(job.backend)}</td>
            <td>${escapeHtml(job.circuit)}</td>
            <td><span class="status-badge ${statusClass}">${escapeHtml(job.status)}</span></td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${job.progress}%">
                        ${job.progress > 0 ? job.progress + '%' : ''}
                    </div>
                </div>
            </td>
            <td>${submittedDate}</td>
        </tr>
    `;
}

function updateJob(job) {
    const existingRow = document.getElementById(`job-${job.job_id}`);
    
    if (existingRow) {
        const newRow = createJobRow(job);
        existingRow.outerHTML = newRow;
    } else {
        const tbody = document.getElementById('jobs-tbody');
        const noJobsRow = tbody.querySelector('.no-jobs');
        
        if (noJobsRow) {
            tbody.innerHTML = createJobRow(job);
        } else {
            tbody.insertAdjacentHTML('afterbegin', createJobRow(job));
        }
    }
}

async function fetchKpis() {
    try {
        const response = await fetch('/kpis');
        const data = await response.json();
        document.getElementById('queued-jobs-count').textContent = data.total_pending_jobs;
        document.getElementById('pending-jobs-count').textContent = data.total_pending_jobs;
        document.getElementById('version-display').textContent = "N/A"; // Version is not available from backend
    } catch (error) {
        console.error('Error fetching KPIs:', error);
        document.getElementById('queued-jobs-count').textContent = 'Error';
        document.getElementById('pending-jobs-count').textContent = 'Error';
        document.getElementById('version-display').textContent = 'Error';
    }
}

// Refresh KPIs every 5 seconds
setInterval(fetchKpis, 5000);

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

checkTokenStatus();
