import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/Toast';
import { RoleSwitcherModal } from './components/shared/RoleSwitcherModal';
import { NotificationsDrawer } from './components/shared/NotificationsDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { InstantAIHelpView } from './components/student/InstantAIHelpView';
import { AskQuestionModal } from './components/student/AskQuestionModal';
import { MyQuestionsView } from './components/student/MyQuestionsView';
import { AppointmentsView } from './components/student/AppointmentsView';
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { OfficeHoursManager } from './components/faculty/OfficeHoursManager';
import { ClassRepDashboard } from './components/classrep/ClassRepDashboard';
import { FAQSection } from './components/shared/FAQSection';
import { ProfileView } from './components/shared/ProfileView';

export const MainApp: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // If user is on landing page, display full landing layout
  if (activeTab === 'landing') {
    return (
      <>
        <LandingPage
          onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
        <RoleSwitcherModal
          isOpen={isRoleSwitcherOpen}
          onClose={() => setIsRoleSwitcherOpen(false)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
        <ToastContainer />
      </>
    );
  }

  // Render dashboard page content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      // Student Tabs
      case 'student-dashboard':
        return <StudentDashboard onOpenAskModal={() => setIsAskModalOpen(true)} />;
      case 'instant-ai-help':
        return <InstantAIHelpView />;
      case 'ask-question':
        return <MyQuestionsView onOpenAskModal={() => setIsAskModalOpen(true)} />;
      case 'my-questions':
        return <MyQuestionsView onOpenAskModal={() => setIsAskModalOpen(true)} />;
      case 'appointments':
        return <AppointmentsView />;

      // Faculty Tabs
      case 'faculty-dashboard':
        return <FacultyDashboard viewMode="overview" />;
      case 'faculty-questions':
        return <FacultyDashboard viewMode="questions" />;
      case 'faculty-slots':
        return <OfficeHoursManager />;
      case 'faculty-appointments':
        return <FacultyDashboard viewMode="appointments" />;

      // Class Rep Tabs
      case 'class-rep-dashboard':
      case 'announcements':
        return <ClassRepDashboard />;

      // Shared Tabs
      case 'faqs':
        return <FAQSection onOpenAskModal={() => setIsAskModalOpen(true)} />;
      case 'profile':
        return <ProfileView onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)} />;

      default:
        return <StudentDashboard onOpenAskModal={() => setIsAskModalOpen(true)} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Deep Teal Sidebar */}
      <Sidebar onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)} />

      {/* Main Content Viewport */}
      <div className="main-content">
        {/* Top Header */}
        <Header
          onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* Dynamic Page Container */}
        <main className="page-container">
          {renderContent()}
        </main>
      </div>

      {/* Global Modals */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <AskQuestionModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
      />

      {/* Toast System */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return <MainApp />;
}
