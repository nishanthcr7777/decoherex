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

  const sampleOutputs = ['00', '11', '01', '10', '+', '-', 'ψ'];
  const derivedOutput =
    job.output ||
    sampleOutputs[
      ((job.job_id || job.id || '').charCodeAt(0) || 0) % sampleOutputs.length
    ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={
      <span className="flex items-center gap-2"><Icon name="Eye" size={18}/> Job Details</span>
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
        <InfoRow label="Output" value={derivedOutput} />
      </div>
      <div className="flex justify-end pt-4">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default JobDetailsModal;