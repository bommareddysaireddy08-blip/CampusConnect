import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { Modal } from '../common/Modal';
import { FACULTY_DIRECTORY } from '../../services/storage.ts';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  List,
  CalendarCheck
} from 'lucide-react';

export const AppointmentsView: React.FC = () => {
  const { appointments, slots, currentUser, bookAppointment, cancelAppointment } = useApp();

  const [viewStyle, setViewStyle] = useState<'list' | 'calendar'>('list');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>(FACULTY_DIRECTORY[0].id);
  const [appointmentDate, setAppointmentDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Calendar month state
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const studentAppointments = appointments.filter((apt) => apt.studentId === currentUser?.id);
  const facultySlots = slots.filter((s) => s.facultyId === selectedFacultyId);
  const selectedFaculty = FACULTY_DIRECTORY.find((f) => f.id === selectedFacultyId) || FACULTY_DIRECTORY[0];

  const handleOpenBookModal = (preselectedFacId?: string) => {
    if (preselectedFacId) {
      setSelectedFacultyId(preselectedFacId);
    }
    setFormError('');
    setIsBookModalOpen(true);
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedSlotId) {
      setFormError('Please select a time slot.');
      return;
    }

    if (!purpose.trim()) {
      setFormError('Please describe the purpose of your appointment.');
      return;
    }

    const slot = slots.find((s) => s.id === selectedSlotId);
    if (!slot) {
      setFormError('Selected slot is invalid.');
      return;
    }

    const timeSlotString = `${slot.startTime} - ${slot.endTime}`;

    const result = bookAppointment({
      facultyId: selectedFaculty.id,
      facultyName: selectedFaculty.name,
      date: appointmentDate,
      timeSlot: timeSlotString,
      subject: selectedFaculty.subjects[0] || 'Academic Consultation',
      purpose,
      location: slot.room
    });

    if (result.success) {
      setPurpose('');
      setSelectedSlotId('');
      setIsBookModalOpen(false);
    } else {
      setFormError(result.message);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Calendar Days generator
  const renderCalendarMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ minHeight: '65px', background: 'transparent' }} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayAppointments = studentAppointments.filter((a) => a.date === dateStr && a.status !== 'Cancelled');
      const isPast = new Date(dateStr) < new Date(todayStr);

      days.push(
        <div
          key={day}
          style={{
            minHeight: '75px',
            padding: '0.4rem',
            background: dayAppointments.length > 0 ? 'var(--color-soft-sage)' : 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            opacity: isPast ? 0.6 : 1
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.82rem', color: isPast ? 'var(--color-text-muted)' : 'var(--color-text-main)' }}>
              {day}
            </span>
            {dayAppointments.length > 0 && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-deep-teal)' }} />
            )}
          </div>

          {dayAppointments.map((apt) => (
            <div
              key={apt.id}
              style={{
                fontSize: '0.68rem',
                background: 'var(--color-card-bg)',
                padding: '0.2rem 0.35rem',
                borderRadius: '3px',
                border: '1px solid var(--color-border)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: 'var(--color-deep-teal)',
                fontWeight: 600
              }}
              title={`${apt.facultyName} - ${apt.timeSlot}`}
            >
              {apt.facultyName.split(' ')[1] || apt.facultyName}: {apt.timeSlot}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  return (
    <div>
      {/* Top Banner / Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>
            Faculty Consultation Schedule
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)' }}>
            Schedule 1-on-1 office visits for complex doubts, project reviews, and academic guidance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button
              className="btn btn-sm"
              style={{
                background: viewStyle === 'list' ? 'var(--color-deep-teal)' : 'var(--color-card-bg)',
                color: viewStyle === 'list' ? '#ffffff' : 'var(--color-text-main)',
                borderRadius: 0
              }}
              onClick={() => setViewStyle('list')}
            >
              <List size={14} /> List
            </button>
            <button
              className="btn btn-sm"
              style={{
                background: viewStyle === 'calendar' ? 'var(--color-deep-teal)' : 'var(--color-card-bg)',
                color: viewStyle === 'calendar' ? '#ffffff' : 'var(--color-text-main)',
                borderRadius: 0
              }}
              onClick={() => setViewStyle('calendar')}
            >
              <CalendarCheck size={14} /> Calendar
            </button>
          </div>

          <button className="btn btn-primary btn-sm" onClick={() => handleOpenBookModal()}>
            <Plus size={15} /> Book Consultation
          </button>
        </div>
      </div>

      {/* CALENDAR VIEW */}
      {viewStyle === 'calendar' && (
        <div className="card" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CalendarIcon size={18} color="var(--color-deep-teal)" />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h4>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setCurrentMonth(new Date())}
              >
                Today
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', fontWeight: 700, fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
            {renderCalendarMonth()}
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {viewStyle === 'list' && (
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CalendarIcon size={18} color="var(--color-deep-teal)" />
              <h4 className="card-title">My Booked Consultations</h4>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Total: {studentAppointments.length}
            </span>
          </div>

          {studentAppointments.length === 0 ? (
            <EmptyState
              icon={CalendarIcon}
              title="No Scheduled Appointments"
              description="You don't have any upcoming faculty meetings. Need in-person help? Reserve an office hours slot."
              actionText="Book Consultation"
              onAction={() => handleOpenBookModal()}
            />
          ) : (
            <div className="table-responsive">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Faculty & Subject</th>
                    <th>Date & Time</th>
                    <th>Location</th>
                    <th>Purpose</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {studentAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                          {apt.facultyName}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                          {apt.subject}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <CalendarIcon size={13} color="var(--color-secondary-teal)" />
                          {apt.date}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Clock size={12} /> {apt.timeSlot}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                          <MapPin size={14} color="var(--color-warm-amber)" />
                          {apt.location}
                        </div>
                      </td>
                      <td style={{ maxWidth: '280px' }}>
                        <span style={{ fontSize: '0.85rem' }}>{apt.purpose}</span>
                        {apt.facultyFeedback && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary-teal)', marginTop: '0.3rem', background: 'var(--color-soft-sage)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            <strong>Note:</strong> {apt.facultyFeedback}
                          </div>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={apt.status} />
                      </td>
                      <td>
                        {apt.status !== 'Cancelled' && apt.status !== 'Rejected' ? (
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--color-error)', borderColor: 'rgba(185, 74, 74, 0.3)', fontSize: '0.76rem', padding: '0.25rem 0.6rem' }}
                            onClick={() => {
                              if (window.confirm('Are you sure you want to cancel this consultation booking?')) {
                                cancelAppointment(apt.id);
                              }
                            }}
                          >
                            Cancel
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Inactive</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Available Faculty Directory & Office Hours */}
      <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', marginBottom: '1rem' }}>
        Faculty Consultation Availability & Office Hours
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.25rem' }}>
        {FACULTY_DIRECTORY.map((fac) => {
          const facSlots = slots.filter((s) => s.facultyId === fac.id);

          return (
            <div key={fac.id} className="card" style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-soft-sage)',
                  color: 'var(--color-deep-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}>
                  <User size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.02rem', color: 'var(--color-text-main)' }}>{fac.name}</h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>{fac.department}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
                Subjects: <strong>{fac.subjects.join(', ')}</strong>
              </div>

              <div style={{ background: 'var(--color-warm-ivory)', borderRadius: 'var(--radius-md)', padding: '0.75rem 0.9rem', marginBottom: '1.1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-deep-teal)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Weekly Office Hours:
                </div>
                {facSlots.length === 0 ? (
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>No recurring slots published.</div>
                ) : (
                  facSlots.map((s) => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600 }}>{s.dayOfWeek}</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{s.startTime} - {s.endTime} ({s.room})</span>
                    </div>
                  ))
                )}
              </div>

              <button
                className="btn btn-outline btn-sm"
                style={{ width: '100%' }}
                onClick={() => handleOpenBookModal(fac.id)}
              >
                <CalendarIcon size={14} /> Schedule With {fac.name.split(' ')[1] || 'Professor'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Schedule Faculty Consultation"
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
            <button className="btn btn-outline btn-sm" onClick={() => setIsBookModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleBook}>
              <CheckCircle2 size={14} /> Confirm Booking
            </button>
          </div>
        }
      >
        <form onSubmit={handleBook}>
          {formError && (
            <div className="info-panel" style={{ background: 'var(--color-error-bg)', borderColor: 'rgba(185, 74, 74, 0.3)', marginBottom: '1.25rem' }}>
              <AlertCircle size={18} color="var(--color-error)" />
              <div style={{ fontSize: '0.85rem', color: 'var(--color-error)', fontWeight: 600 }}>
                {formError}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label required">Select Professor</label>
              <select
                className="form-select"
                value={selectedFacultyId}
                onChange={(e) => {
                  setSelectedFacultyId(e.target.value);
                  setSelectedSlotId('');
                }}
              >
                {FACULTY_DIRECTORY.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.subjects[0]})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required">Consultation Date</label>
              <input
                type="date"
                className="form-input"
                min={todayStr}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label required">Choose Available Time Slot</label>
            {facultySlots.length === 0 ? (
              <div style={{ padding: '1rem', background: 'var(--color-soft-sage)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                No active slots published. You can submit your doubt via question queue.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem' }}>
                {facultySlots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <div
                      key={slot.id}
                      onClick={() => setSelectedSlotId(slot.id)}
                      style={{
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--color-deep-teal)' : '1px solid var(--color-border)',
                        background: isSelected ? 'var(--color-soft-sage)' : 'var(--color-card-bg)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                        {slot.dayOfWeek}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-secondary-teal)', marginTop: '0.2rem' }}>
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', marginTop: '0.3rem' }}>
                        📍 {slot.room}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label required">Purpose of Consultation</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Specify the topics or problems you want to discuss with professor..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
