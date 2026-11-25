import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreateAnnouncementModal } from './CreateAnnouncementModal';
import { SUBJECTS_LIST } from '../../services/storage.ts';
import { 
  BarChart3, 
  Users, 
  Bell, 
  Plus, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  HelpCircle,
  CheckCircle
} from 'lucide-react';

export const ClassRepDashboard: React.FC = () => {
  const { questions, announcements, currentUser } = useApp();
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

  // Compute aggregated stats
  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q) => q.status === 'Answered' || q.status === 'Resolved' || q.status === 'Meeting Suggested').length;
  const repeatedDoubts = questions.filter((q) => q.isRepeatedDoubt);

  // Subject-wise question breakdown
  const subjectStats = SUBJECTS_LIST.map((subj) => {
    const subjQuestions = questions.filter((q) => q.subject === subj);
    const resolved = subjQuestions.filter((q) => q.status === 'Answered' || q.status === 'Resolved' || q.status === 'Meeting Suggested').length;
    return {
      subject: subj,
      total: subjQuestions.length,
      resolved,
      pending: subjQuestions.length - resolved,
      percentage: totalQuestions > 0 ? Math.round((subjQuestions.length / totalQuestions) * 100) : 0
    };
  }).filter((s) => s.total > 0);

  // Topic hotspots
  const commonHotspots = [
    { topic: 'Process Synchronization & Memory Barriers', subject: 'Operating Systems', doubts: 14, severity: 'High' },
    { topic: 'BCNF vs 3NF Multi-table Dependency Loss', subject: 'Database Management Systems', doubts: 11, severity: 'Medium' },
    { topic: 'Inverse Ackermann Amortized Proofs in DSU', subject: 'Data Structures & Algorithms', doubts: 9, severity: 'Medium' },
    { topic: 'TCP 3-Way Handshake SYN Cookie Security', subject: 'Computer Networks', doubts: 6, severity: 'Low' }
  ];

  return (
    <div>
      {/* Top Banner */}
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
            <Users size={14} /> Class Representative Academic Intelligence
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', color: '#ffffff', marginBottom: '0.4rem' }}>
            {currentUser?.name || 'Class Representative'}
          </h2>
          <p style={{ color: 'var(--color-soft-sage)', fontSize: '0.92rem', maxWidth: '640px' }}>
            {currentUser?.department || 'Academic Section'}. Aggregated student doubt statistics, 
            curriculum difficulty hotspots, and official class broadcast notices while maintaining strict student privacy.
          </p>
        </div>

        <button className="btn btn-amber" onClick={() => setIsAnnouncementModalOpen(true)}>
          <Plus size={16} /> Broadcast Class Notice
        </button>
      </div>

      {/* Privacy Guarantee Panel */}
      <div className="info-panel">
        <ShieldCheck className="info-panel-icon" size={20} color="var(--color-success)" />
        <div className="info-panel-content">
          <div className="info-panel-title">Privacy-Preserving Aggregated Analytics Active</div>
          <div className="info-panel-text">
            Per academic integrity policies, Class Representatives only access aggregated volume indicators and anonymized 
            topic difficulty trends. Individual student identities and private correspondence remain strictly confidential.
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card teal">
          <div className="stat-info">
            <span className="stat-label">Total Class Doubts</span>
            <span className="stat-value">{totalQuestions}</span>
            <span className="stat-subtext">Aggregated across batch</span>
          </div>
          <div className="stat-icon-wrapper teal">
            <HelpCircle size={22} />
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-info">
            <span className="stat-label">Resolution Rate</span>
            <span className="stat-value">
              {totalQuestions > 0 ? `${Math.round((answeredCount / totalQuestions) * 100)}%` : '0%'}
            </span>
            <span className="stat-subtext">{answeredCount} answered by faculty</span>
          </div>
          <div className="stat-icon-wrapper success">
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="stat-card amber">
          <div className="stat-info">
            <span className="stat-label">Repeated Query Alerts</span>
            <span className="stat-value">{repeatedDoubts.length}</span>
            <span className="stat-subtext">Needs classroom review</span>
          </div>
          <div className="stat-icon-wrapper amber">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="stat-card teal">
          <div className="stat-info">
            <span className="stat-label">Active Announcements</span>
            <span className="stat-value">{announcements.length}</span>
            <span className="stat-subtext">Notices published</span>
          </div>
          <div className="stat-icon-wrapper teal">
            <Bell size={22} />
          </div>
        </div>
      </div>

      {/* Main Grid: Subject Breakdown & Difficulty Hotspots */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '1.75rem', marginBottom: '2.5rem' }}>
        {/* Subject-wise Bar Distribution */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BarChart3 size={18} color="var(--color-deep-teal)" />
              <h4 className="card-title">Subject-wise Doubt Volume Distribution</h4>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
              Current Semester
            </span>
          </div>

          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
              {subjectStats.map((item) => (
                <div key={item.subject}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                      {item.subject}
                    </span>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>
                      <strong>{item.total} doubts</strong> ({item.resolved} resolved • {item.pending} pending)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    width: '100%',
                    height: '10px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--color-soft-sage)',
                    overflow: 'hidden',
                    display: 'flex'
                  }}>
                    <div
                      style={{
                        width: `${item.percentage}%`,
                        background: 'linear-gradient(90deg, var(--color-secondary-teal), var(--color-deep-teal))',
                        borderRadius: 'var(--radius-pill)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.75rem', padding: '1rem', background: 'var(--color-soft-sage)', borderRadius: 'var(--radius-md)', fontSize: '0.84rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Sparkles size={16} color="var(--color-deep-teal)" />
              <span>
                <strong>CR Action Item:</strong> Operating Systems represents the highest concentration of doubts. 
                Consider requesting a dedicated tutorial before Mid-Term 2.
              </span>
            </div>
          </div>
        </div>

        {/* Academic Difficulty Hotspots */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <TrendingUp size={18} color="var(--color-warm-amber)" />
              <h4 className="card-title">Frequently Repeated Trouble Spots</h4>
            </div>
          </div>

          <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {commonHotspots.map((h, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-card-bg)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-deep-teal)' }}>
                      {h.subject}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-pill)',
                        background: h.severity === 'High' ? 'var(--color-error-bg)' : 'var(--color-warning-bg)',
                        color: h.severity === 'High' ? 'var(--color-error)' : 'var(--color-warning)'
                      }}
                    >
                      {h.severity} Priority ({h.doubts} students)
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                    {h.topic}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Class Notice Board Section */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bell size={18} color="var(--color-deep-teal)" />
            <h4 className="card-title">Classroom Notice Board & Announcements</h4>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setIsAnnouncementModalOpen(true)}>
            <Plus size={14} /> New Announcement
          </button>
        </div>

        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {announcements.map((ann) => (
              <div
                key={ann.id}
                style={{
                  border: ann.isUrgent ? '1.5px solid var(--color-warm-amber)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  background: ann.isUrgent ? 'var(--color-warm-amber-light)' : 'var(--color-card-bg)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-deep-teal)' }}>
                    {ann.subject}
                  </span>
                  {ann.isUrgent && (
                    <span style={{ fontSize: '0.7rem', background: 'var(--color-error-bg)', color: 'var(--color-error)', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                      Urgent Notice
                    </span>
                  )}
                </div>

                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
                  {ann.title}
                </h4>

                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {ann.content}
                </p>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                  <span>Posted by: <strong>{ann.authorName}</strong></span>
                  <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CreateAnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
      />
    </div>
  );
};
