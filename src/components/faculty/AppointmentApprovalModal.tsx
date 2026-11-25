import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Appointment } from '../../types/index.ts';
import { Check, X, Calendar, Clock, MapPin } from 'lucide-react';

interface AppointmentApprovalModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentApprovalModal: React.FC<AppointmentApprovalModalProps> = ({
  appointment,
  isOpen,
  onClose
}) => {
  const { updateAppointmentStatus } = useApp();
  const [feedback, setFeedback] = useState('');

  if (!appointment) return null;

  const handleAction = (status: 'Confirmed' | 'Rejected' | 'Completed') => {
    updateAppointmentStatus(appointment.id, status, feedback.trim() || undefined);
    setFeedback('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Student Consultation Booking"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            Close
          </button>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            {appointment.status !== 'Rejected' && appointment.status !== 'Cancelled' && (
              <button
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--color-error)', borderColor: 'rgba(185, 74, 74, 0.3)' }}
                onClick={() => handleAction('Rejected')}
              >
                <X size={14} /> Reject Request
              </button>
            )}
            {appointment.status !== 'Confirmed' && appointment.status !== 'Cancelled' && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleAction('Confirmed')}
              >
                <Check size={14} /> Approve & Confirm
              </button>
            )}
            {appointment.status === 'Confirmed' && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleAction('Completed')}
              >
                Mark Completed
              </button>
            )}
          </div>
        </div>
      }
    >
      <div>
        <div style={{
          background: 'var(--color-soft-sage)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-main)' }}>
              {appointment.studentName}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Roll: {appointment.studentRoll}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-main)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={14} color="var(--color-secondary-teal)" /> Date: <strong>{appointment.date}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={14} color="var(--color-secondary-teal)" /> Slot: <strong>{appointment.timeSlot}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={14} color="var(--color-warm-amber)" /> Location: <strong>{appointment.location}</strong>
            </div>
            <div>
              Subject: <strong>{appointment.subject}</strong>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Student Consultation Purpose</label>
          <div style={{
            background: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            fontSize: '0.9rem',
            color: 'var(--color-text-main)',
            lineHeight: 1.5
          }}>
            {appointment.purpose}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Faculty Feedback / Preparation Guidance (Optional)</label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="e.g. Please bring your code repository and diagrams to the session..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};
