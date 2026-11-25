import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { QuestionDetailModal } from './QuestionDetailModal';
import { AppointmentApprovalModal } from './AppointmentApprovalModal';
import { Question, Appointment } from '../../types/index.ts';
import { SUBJECTS_LIST } from '../../services/storage.ts';
import { 
  HelpCircle, 
  Clock, 
  CheckCircle, 
  Calendar, 
  Search, 
  MessageSquare, 
  User, 
  ArrowRight,
  Check,
  Paperclip,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface FacultyDashboardProps {
  viewMode?: 'overview' | 'questions' | 'appointments';
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ viewMode = 'overview' }) => {
  const { questions, appointments, currentUser, setActiveTab, updateAppointmentStatus } = useApp();

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');

  // Filter questions for this faculty (or department) that have been sent to faculty
  const facultyQuestions = questions.filter(
    (q) => q.sentToFaculty && (q.facultyId === currentUser?.id || currentUser?.department?.includes('Computer Science'))
  );

  const totalQuestions = facultyQuestions.length;
  const unansweredQuestions = facultyQuestions.filter(
    (q) => q.status === 'Sent to Faculty' || q.status === 'Submitted' || q.status === 'In Review'
  ).length;
  const answeredQuestions = facultyQuestions.filter(
    (q) => q.status === 'Answered' || q.status === 'Resolved' || q.status === 'Meeting Suggested'
  ).length;

  // Faculty appointments
  const facultyAppointments = appointments.filter((a) => a.facultyId === currentUser?.id);
  const upcomingAppointments = facultyAppointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Pending'
  );

  // Filtered questions
  const filteredQuestions = facultyQuestions.filter((q) => {
    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    const matchesSubject = subjectFilter === 'All' || q.subject === subjectFilter;
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.studentRoll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSubject && matchesSearch;
  });

  return (
    <div>
      {/* Faculty Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-deep-teal) 0%, #1e4540 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem 2.25rem',
        color: '#ffffff',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(213, 164, 91, 0.25)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', color: 'var(--color-warm-amber)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> Faculty Academic Consultation Management
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', color: '#ffffff', marginBottom: '0.4rem' }}>
            {currentUser?.name || 'Faculty Professor'}
          </h2>
          <p style={{ color: 'var(--color-soft-sage)', fontSize: '0.92rem', maxWidth: '620px' }}>
            {currentUser?.designation || 'Senior Professor'} • {currentUser?.department}. Structured doubt pipeline, 
            office hours scheduling, and automated repeated doubt curation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <button
            className="btn btn-amber"
            onClick={() => setActiveTab('faculty-slots')}
          >
            <Clock size={16} /> Manage Office Hours
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card teal">
          <div className="stat-info">
            <span className="stat-label">Total Doubts Received</span>
            <span className="stat-value">{totalQuestions}</span>
            <span className="stat-subtext">Received this semester</span>
          </div>
          <div className="stat-icon-wrapper teal">
            <HelpCircle size={22} />
          </div>
        </div>

        <div className="stat-card amber">
          <div className="stat-info">
            <span className="stat-label">Unanswered Doubts</span>
            <span className="stat-value">{unansweredQuestions}</span>
            <span className="stat-subtext">Awaiting your response</span>
          </div>
          <div className="stat-icon-wrapper amber">
            <Clock size={22} />
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-info">
            <span className="stat-label">Recently Answered</span>
            <span className="stat-value">{answeredQuestions}</span>
            <span className="stat-subtext">Resolved queries</span>
          </div>
          <div className="stat-icon-wrapper success">
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="stat-card teal">
          <div className="stat-info">
            <span className="stat-label">Appointment Bookings</span>
            <span className="stat-value">{upcomingAppointments.length}</span>
            <span className="stat-subtext">Active consultations</span>
          </div>
          <div className="stat-icon-wrapper teal">
            <Calendar size={22} />
          </div>
        </div>
      </div>

      {/* Appointments Management */}
      {(viewMode === 'overview' || viewMode === 'appointments') && (
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Calendar size={18} color="var(--color-deep-teal)" />
              <h4 className="card-title">Student Consultation Bookings & Office Requests</h4>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              {facultyAppointments.length} Bookings
            </span>
          </div>

          {facultyAppointments.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center' }}>
              <Calendar size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>No appointment bookings yet</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                Students who book consultations during your office hours will appear here.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Student Name & Roll</th>
                    <th>Date & Time</th>
                    <th>Purpose</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                          {apt.studentName}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                          Roll: {apt.studentRoll} • {apt.subject}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{apt.date}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                          {apt.timeSlot} ({apt.location})
                        </div>
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <span style={{ fontSize: '0.85rem' }}>{apt.purpose}</span>
                      </td>
                      <td>
                        <StatusBadge status={apt.status} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.45rem' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.74rem', padding: '0.25rem 0.55rem' }}
                            onClick={() => setSelectedAppointment(apt)}
                          >
                            Review / Note
                          </button>
                          {apt.status === 'Pending' && (
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '0.74rem', padding: '0.25rem 0.55rem' }}
                              onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')}
                            >
                              <Check size={12} /> Confirm
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Student Doubts Queue Section */}
      {(viewMode === 'overview' || viewMode === 'questions') && (
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <HelpCircle size={18} color="var(--color-deep-teal)" />
              <h4 className="card-title">Student Academic Doubts Queue</h4>
            </div>

            {/* Filter controls */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative', width: '200px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search student or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2rem', height: '34px', fontSize: '0.82rem' }}
                />
              </div>

              <select
                className="form-select"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                style={{ height: '34px', fontSize: '0.82rem', width: '150px' }}
              >
                <option value="All">All Subjects</option>
                {SUBJECTS_LIST.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ height: '34px', fontSize: '0.82rem', width: '160px' }}
              >
                <option value="All">All Statuses</option>
                <option value="Sent to Faculty">Sent to Faculty</option>
                <option value="Answered">Answered</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="card-body" style={{ padding: '1rem' }}>
            {filteredQuestions.length === 0 ? (
              <EmptyState
                icon={HelpCircle}
                title="No Questions In Queue"
                description="There are currently no student questions matching your selected filters."
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {filteredQuestions.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQuestion(q)}
                    style={{
                      padding: '1.2rem 1.4rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: q.status === 'Sent to Faculty' ? 'var(--color-soft-sage)' : 'var(--color-card-bg)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.45rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-deep-teal)', background: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                          {q.subject}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                          {q.category}
                        </span>
                        {q.priority === 'High' && (
                          <span style={{ fontSize: '0.7rem', background: 'var(--color-error-bg)', color: 'var(--color-error)', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                            High Priority
                          </span>
                        )}
                        {q.attachments && q.attachments.length > 0 && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-teal)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Paperclip size={11} /> {q.attachments.length} attachment
                          </span>
                        )}
                      </div>

                      <StatusBadge status={q.status} />
                    </div>

                    <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
                      {q.title}
                    </h4>

                    <p style={{
                      fontSize: '0.86rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.45,
                      marginBottom: '0.75rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {q.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '0.65rem', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                      <span>Student: <strong>{q.studentName}</strong> ({q.studentRoll})</span>
                      <span style={{ color: 'var(--color-deep-teal)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MessageSquare size={13} /> {q.replies.length} replies • Click to review & reply <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <QuestionDetailModal
        question={selectedQuestion}
        isOpen={!!selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
      />

      <AppointmentApprovalModal
        appointment={selectedAppointment}
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
};
