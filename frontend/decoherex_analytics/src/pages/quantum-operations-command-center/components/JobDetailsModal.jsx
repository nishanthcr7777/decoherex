import React from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between py-1">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <span className="text-sm font-mono text-foreground text-right break-all pl-4">{value ?? '—'}</span>
  </div>
);

const JobDetailsModal = ({ job, open, onClose }) => {
  const isOpen = open;
  if (!job) return null;

  // Determine output display
  let outputDisplay = '—';

  if (job.results) {
    // If we have structured results (from backend fetch)
    if (typeof job.results === 'object') {
      outputDisplay = (
        <pre className="text-xs bg-black/20 p-2 rounded overflow-auto max-h-40">
          {JSON.stringify(job.results, null, 2)}
        </pre>
      );
    } else {
      outputDisplay = job.results;
    }
  } else if (['queued', 'pending', 'running'].includes(statusLower)) {
    outputDisplay = <span className="text-muted-foreground italic">Waiting for results...</span>;
  } else if (job.output) {
    // Fallback or simple output
    try {
      const parsed = JSON.parse(job.output);
      outputDisplay = (
        <pre className="text-xs bg-black/20 p-2 rounded overflow-auto max-h-40">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch (e) {
      outputDisplay = job.output;
    }
  } else {
    // Old mock logic as last resort
    const sampleOutputs = ['00', '11', '01', '10', '+', '-', 'ψ'];
    outputDisplay = sampleOutputs[((job.job_id || job.id || '').charCodeAt(0) || 0) % sampleOutputs.length];
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={
      <span className="flex items-center gap-2"><Icon name="Eye" size={18} /> Job Details</span>
    }>
      <div className="space-y-3 mt-2">
        <InfoRow label="Job Name" value={job.job_name || job.type || 'N/A'} />
        <InfoRow label="Job ID" value={`#${(job.job_id || job.id)?.slice(-8)}`} />
        <InfoRow label="Backend" value={job.backend} />
        <InfoRow label="Circuit" value={job.circuit || job.circuit_type || '—'} />
        <InfoRow label="Circuit Type" value={job.circuit_type || job.type || '—'} />
        <InfoRow label="Status" value={job.status} />
        <InfoRow label="Progress" value={`${job.progress ?? 0}%`} />
        <InfoRow label="Submitted At" value={new Date(job.submitted_at || job.timestamp).toLocaleString()} />
        <InfoRow label="Output" value={outputDisplay} />
      </div>
      <div className="flex justify-end pt-4">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default JobDetailsModal;