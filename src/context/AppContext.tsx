import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Role, 
  User, 
  Question, 
  QuestionStatus, 
  Appointment, 
  AppointmentSlot, 
  AppointmentStatus,
  FAQItem, 
  Announcement, 
  Notification,
  Attachment
} from '../types/index.ts';
import { CampusStorage, DEFAULT_USERS, hashPassword } from '../services/storage.ts';
import { searchInstantAcademicHelp } from '../services/aiHelp.ts';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface AppContextType {
  currentUser: User | null;
  role: Role;
  users: User[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  questions: Question[];
  appointments: Appointment[];
  slots: AppointmentSlot[];
  faqs: FAQItem[];
  announcements: Announcement[];
  notifications: Notification[];
  unreadNotifCount: number;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  dismissToast: (id: string) => void;
  themeMode: 'light' | 'dark';
  toggleThemeMode: () => void;

  // Authentication & Profile
  loginUser: (email: string, pass: string) => { success: boolean; message: string };
  registerStudent: (data: {
    name: string;
    email: string;
    identifier: string;
    department: string;
    yearOfStudy: string;
    password: string;
  }) => { success: boolean; message: string };
  logoutUser: () => void;
  switchDemoUser: (userId: string) => void;
  updateUserProfile: (data: {
    name: string;
    department: string;
    yearOfStudy?: string;
    avatar?: string;
  }) => boolean;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  resetPasswordRequest: (email: string) => { success: boolean; message: string };
  toggleBookmark: (questionId: string) => void;

  // Question Management & Instant AI Help
  submitQuestion: (data: {
    facultyId: string;
    facultyName: string;
    subject: string;
    title: string;
    description: string;
    category: any;
    attachments?: Attachment[];
    priority?: 'High' | 'Medium' | 'Normal';
    sendDirectlyToFaculty?: boolean;
  }) => { success: boolean; questionId: string; instantAnswerFound: boolean };
  
  sendQuestionToFaculty: (questionId: string) => void;
  replyToQuestion: (
    questionId: string, 
    content: string, 
    newStatus?: QuestionStatus, 
    suggestMeeting?: boolean, 
    meetingNote?: string
  ) => void;
  addFollowUpReply: (questionId: string, content: string) => void;
  markQuestionResolved: (questionId: string) => void;
  rateAnswerHelpful: (questionId: string, isInstantHelp: boolean) => void;
  markRepeatedDoubt: (questionId: string, isRepeated: boolean) => void;
  createFaq: (data: {
    subject: string;
    category: string;
    question: string;
    answer: string;
  }) => void;

  // Appointments
  bookAppointment: (data: {
    facultyId: string;
    facultyName: string;
    date: string;
    timeSlot: string;
    subject: string;
    purpose: string;
    location: string;
  }) => { success: boolean; message: string };
  cancelAppointment: (appointmentId: string) => void;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus, feedback?: string) => void;
  createAppointmentSlot: (slot: Omit<AppointmentSlot, 'id'>) => void;

  // Announcements & Notifications
  createAnnouncement: (title: string, content: string, subject?: string, isUrgent?: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Reset
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => CampusStorage.getUsers());
  const [currentUser, setCurrentUser] = useState<User | null>(() => CampusStorage.getActiveUser());
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [questions, setQuestions] = useState<Question[]>(() => CampusStorage.getQuestions());
  const [appointments, setAppointments] = useState<Appointment[]>(() => CampusStorage.getAppointments());
  const [slots, setSlots] = useState<AppointmentSlot[]>(() => CampusStorage.getAppointmentSlots());
  const [faqs, setFaqs] = useState<FAQItem[]>(() => CampusStorage.getFAQs());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => CampusStorage.getAnnouncements());
  const [notifications, setNotifications] = useState<Notification[]>(() => CampusStorage.getNotifications());
  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>(() => CampusStorage.getThemeMode());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const role: Role = currentUser?.role || 'student';

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    CampusStorage.setThemeMode(themeMode);
  }, [themeMode]);

  const toggleThemeMode = () => {
    setThemeModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sync state to LocalStorage
  useEffect(() => {
    CampusStorage.setUsers(users);
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      CampusStorage.setActiveUserId(currentUser.id);
    } else {
      CampusStorage.clearActiveSession();
    }
  }, [currentUser]);

  useEffect(() => {
    CampusStorage.setQuestions(questions);
  }, [questions]);

  useEffect(() => {
    CampusStorage.setAppointments(appointments);
  }, [appointments]);

  useEffect(() => {
    CampusStorage.setAppointmentSlots(slots);
  }, [slots]);

  useEffect(() => {
    CampusStorage.setFAQs(faqs);
  }, [faqs]);

  useEffect(() => {
    CampusStorage.setAnnouncements(announcements);
  }, [announcements]);

  useEffect(() => {
    CampusStorage.setNotifications(notifications);
  }, [notifications]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Authentication ---
  const loginUser = (email: string, pass: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      showToast('No registered account found with this email.', 'error');
      return { success: false, message: 'Invalid email or password.' };
    }

    const hashed = hashPassword(pass);
    if (found.passwordHash && found.passwordHash !== hashed) {
      showToast('Incorrect password entered.', 'error');
      return { success: false, message: 'Incorrect password entered.' };
    }

    setCurrentUser(found);
    showToast(`Welcome back, ${found.name}!`, 'success');

    if (found.role === 'student') setActiveTab('student-dashboard');
    else if (found.role === 'faculty') setActiveTab('faculty-dashboard');
    else if (found.role === 'class_rep') setActiveTab('class-rep-dashboard');

    return { success: true, message: 'Login successful.' };
  };

  const registerStudent = (data: {
    name: string;
    email: string;
    identifier: string;
    department: string;
    yearOfStudy: string;
    password: string;
  }): { success: boolean; message: string } => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      showToast('An account with this email address already exists.', 'error');
      return { success: false, message: 'Email address already registered.' };
    }

    if (users.some((u) => u.identifier.toLowerCase() === data.identifier.trim().toLowerCase())) {
      showToast('A student with this Roll Number is already registered.', 'error');
      return { success: false, message: 'Student Roll Number already registered.' };
    }

    const newUser: User = {
      id: `user-std-${Date.now()}`,
      name: data.name.trim(),
      role: 'student',
      email: cleanEmail,
      department: data.department,
      yearOfStudy: data.yearOfStudy,
      identifier: data.identifier.trim(),
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 90000000000)}?auto=format&fit=crop&w=150&q=80`,
      passwordHash: hashPassword(data.password),
      bookmarks: [],
      createdAt: new Date().toISOString()
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Account created successfully! Welcome to CampusConnect, ${newUser.name}.`, 'success');
    setActiveTab('student-dashboard');
    return { success: true, message: 'Registration successful.' };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setActiveTab('landing');
    showToast('You have been logged out safely.', 'info');
  };

  const switchDemoUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      showToast(`Switched active user to ${target.name} (${target.role.toUpperCase()})`, 'info');
      if (target.role === 'student') setActiveTab('student-dashboard');
      else if (target.role === 'faculty') setActiveTab('faculty-dashboard');
      else if (target.role === 'class_rep') setActiveTab('class-rep-dashboard');
    }
  };

  const updateUserProfile = (data: {
    name: string;
    department: string;
    yearOfStudy?: string;
    avatar?: string;
  }): boolean => {
    if (!currentUser) return false;
    const newName = data.name.trim();
    if (!newName) {
      showToast('Name cannot be empty.', 'error');
      return false;
    }

    const updatedUser: User = {
      ...currentUser,
      name: newName,
      department: data.department,
      yearOfStudy: data.yearOfStudy || currentUser.yearOfStudy,
      avatar: data.avatar?.trim() || currentUser.avatar
    };

    // Update in users table
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);

    // Cascade name update across questions and replies authored by this user
    setQuestions((prev) =>
      prev.map((q) => {
        let modified = false;
        let qCopy = { ...q };
        if (q.studentId === currentUser.id) {
          qCopy.studentName = newName;
          modified = true;
        }
        if (q.facultyId === currentUser.id) {
          qCopy.facultyName = newName;
          modified = true;
        }
        const updatedReplies = qCopy.replies.map((rep) => {
          if (rep.authorId === currentUser.id) {
            return { ...rep, authorName: newName };
          }
          return rep;
        });
        qCopy.replies = updatedReplies;
        return qCopy;
      })
    );

    showToast('Profile updated! Your new name is now reflected everywhere.', 'success');
    return true;
  };

  const changePassword = (oldPass: string, newPass: string): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'No active session.' };
    if (currentUser.passwordHash && currentUser.passwordHash !== hashPassword(oldPass)) {
      showToast('Old password is incorrect.', 'error');
      return { success: false, message: 'Old password is incorrect.' };
    }
    if (newPass.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return { success: false, message: 'Password too short.' };
    }

    const newHash = hashPassword(newPass);
    const updated = { ...currentUser, passwordHash: newHash };
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    setCurrentUser(updated);
    showToast('Password changed successfully.', 'success');
    return { success: true, message: 'Password updated.' };
  };

  const resetPasswordRequest = (email: string): { success: boolean; message: string } => {
    const clean = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === clean);
    if (!found) {
      return { success: false, message: 'No account found with this email.' };
    }
    // Simulation
    const tempPass = 'Reset@2026';
    const newHash = hashPassword(tempPass);
    setUsers((prev) => prev.map((u) => (u.id === found.id ? { ...u, passwordHash: newHash } : u)));
    showToast(`Password reset simulation: Temporary password set to "${tempPass}"`, 'info');
    return { success: true, message: `A reset password has been configured: ${tempPass}` };
  };

  const toggleBookmark = (questionId: string) => {
    if (!currentUser) return;
    const currentBookmarks = currentUser.bookmarks || [];
    const isBookmarked = currentBookmarks.includes(questionId);
    const updatedBookmarks = isBookmarked
      ? currentBookmarks.filter((id) => id !== questionId)
      : [...currentBookmarks, questionId];

    const updatedUser = { ...currentUser, bookmarks: updatedBookmarks };
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    showToast(isBookmarked ? 'Removed from bookmarks.' : 'Saved to bookmarks.', 'info');
  };

  // --- Question & Instant Academic Help System ---
  const submitQuestion = (data: {
    facultyId: string;
    facultyName: string;
    subject: string;
    title: string;
    description: string;
    category: any;
    attachments?: Attachment[];
    priority?: 'High' | 'Medium' | 'Normal';
    sendDirectlyToFaculty?: boolean;
  }): { success: boolean; questionId: string; instantAnswerFound: boolean } => {
    if (!currentUser) {
      showToast('Please log in to submit questions.', 'error');
      return { success: false, questionId: '', instantAnswerFound: false };
    }

    if (!data.title.trim() || !data.description.trim() || !data.subject) {
      showToast('Please fill in all required question details.', 'error');
      return { success: false, questionId: '', instantAnswerFound: false };
    }

    // Run Instant Academic Help search immediately!
    const query = `${data.title} ${data.description}`;
    const instantResult = searchInstantAcademicHelp(query, data.subject, faqs);
    const instantAnswerFound = instantResult.confidence !== 'none';

    const qId = `q-${Date.now()}`;
    const willSendToFaculty = data.sendDirectlyToFaculty !== false;

    // If forwarded to faculty, mark as 'Sent to Faculty' so it immediately shows in Faculty Pending Queue
    const initialStatus: QuestionStatus = willSendToFaculty ? 'Sent to Faculty' : (instantAnswerFound ? 'Instant Help Available' : 'Sent to Faculty');

    const newQuestion: Question = {
      id: qId,
      studentId: currentUser.id,
      studentName: currentUser.name, // Actual logged-in student name
      studentRoll: currentUser.identifier,
      facultyId: data.facultyId,
      facultyName: data.facultyName,
      subject: data.subject,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      status: initialStatus,
      sentToFaculty: willSendToFaculty,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
      attachments: data.attachments || [],
      instantHelp: instantResult,
      tags: [data.category, data.subject],
      helpfulVotes: 0,
      priority: data.priority || 'Normal'
    };

    const updatedQuestions = [newQuestion, ...questions];
    setQuestions(updatedQuestions);
    CampusStorage.setQuestions(updatedQuestions);

    // Send notification to faculty if forwarded
    if (willSendToFaculty) {
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: data.facultyId,
        targetRole: 'faculty',
        title: 'New Student Academic Doubt',
        message: `${currentUser.name} (${currentUser.identifier}) asked: "${newQuestion.title.substring(0, 45)}..."`,
        timestamp: new Date().toISOString(),
        read: false,
        linkTab: 'faculty-questions',
        actionId: newQuestion.id
      };
      const updatedNotifs = [notif, ...notifications];
      setNotifications(updatedNotifs);
      CampusStorage.setNotifications(updatedNotifs);
    }

    if (instantAnswerFound) {
      showToast('Instant Academic Help matched your doubt! Check the explanation.', 'success');
    } else {
      showToast('Doubt submitted to faculty. You will be notified when answered.', 'info');
    }

    return { success: true, questionId: qId, instantAnswerFound };
  };

  const sendQuestionToFaculty = (questionId: string) => {
    const q = questions.find((item) => item.id === questionId);
    if (!q) return;

    setQuestions((prev) =>
      prev.map((item) =>
        item.id === questionId
          ? { ...item, sentToFaculty: true, status: item.status === 'Instant Help Available' ? 'Sent to Faculty' : item.status, updatedAt: new Date().toISOString() }
          : item
      )
    );

    // Notify assigned faculty
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: q.facultyId,
      targetRole: 'faculty',
      title: 'Student Forwarded Doubt for Clarification',
      message: `${q.studentName} requested faculty clarification on: "${q.title.substring(0, 40)}..."`,
      timestamp: new Date().toISOString(),
      read: false,
      linkTab: 'faculty-questions',
      actionId: q.id
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast('Question has been forwarded to faculty for detailed guidance.', 'success');
  };

  const replyToQuestion = (
    questionId: string, 
    content: string, 
    newStatus: QuestionStatus = 'Answered', 
    suggestMeeting: boolean = false, 
    meetingNote: string = ''
  ) => {
    if (!currentUser) return;
    if (!content.trim()) {
      showToast('Reply message cannot be empty.', 'error');
      return;
    }

    const reply = {
      id: `rep-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      suggestOfficeMeeting: suggestMeeting,
      meetingNote: meetingNote.trim() || undefined,
      isHelpfulCount: 0
    };

    // Make sure newStatus is 'Answered' if previous status was 'Sent to Faculty' or 'Pending'
    const targetStatus: QuestionStatus = (newStatus && newStatus !== 'Sent to Faculty' && newStatus !== 'Pending') 
      ? newStatus 
      : 'Answered';

    let targetQ: Question | undefined;
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        targetQ = q;
        return {
          ...q,
          status: targetStatus,
          updatedAt: new Date().toISOString(),
          replies: [...(q.replies || []), reply]
        };
      }
      return q;
    });

    setQuestions(updatedQuestions);
    CampusStorage.setQuestions(updatedQuestions);

    // Notify student
    if (targetQ) {
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: targetQ.studentId,
        targetRole: 'student',
        title: suggestMeeting ? 'Office Hours Recommended' : 'Faculty Response Received',
        message: `${currentUser.name} responded to: "${targetQ.title.substring(0, 40)}..."`,
        timestamp: new Date().toISOString(),
        read: false,
        linkTab: 'my-questions',
        actionId: questionId
      };
      const updatedNotifs = [notif, ...notifications];
      setNotifications(updatedNotifs);
      CampusStorage.setNotifications(updatedNotifs);
    }

    showToast('Faculty reply sent successfully to student.', 'success');
  };

  const addFollowUpReply = (questionId: string, content: string) => {
    if (!currentUser) return;
    if (!content.trim()) return;

    const reply = {
      id: `rep-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    let targetQ: Question | undefined;
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        targetQ = q;
        return {
          ...q,
          updatedAt: new Date().toISOString(),
          replies: [...(q.replies || []), reply]
        };
      }
      return q;
    });

    setQuestions(updatedQuestions);
    CampusStorage.setQuestions(updatedQuestions);

    if (targetQ) {
      const notifyTargetId = currentUser.role === 'student' ? targetQ.facultyId : targetQ.studentId;
      const targetRole = currentUser.role === 'student' ? 'faculty' : 'student';
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: notifyTargetId,
        targetRole,
        title: 'New Follow-Up Doubt Message',
        message: `${currentUser.name} added a follow-up on "${targetQ.title.substring(0, 35)}..."`,
        timestamp: new Date().toISOString(),
        read: false,
        linkTab: targetRole === 'student' ? 'my-questions' : 'faculty-questions',
        actionId: questionId
      };
      const updatedNotifs = [notif, ...notifications];
      setNotifications(updatedNotifs);
      CampusStorage.setNotifications(updatedNotifs);
    }
    showToast('Follow-up message sent.', 'success');
  };

  const markQuestionResolved = (questionId: string) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, status: 'Resolved' as QuestionStatus, updatedAt: new Date().toISOString() } : q
    );
    setQuestions(updatedQuestions);
    CampusStorage.setQuestions(updatedQuestions);
    showToast('Question marked as Resolved. Great job resolving your doubt!', 'success');
  };

  const rateAnswerHelpful = (questionId: string, isInstantHelp: boolean) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          if (isInstantHelp && q.instantHelp) {
            return {
              ...q,
              instantHelp: { ...q.instantHelp, wasHelpful: true },
              helpfulVotes: (q.helpfulVotes || 0) + 1
            };
          }
          return {
            ...q,
            helpfulVotes: (q.helpfulVotes || 0) + 1
          };
        }
        return q;
      })
    );
    showToast('Thank you for your feedback!', 'success');
  };

  const markRepeatedDoubt = (questionId: string, isRepeated: boolean) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, isRepeatedDoubt: isRepeated } : q))
    );
    showToast(isRepeated ? 'Marked as repeated doubt for class FAQs.' : 'Unmarked repeated status.', 'info');
  };

  const createFaq = (data: {
    subject: string;
    category: string;
    question: string;
    answer: string;
  }) => {
    if (!currentUser) return;
    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      subject: data.subject,
      category: data.category,
      question: data.question.trim(),
      answer: data.answer.trim(),
      facultyAuthor: currentUser.name,
      isPopular: true,
      frequencyCount: 1
    };
    setFaqs((prev) => [newFaq, ...prev]);
    showToast('Published into Subject FAQs successfully!', 'success');
  };

  // --- Appointments ---
  const bookAppointment = (data: {
    facultyId: string;
    facultyName: string;
    date: string;
    timeSlot: string;
    subject: string;
    purpose: string;
    location: string;
  }): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Please log in.' };

    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
      showToast('Appointments must be scheduled for today or a future date.', 'error');
      return { success: false, message: 'Invalid date. Please choose a future date.' };
    }

    if (!data.purpose.trim()) {
      showToast('Please state the purpose of your appointment.', 'error');
      return { success: false, message: 'Purpose is required.' };
    }

    const existingConflict = appointments.some(
      (apt) =>
        apt.facultyId === data.facultyId &&
        apt.date === data.date &&
        apt.timeSlot === data.timeSlot &&
        apt.status !== 'Cancelled' &&
        apt.status !== 'Rejected'
    );

    if (existingConflict) {
      showToast('This appointment slot is already reserved. Please select another slot.', 'error');
      return { success: false, message: 'Slot already reserved.' };
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentRoll: currentUser.identifier,
      facultyId: data.facultyId,
      facultyName: data.facultyName,
      date: data.date,
      timeSlot: data.timeSlot,
      subject: data.subject,
      purpose: data.purpose.trim(),
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      location: data.location || 'Faculty Cabin'
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Notify faculty
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: data.facultyId,
      targetRole: 'faculty',
      title: 'New Appointment Booked',
      message: `${currentUser.name} booked a slot on ${data.date} (${data.timeSlot}).`,
      timestamp: new Date().toISOString(),
      read: false,
      linkTab: 'faculty-appointments',
      actionId: newAppointment.id
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('Appointment booked and confirmed! Added to your schedule.', 'success');
    return { success: true, message: 'Appointment confirmed.' };
  };

  const cancelAppointment = (appointmentId: string) => {
    if (!currentUser) return;
    const apt = appointments.find((a) => a.id === appointmentId);
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: 'Cancelled' as AppointmentStatus } : a))
    );

    if (apt) {
      const targetUserId = currentUser.role === 'student' ? apt.facultyId : apt.studentId;
      const targetRole = currentUser.role === 'student' ? 'faculty' : 'student';
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: targetUserId,
        targetRole,
        title: 'Appointment Cancelled',
        message: `${currentUser.name} cancelled the appointment on ${apt.date} (${apt.timeSlot}).`,
        timestamp: new Date().toISOString(),
        read: false,
        linkTab: 'appointments'
      };
      setNotifications((prev) => [notif, ...prev]);
    }
    showToast('Appointment cancelled.', 'info');
  };

  const updateAppointmentStatus = (appointmentId: string, status: AppointmentStatus, feedback?: string) => {
    if (!currentUser) return;
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status, facultyFeedback: feedback } : a))
    );

    const apt = appointments.find((a) => a.id === appointmentId);
    if (apt) {
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: apt.studentId,
        targetRole: 'student',
        title: `Appointment ${status}`,
        message: `Your appointment with ${currentUser.name} for ${apt.date} is ${status.toLowerCase()}.${feedback ? ` Note: "${feedback}"` : ''}`,
        timestamp: new Date().toISOString(),
        read: false,
        linkTab: 'appointments'
      };
      setNotifications((prev) => [notif, ...prev]);
    }
    showToast(`Appointment status updated to ${status}.`, 'success');
  };

  const createAppointmentSlot = (slotData: Omit<AppointmentSlot, 'id'>) => {
    const newSlot: AppointmentSlot = {
      ...slotData,
      id: `slot-${Date.now()}`
    };
    setSlots((prev) => [...prev, newSlot]);
    showToast('New office hours slot published.', 'success');
  };

  // --- Announcements ---
  const createAnnouncement = (title: string, content: string, subject?: string, isUrgent: boolean = false) => {
    if (!currentUser) return;
    if (!title.trim() || !content.trim()) {
      showToast('Title and content are required.', 'error');
      return;
    }

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role === 'class_rep' ? 'class_rep' : 'faculty',
      title: title.trim(),
      content: content.trim(),
      subject: subject || 'General Academic',
      createdAt: new Date().toISOString(),
      isUrgent
    };

    setAnnouncements((prev) => [newAnn, ...prev]);

    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'all',
      targetRole: 'student',
      title: isUrgent ? 'URGENT Class Notice' : 'New Class Announcement',
      message: `${currentUser.name}: ${newAnn.title}`,
      timestamp: new Date().toISOString(),
      read: false,
      linkTab: 'class-rep-dashboard'
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast('Class announcement published.', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const resetDemoData = () => {
    CampusStorage.resetAllDemoData();
    const defUsers = CampusStorage.getUsers();
    setUsers(defUsers);
    setCurrentUser(defUsers[0]);
    setActiveTab('landing');
    setQuestions(CampusStorage.getQuestions());
    setAppointments(CampusStorage.getAppointments());
    setSlots(CampusStorage.getAppointmentSlots());
    setFaqs(CampusStorage.getFAQs());
    setAnnouncements(CampusStorage.getAnnouncements());
    setNotifications(CampusStorage.getNotifications());
    setThemeModeState('light');
    showToast('All data has been reset to default demo scenario.', 'success');
  };

  const unreadNotifCount = notifications.filter(
    (n) => !n.read && (n.userId === currentUser?.id || n.targetRole === role || n.userId === 'all')
  ).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        users,
        activeTab,
        setActiveTab,
        questions,
        appointments,
        slots,
        faqs,
        announcements,
        notifications,
        unreadNotifCount,
        sidebarOpen,
        setSidebarOpen,
        toasts,
        showToast,
        dismissToast,
        themeMode,
        toggleThemeMode,
        loginUser,
        registerStudent,
        logoutUser,
        switchDemoUser,
        updateUserProfile,
        changePassword,
        resetPasswordRequest,
        toggleBookmark,
        submitQuestion,
        sendQuestionToFaculty,
        replyToQuestion,
        addFollowUpReply,
        markQuestionResolved,
        rateAnswerHelpful,
        markRepeatedDoubt,
        createFaq,
        bookAppointment,
        cancelAppointment,
        updateAppointmentStatus,
        createAppointmentSlot,
        createAnnouncement,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
