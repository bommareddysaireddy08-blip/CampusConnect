import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Bell, UserCheck, ArrowRightLeft, Moon, Sun, LogIn, LogOut } from 'lucide-react';

interface HeaderProps {
  onOpenRoleSwitcher: () => void;
  onOpenNotifications: () => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenRoleSwitcher, 
  onOpenNotifications,
  onOpenAuthModal 
}) => {
  const { 
    activeTab, 
    role, 
    currentUser, 
    unreadNotifCount, 
    setSidebarOpen,
    themeMode,
    toggleThemeMode,
    logoutUser
  } = useApp();

  const getPageTitleAndSub = () => {
    switch (activeTab) {
      case 'student-dashboard':
        return {
          title: 'Student Dashboard',
          sub: `Welcome back, ${currentUser?.name || 'Student'} • ${currentUser?.identifier || ''}`
        };
      case 'instant-ai-help':
        return {
          title: 'Instant Academic Help Assistant',
          sub: 'Search verified course knowledge base and ask follow-up questions'
        };
      case 'ask-question':
        return {
          title: 'Ask an Academic Doubt',
          sub: 'Submit doubts directly to course professors'
        };
      case 'my-questions':
        return {
          title: 'My Academic Doubts',
          sub: 'Live responses, follow-up threads, and resolution statuses'
        };
      case 'appointments':
        return {
          title: 'Faculty Consultations',
          sub: 'Reserve one-on-one academic consultation slots during office hours'
        };
      case 'faculty-dashboard':
        return {
          title: 'Faculty Academic Portal',
          sub: `${currentUser?.name || 'Professor'} • ${currentUser?.department || ''}`
        };
      case 'faculty-questions':
        return {
          title: 'Student Questions & Doubts Queue',
          sub: 'Review, answer, and organize curriculum inquiries'
        };
      case 'faculty-slots':
        return {
          title: 'Office Hours & Time Slots',
          sub: 'Configure recurring consultation availability'
        };
      case 'faculty-appointments':
        return {
          title: 'Consultation Schedule & Bookings',
          sub: 'Approve, reject, or manage student consultation meetings'
        };
      case 'class-rep-dashboard':
        return {
          title: 'Class Representative Analytics',
          sub: 'Aggregated question statistics & difficulty hotspots'
        };
      case 'announcements':
        return {
          title: 'Class Notice Board',
          sub: 'Academic updates, exam alerts & notice broadcasts'
        };
      case 'faqs':
        return {
          title: 'Subject Knowledge Base & FAQs',
          sub: 'Verified explanations curated from repeated classroom doubts'
        };
      case 'profile':
        return {
          title: 'Account & Profile Settings',
          sub: 'Edit profile information, change password, and manage preferences'
        };
      default:
        return {
          title: 'CampusConnect',
          sub: 'Academic Help & Faculty Connect'
        };
    }
  };

  const { title, sub } = getPageTitleAndSub();

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          className="header-action-btn"
          onClick={() => setSidebarOpen(true)}
          style={{ display: 'none' }}
          id="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>

        <div className="header-title-container">
          <h2 className="header-page-title">{title}</h2>
          <span className="header-page-sub">{sub}</span>
        </div>
      </div>

      <div className="header-right">
        {/* Theme mode toggle */}
        <button
          className="header-action-btn"
          onClick={toggleThemeMode}
          title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {themeMode === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Demo Switcher */}
        <button
          className="btn btn-outline btn-sm"
          onClick={onOpenRoleSwitcher}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'var(--color-soft-sage)',
            borderColor: 'var(--color-border)',
            fontSize: '0.8rem'
          }}
          title="Switch Demo Persona"
        >
          <UserCheck size={14} color="var(--color-deep-teal)" />
          <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
            {currentUser?.name ? currentUser.name.split(' ')[0] : 'Guest'} ({role === 'student' ? 'Student' : role === 'faculty' ? 'Faculty' : 'CR'})
          </span>
          <ArrowRightLeft size={12} color="var(--color-text-secondary)" />
        </button>

        {/* Notifications Button */}
        <button
          className="header-action-btn"
          onClick={onOpenNotifications}
          title="Notifications"
        >
          <Bell size={17} />
          {unreadNotifCount > 0 && <span className="header-notif-dot" />}
        </button>

        {/* Auth Button */}
        {currentUser ? (
          <button
            className="btn btn-outline btn-sm"
            onClick={logoutUser}
            title="Sign Out"
            style={{ fontSize: '0.8rem' }}
          >
            <LogOut size={13} />
          </button>
        ) : (
          <button
            className="btn btn-primary btn-sm"
            onClick={onOpenAuthModal}
            style={{ fontSize: '0.8rem' }}
          >
            <LogIn size={13} /> Sign In
          </button>
        )}
      </div>

      <style>{`
        @media (max-width: 992px) {
          #mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
