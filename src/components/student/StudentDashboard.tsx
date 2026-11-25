import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Plus, 
  FileText, 
  Sparkles, 
  ArrowRight,
  User,
  Bell,
  MapPin,
  BookOpen,
  Bookmark
} from 'lucide-react';

interface StudentDashboardProps {
  onOpenAskModal: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onOpenAskModal }) => {
  const { currentUser, questions, appointments, announcements, setActiveTab } = useApp();

  const studentQuestions = questions.filter((q) => q.studentId === currentUser?.id);
  const totalQuestions = studentQuestions.length;
  const pendingQuestions = studentQuestions.filter(
    (q) => q.status === 'Sent to Faculty' || q.status === 'Submitted' || q.status === 'In Review'
  ).length;
  const resolvedQuestions = studentQuestions.filter(
    (q) => q.status === 'Answered' || q.status === 'Resolved' || q.status === 'Meeting Suggested'
  ).length;

  const upcomingAppointments = appointments.filter(
    (a) => a.studentId === currentUser?.id && a.status !== 'Cancelled' && a.status !== 'Rejected'
  );

  const recentQuestions = studentQuestions.slice(0, 3);
  const nextAppointment = upcomingAppointments[0];

  const recommendedResources = [
    { title: 'Operating Systems Concepts (Silberschatz - 10th Ed)', subject: 'Operating Systems', type: 'Textbook' },
    { title: 'MIT 6.006 Introduction to Algorithms Video Lectures', subject: 'Algorithms', type: 'Lecture Notes' },
    { title: 'PostgreSQL 16 Documentation: Schema Normalization & Indexes', subject: 'Database Systems', type: 'Documentation' }
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-deep-teal) 0%, #1e4b47 100%)',
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
            <Sparkles size={14} /> P09 Academic Help Platform
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', color: '#ffffff', marginBottom: '0.4rem' }}>
            Welcome back, {currentUser?.name || 'Student'}!
          </h2>
          <p style={{ color: 'var(--color-soft-sage)', fontSize: '0.92rem', maxWidth: '580px' }}>
            {currentUser?.department || 'Computer Science'} • Roll: {currentUser?.identifier || 'Student'}. 
            Resolve lecture doubts immediately, consult professors, and book verified office hours.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <button className="btn btn-amber" onClick={() => setActiveTab('instant-ai-help')}>
            <Sparkles size={16} /> Instant AI Help
          </button>
          <button className="btn btn-primary" onClick={onOpenAskModal} style={{ background: '#ffffff', color: 'var(--color-deep-teal)' }}>
            <Plus size={16} /> Ask Question
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card teal">
          <div className="stat-info">
            <span className="stat-label">Total Doubts Asked</span>
            <span className="stat-value">{totalQuestions}</span>
            <span className="stat-subtext">Across this semester</span>
          </div>
          <div className="stat-icon-wrapper teal">
            <HelpCircle size={22} />
          </div>
        </div>

        <div className="stat-card amber">
          <div className="stat-info">
            <span className="stat-label">Pending Faculty Review</span>
            <span className="stat-value">{pendingQuestions}</span>
            <span className="stat-subtext">In faculty queue</span>
          </div>
          <div className="stat-icon-wrapper amber">
            <Clock size={22} />
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-info">
            <span className="stat-label">Resolved Concepts</span>
            <span className="stat-value">{resolvedQuestions}</span>
            <span className="stat-subtext">With verified answers</span>
          </div>
          <div className="stat-icon-wrapper success">
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="stat-card teal">
          <div className="stat-info">
            <span className="stat-label">Upcoming Consultations</span>
            <span className="stat-value">{upcomingAppointments.length}</span>
            <span className="stat-subtext">Confirmed office visits</span>
          </div>
          <div className="stat-icon-wrapper teal">
            <Calendar size={22} />
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.75rem', alignItems: 'start' }}>
        {/* Left: Recent Doubts */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <HelpCircle size={18} color="var(--color-deep-teal)" />
              <h4 className="card-title">Recent Academic Doubts</h4>
            </div>
            <button
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem' }}
              onClick={() => setActiveTab('my-questions')}
            >
              View All ({studentQuestions.length}) <ArrowRight size={13} />
            </button>
          </div>

          <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
            {recentQuestions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <HelpCircle size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 0.6rem' }} />
                <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>No questions asked yet</div>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                  Got a doubt during today's lectures? Click below for immediate help.
                </p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: '0.8rem' }} onClick={onOpenAskModal}>
                  Ask a Question
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {recentQuestions.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => setActiveTab('my-questions')}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-card-bg)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-deep-teal)' }}>
                        {q.subject}
                      </span>
                      <StatusBadge status={q.status} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                      {q.title}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--color-text-secondary)' }}>
                      <span>Faculty: <strong>{q.facultyName}</strong></span>
                      <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Next Appointment & Recommended Resources */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Next Consultation */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Calendar size={18} color="var(--color-deep-teal)" />
                <h4 className="card-title">Next Faculty Consultation</h4>
              </div>
            </div>
            <div className="card-body">
              {nextAppointment ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className="badge badge-answered">Confirmed Session</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                      {nextAppointment.date}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', marginBottom: '0.3rem' }}>
                    {nextAppointment.facultyName}
                  </h4>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-deep-teal)', fontWeight: 600, marginBottom: '0.6rem' }}>
                    {nextAppointment.subject}
                  </div>
                  <div style={{ background: 'var(--color-soft-sage)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                      <Clock size={13} /> {nextAppointment.timeSlot}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} /> {nextAppointment.location}
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => setActiveTab('appointments')}>
                    View Consultation Schedule
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <Calendar size={28} color="var(--color-text-muted)" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                    No upcoming consultations
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                    Schedule one-on-one time with your professor during office hours.
                  </p>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: '0.8rem' }} onClick={() => setActiveTab('appointments')}>
                    Browse Available Slots
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Learning Resources */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <BookOpen size={18} color="var(--color-secondary-teal)" />
                <h4 className="card-title">Curriculum Study Resources</h4>
              </div>
            </div>
            <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {recommendedResources.map((res, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.65rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-warm-ivory)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-deep-teal)' }}>
                        {res.subject}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                        {res.type}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--color-text-main)', marginTop: '0.2rem' }}>
                      {res.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
