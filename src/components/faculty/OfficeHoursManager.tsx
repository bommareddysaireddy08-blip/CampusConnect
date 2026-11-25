import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Clock, Plus, MapPin, Sparkles } from 'lucide-react';

export const OfficeHoursManager: React.FC = () => {
  const { slots, currentUser, createAppointmentSlot } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:30');
  const [room, setRoom] = useState('Block 3, Cabin 402');
  const [maxCapacity, setMaxCapacity] = useState(3);

  // Faculty's own slots
  const facultySlots = slots.filter((s) => s.facultyId === currentUser?.id);

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    createAppointmentSlot({
      facultyId: currentUser.id,
      facultyName: currentUser.name,
      dayOfWeek,
      startTime,
      endTime,
      room,
      maxCapacity
    });
    setIsAddModalOpen(false);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-main)' }}>
            Recurring Office Hours & Consultation Slots
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)' }}>
            Set predictable weekly consultation hours for students to eliminate message flooding and disorganized walk-ins.
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={15} /> Add Office Hours Slot
        </button>
      </div>

      <div className="info-panel">
        <Sparkles className="info-panel-icon" size={20} />
        <div className="info-panel-content">
          <div className="info-panel-title">Academic Scheduling Insight (P09)</div>
          <div className="info-panel-text">
            Publishing dedicated, bounded consultation windows directly prevents professor overwhelm while giving 
            students reliable certainty on when academic doubts will be answered in person.
          </div>
        </div>
      </div>

      {facultySlots.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Clock size={36} color="var(--color-secondary-teal)" style={{ margin: '0 auto 0.75rem' }} />
          <h4 style={{ fontSize: '1.1rem', color: 'var(--color-text-main)' }}>No Office Hours Defined</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.3rem' }}>
            Add recurring weekly consultation slots so students can schedule appointments cleanly.
          </p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => setIsAddModalOpen(true)}>
            Add First Slot
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {facultySlots.map((slot) => (
            <div key={slot.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                <span className="badge" style={{ background: 'var(--color-soft-sage)', color: 'var(--color-deep-teal)', fontSize: '0.82rem' }}>
                  {slot.dayOfWeek}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary-teal)', fontWeight: 600 }}>
                  Capacity: {slot.maxCapacity} students
                </span>
              </div>

              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={18} color="var(--color-secondary-teal)" />
                {slot.startTime} - {slot.endTime}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.84rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                <MapPin size={14} color="var(--color-warm-amber)" />
                {slot.room}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Slot Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Recurring Consultation Slot"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
            <button className="btn btn-outline btn-sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleCreateSlot}>
              Publish Slot
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateSlot}>
          <div className="form-group">
            <label className="form-label required">Day of Week</label>
            <select
              className="form-select"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
            >
              {days.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label required">Start Time</label>
              <input
                type="time"
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">End Time</label>
              <input
                type="time"
                className="form-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label required">Cabin / Room Location</label>
            <input
              type="text"
              className="form-input"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Block 3, Room 402"
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Max Student Capacity per Slot</label>
            <input
              type="number"
              min="1"
              max="10"
              className="form-input"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 1)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
