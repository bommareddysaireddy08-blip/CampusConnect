import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  HelpCircle, 
  ListOrdered, 
  Calendar, 
  FileText, 
  User as UserIcon, 
  Home, 
  BarChart3, 
  Clock, 
  Bell, 
  Sparkles,
  Layers,
  ChevronRight,
  BookOpen,
  School,
  Bookmark
} from 'lucide-react';

interface SidebarProps {
  onOpenRoleSwitcher: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenRoleSwitcher }) => {
  const { role, activeTab, setActiveTab, sidebarOpen, setSidebarOpen, currentUser, questions } = useApp();

  const studentPendingCount = questions.filter(
    (q) => q.studentId === currentUser?.id && (q.status === 'Sent to Faculty' || q.status === 'Submitted' || q.status === 'In Review')
  ).length;

  const facultyPendingCount = questions.filter(
    (q) => (q.status === 'Sent to Faculty' || q.status === 'Submitted' || q.status === 'In Review') && q.sentToFaculty
  ).length;

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const renderNavLinks = () => {
    if (role === 'student') {
      return (
        <>
          <div
            className={`sidebar-link ${activeTab === 'student-dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('student-dashboard')}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </div>

          <div
            className={`sidebar-link ${activeTab === 'instant-ai-help' ? 'active' : ''}`}
            onClick={() => handleNavClick('instant-ai-help')}
          >
            <Sparkles size={18} color="var(--color-warm-amber)" />
            <span>Instant AI Help</span>
          </div>

          <div
            className={`sidebar-link ${activeTab === 'ask-question' ? 'active' : ''}`}
            onClick={() => handleNavClick('ask-question')}
          >
            <HelpCircle size={18} />
            <span>Ask a Doubt</span>
          </div>

          <div
            className={`sidebar-link ${activeTab === 'my-questions' ? 'active' : ''}`}
            onClick={() => handleNavClick('my-questions')}
          >
            <ListOrdered size={18} />
            <span>My Questions</span>
            {studentPendingCount > 0 && <span className="sidebar-badge">{studentPendingCount}</span>}
          </div>

          <div
            className={`sidebar-link ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => handleNavClick('appointments')}
          >
            <Calendar size={18} />
            <span>Faculty Consultations</span>
          </div>

          <div
            className={`sidebar-link ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => handleNavClick('faqs')}
          >
            <FileText size={18} />
            <span>Subject FAQs</span>
          </div>

          <div
            className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavClick('profile')}
          >
            <UserIcon size={18} />
            <span>Profile & Account</span>
          </div>
        </>
      );
    }

    if (role === 'faculty') {
      return (
        <>
          <div
            className={`sidebar-link ${activeTab === 'faculty-dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('faculty-dashboard')}
          >
            <Home size={18} />
            <span>Faculty Overview</span>
          </div>

          <div
            className={`sidebar-link ${activeTab === 'faculty-questions' ? 'active' : ''}`}
            onClick={() => handleNavClick('faculty-questions')}
          >
            <HelpCircle size={18} />
            <span>Student Doubts Queue</span>
            {facultyPendingCount > 0 && <span className="sidebar-badge">{facultyPendingCount}</span>}
          </div>

          <div
            className={`sidebar-link ${activeTab === 'faculty-slots' ? 'active' : ''}`}
            onClick={() => handleNavClick('faculty-slots')}
          >
            <Clock size={18} />
            <span>Office Hours & Slots</span>
          </div>

          <div
            className={`sidebar-link ${activeTab === 'faculty-appointments' ? 'active' : ''}`}
            onClick={() => handleNavClick('faculty-appointments')}
          >
            <Calendar size={18} />
            <span>Consultation Schedule</span>
          </div>

          <div
            className={`sidebar-link ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => handleNavClick('faqs')}
          >
            <FileText size={18} />
            <span>Subject FAQs</span>
          </div>

          <div
            className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavClick('profile')}
          >
            <UserIcon size={18} />
            <span>Profile & Account</span>
          </div>
        </>
      );
    }

    // Class Rep
    return (
      <>
        <div
          className={`sidebar-link ${activeTab === 'class-rep-dashboard' ? 'active' : ''}`}
          onClick={() => handleNavClick('class-rep-dashboard')}
        >
          <BarChart3 size={18} />
          <span>Academic Analytics</span>
        </div>

        <div
          className={`sidebar-link ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => handleNavClick('announcements')}
        >
          <Bell size={18} />
          <span>Class Announcements</span>
        </div>

        <div
          className={`sidebar-link ${activeTab === 'faqs' ? 'active' : ''}`}
          onClick={() => handleNavClick('faqs')}
        >
          <FileText size={18} />
          <span>Subject FAQs</span>
        </div>

        <div
          className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleNavClick('profile')}
        >
          <UserIcon size={18} />
          <span>Profile & Account</span>
        </div>
      </>
    );
  };

  return (
    <>
      <div 
        className={`mobile-overlay ${sidebarOpen ? 'active' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo-icon">
              <School size={22} color="var(--color-deep-teal)" />
            </div>
            <div>
              <div className="sidebar-brand-name">CampusConnect</div>
              <div className="sidebar-brand-sub">Academic Help Platform</div>
            </div>
          </div>
        </div>

        <div className="sidebar-nav">
          <div style={{ 
            fontSize: '0.72rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            color: 'rgba(255, 255, 255, 0.55)', 
            padding: '0.5rem 0.8rem 0.2rem',
            fontWeight: 700
          }}>
            {role === 'student' ? 'Student Workspace' : role === 'faculty' ? 'Faculty Portal' : 'Class Rep Portal'}
          </div>

          {renderNavLinks()}

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
            <div
              className={`sidebar-link ${activeTab === 'landing' ? 'active' : ''}`}
              onClick={() => handleNavClick('landing')}
              style={{ color: 'var(--color-warm-amber)' }}
            >
              <Layers size={18} />
              <span>Landing Page</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div 
            className="user-nav-card"
            onClick={onOpenRoleSwitcher}
            title="Click to switch persona role"
          >
            <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
              <img 
                src={currentUser?.avatar} 
                alt={currentUser?.name} 
                className="user-nav-avatar"
              />
              <div className="user-nav-info">
                <span className="user-nav-name">{currentUser?.name || 'Guest User'}</span>
                <span className="user-nav-role">
                  {role === 'student' ? 'Student' : role === 'faculty' ? 'Faculty Professor' : 'Class Rep'}
                </span>
              </div>
            </div>
            <ChevronRight size={16} color="var(--color-warm-amber)" />
          </div>
        </div>
      </aside>
    </>
  );
};
