import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  GraduationCap,
  HelpCircle,
  Award,
  School,
  LogIn
} from 'lucide-react';

interface LandingPageProps {
  onOpenRoleSwitcher: () => void;
  onOpenAuthModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenRoleSwitcher, onOpenAuthModal }) => {
  const { setActiveTab, currentUser } = useApp();

  const handleGetStarted = () => {
    if (currentUser) {
      if (currentUser.role === 'student') setActiveTab('student-dashboard');
      else if (currentUser.role === 'faculty') setActiveTab('faculty-dashboard');
      else setActiveTab('class-rep-dashboard');
    } else {
      onOpenAuthModal();
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-warm-ivory)' }}>
      {/* Top Navbar */}
      <nav style={{
        background: 'var(--color-card-bg)',
        borderBottom: '1px solid var(--color-border)',
        padding: '1rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-deep-teal)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(40, 94, 89, 0.2)'
          }}>
            <School size={22} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
              CampusConnect
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-secondary-teal)', fontWeight: 600 }}>
              Academic Help & Faculty Connect
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={onOpenRoleSwitcher}
          >
            Demo Accounts
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleGetStarted}
          >
            {currentUser ? `Go to ${currentUser.role === 'student' ? 'Student' : 'Faculty'} Portal` : 'Sign In / Register'} <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '4.5rem 2rem 4rem',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1.15fr 0.85fr',
        gap: '3.5rem',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            background: 'var(--color-soft-sage)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-pill)',
            color: 'var(--color-deep-teal)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={14} color="var(--color-warm-amber)" />
            University Academic Doubts & Faculty Guidance
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '3.2rem',
            fontWeight: 800,
            color: 'var(--color-text-main)',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem'
          }}>
            Your Questions <br />
            <span style={{ color: 'var(--color-deep-teal)' }}>Deserve Answers.</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '2rem',
            maxWidth: '560px'
          }}>
            Bridge the gap between lectures and comprehension. Receive instant academic guidance 
            from curated syllabus knowledge, submit inquiries to faculty, and reserve one-on-one 
            consultation slots without overwhelming professors.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem', marginBottom: '2.5rem' }}>
            <button className="btn btn-primary btn-lg" onClick={handleGetStarted}>
              Enter Student Workspace <ArrowRight size={17} />
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => setActiveTab('instant-ai-help')}>
              <Sparkles size={16} color="var(--color-warm-amber)" /> Try Instant AI Help
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-deep-teal)' }}>
                Instant
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>Knowledge Base Answers</div>
            </div>
            <div style={{ width: 1, height: 35, background: 'var(--color-border)' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-deep-teal)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>Multi-Student Local Auth</div>
            </div>
            <div style={{ width: 1, height: 35, background: 'var(--color-border)' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-deep-teal)' }}>
                Office Hours
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>Conflict-Free Booking</div>
            </div>
          </div>
        </div>

        {/* Hero Interactive Preview Card */}
        <div style={{ position: 'relative' }}>
          <div style={{
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--color-border)',
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-deep-teal)' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-deep-teal)' }}>
                  Live Academic Question Queue
                </span>
              </div>
              <span className="badge badge-instant">Instant Help Active</span>
            </div>

            {/* Mock Question */}
            <div style={{
              background: 'var(--color-soft-sage)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem',
              marginBottom: '1rem',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-deep-teal)' }}>
                  Operating Systems • Aarav Sharma
                </span>
                <span className="badge badge-answered">Answered</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                Race condition in Peterson's Algorithm on Multi-core CPUs
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-main)', background: 'var(--color-card-bg)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <strong>Dr. Meenakshi Sundaram:</strong> Memory barrier instructions flush write buffers to prevent store-load reordering across SMP cores...
              </div>
            </div>

            {/* Mock Consultation */}
            <div style={{
              background: 'var(--color-card-bg)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--color-soft-sage)', color: 'var(--color-deep-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                    Faculty Office Hours Confirmed
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)' }}>
                    Wednesday, 2:00 PM • Block 3 Cabin 402
                  </div>
                </div>
              </div>
              <span className="badge badge-answered">Confirmed</span>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={onOpenRoleSwitcher}
                style={{ fontSize: '0.8rem', width: '100%' }}
              >
                Switch Demo Account (Student / Faculty / CR)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section style={{ padding: '4.5rem 2rem', background: 'var(--color-card-bg)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.3rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
              Comprehensive Academic Help System
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.02rem', maxWidth: '600px', margin: '0 auto' }}>
              Designed specifically for college classrooms, resolving outside-hours doubts reliably.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.6rem' }}>
              <Sparkles size={26} color="var(--color-warm-amber)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.4rem', color: 'var(--color-text-main)' }}>Instant Academic Help</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)' }}>
                Immediate verified explanations from curated course syllabi, recommended textbooks, and suggested follow-ups.
              </p>
            </div>

            <div className="card" style={{ padding: '1.6rem' }}>
              <GraduationCap size={26} color="var(--color-deep-teal)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.4rem', color: 'var(--color-text-main)' }}>Multi-Student Accounts</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)' }}>
                Full registration and authentication experience. Each student maintains private questions and personal profiles.
              </p>
            </div>

            <div className="card" style={{ padding: '1.6rem' }}>
              <Award size={26} color="var(--color-secondary-teal)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.4rem', color: 'var(--color-text-main)' }}>Organized Faculty Queue</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)' }}>
                Review student inquiries by priority, write detailed guidance, and convert repeated queries into class FAQs.
              </p>
            </div>

            <div className="card" style={{ padding: '1.6rem' }}>
              <Calendar size={26} color="var(--color-warm-amber)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.4rem', color: 'var(--color-text-main)' }}>Office Hours & Calendar</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)' }}>
                Predictable office hours with conflict-free slot booking, calendar month views, and cancellation management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        background: 'var(--color-deep-teal)',
        color: '#ffffff',
        padding: '2.5rem 2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
              CampusConnect
            </div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '0.2rem' }}>
              Academic Help & Faculty Connect • College Prototype
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.85)' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('student-dashboard')}>Student Workspace</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('faculty-dashboard')}>Faculty Portal</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('class-rep-dashboard')}>Class Rep Analytics</span>
            <span style={{ cursor: 'pointer' }} onClick={onOpenAuthModal}>Sign In / Register</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
