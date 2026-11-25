import type { 
  User, 
  Question, 
  Appointment, 
  AppointmentSlot, 
  FAQItem, 
  Announcement, 
  Notification,
  Role 
} from '../types/index.ts';

// Simple client-side hash function for demo security (avoids storing plain-text passwords)
export function hashPassword(password: string): string {
  let hash = 0;
  const str = `campus_salt_${password}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `h_${Math.abs(hash).toString(16)}`;
}

// Initial default accounts for demonstration & grading
export const DEFAULT_USERS: User[] = [
  {
    id: 'user-std-1',
    name: 'Aarav Sharma',
    role: 'student',
    email: 'aarav.sharma@campus.edu',
    department: 'Computer Science & Engineering',
    yearOfStudy: '3rd Year',
    identifier: '21BCE1042',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    passwordHash: hashPassword('Student@123'),
    bookmarks: ['q-101'],
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'user-fac-1',
    name: 'Dr. Meenakshi Sundaram',
    role: 'faculty',
    email: 'm.sundaram@campus.edu',
    department: 'Dept. of Computer Science',
    identifier: 'FAC-CS-804',
    designation: 'Senior Professor & Lab Head',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    passwordHash: hashPassword('Faculty@123'),
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'user-cr-1',
    name: 'Riya Patel',
    role: 'class_rep',
    email: 'riya.patel@campus.edu',
    department: 'Computer Science (Section B)',
    yearOfStudy: '3rd Year',
    identifier: '21BCE1089',
    designation: 'Academic Class Representative',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    passwordHash: hashPassword('ClassRep@123'),
    createdAt: '2026-08-01T10:00:00Z'
  }
];

export const FACULTY_DIRECTORY: { id: string; name: string; department: string; subjects: string[]; email: string }[] = [
  {
    id: 'user-fac-1',
    name: 'Dr. Meenakshi Sundaram',
    department: 'Computer Science',
    subjects: ['Operating Systems', 'Distributed Systems'],
    email: 'm.sundaram@campus.edu'
  },
  {
    id: 'user-fac-2',
    name: 'Prof. Rajesh Verma',
    department: 'Computer Science',
    subjects: ['Data Structures & Algorithms', 'Design & Analysis of Algorithms'],
    email: 'r.verma@campus.edu'
  },
  {
    id: 'user-fac-3',
    name: 'Dr. Ananya Roy',
    department: 'Information Technology',
    subjects: ['Database Management Systems', 'Advanced Database Technologies'],
    email: 'a.roy@campus.edu'
  },
  {
    id: 'user-fac-4',
    name: 'Prof. Vikramaditya Rao',
    department: 'Computer Science',
    subjects: ['Computer Networks', 'Cloud Computing & Security'],
    email: 'v.rao@campus.edu'
  }
];

export const SUBJECTS_LIST = [
  'Operating Systems',
  'Data Structures & Algorithms',
  'Database Management Systems',
  'Computer Networks',
  'Distributed Systems',
  'Design & Analysis of Algorithms'
];

export const DEPARTMENTS_LIST = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering'
];

export const YEARS_OF_STUDY = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  '4th Year (Senior)'
];

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-101',
    studentId: 'user-std-1',
    studentName: 'Aarav Sharma',
    studentRoll: '21BCE1042',
    facultyId: 'user-fac-1',
    facultyName: 'Dr. Meenakshi Sundaram',
    subject: 'Operating Systems',
    title: "Race condition in Peterson's Algorithm under multi-core CPUs",
    description: "In lecture 14, we discussed Peterson's solution for 2 processes. However, on modern out-of-order execution multi-core processors with memory caching, memory reordering can cause both processes to enter the critical section simultaneously. How does CPU hardware memory barrier (fence instruction) solve this in practice?",
    category: 'Concept Clarification',
    status: 'Answered',
    sentToFaculty: true,
    createdAt: '2026-11-23T14:30:00Z',
    updatedAt: '2026-11-24T09:15:00Z',
    isRepeatedDoubt: true,
    helpfulVotes: 6,
    priority: 'Normal',
    instantHelp: {
      answer: "Peterson's algorithm assumes sequential consistency. Modern processors (x86, ARM) perform memory reordering where writes to `flag` and `turn` can be reordered. Hardware memory fences (like `mfence` or atomic store barriers) prevent the CPU from propagating store operations across the barrier before prior loads/stores finish.",
      confidence: 'high',
      source: 'Curated Academic Knowledge Base (Operating Systems)',
      suggestedQuestions: [
        "Why does Peterson's solution fail on SMP without atomic ops?",
        "What is the difference between compiler reordering and processor store buffering?"
      ],
      studyResources: [
        { title: 'Silberschatz - OS Concepts Chapter 6', linkOrRef: 'Section 6.3', type: 'Textbook' },
        { title: 'Lecture 14 Slides on Concurrency', linkOrRef: 'Course Portal / CS301', type: 'Lecture Notes' }
      ],
      wasHelpful: true,
      timestamp: '2026-11-23T14:30:05Z'
    },
    replies: [
      {
        id: 'rep-1',
        authorId: 'user-fac-1',
        authorName: 'Dr. Meenakshi Sundaram',
        authorRole: 'faculty',
        content: "Excellent and observant question, Aarav! You are spot on. Peterson's algorithm assumes sequential consistency. Modern processors (x86, ARM) perform memory reordering where writes to `flag` and `turn` can be reordered by compiler or CPU pipeline. Hardware memory fences (like `mfence` or `atomic_thread_fence`) prevent the CPU from propagating store operations across the barrier before prior loads/stores finish. I have also added this to our Class FAQ section for reference.",
        createdAt: '2026-11-24T09:15:00Z',
        suggestOfficeMeeting: false,
        isHelpfulCount: 5
      }
    ],
    tags: ['Synchronization', 'Concurrency', 'CPU Architecture']
  },
  {
    id: 'q-102',
    studentId: 'user-std-1',
    studentName: 'Aarav Sharma',
    studentRoll: '21BCE1042',
    facultyId: 'user-fac-2',
    facultyName: 'Prof. Rajesh Verma',
    subject: 'Data Structures & Algorithms',
    title: 'Disjoint Set Union (DSU) Inverse Ackermann complexity proof intuition',
    description: "I understand that path compression combined with union by rank yields O(m * alpha(n)) amortized time, but could you clarify how the rank grouping and potential function lead to the alpha(n) bound without getting bogged down in 20 pages of algebra?",
    category: 'Concept Clarification',
    status: 'Sent to Faculty',
    sentToFaculty: true,
    createdAt: '2026-11-24T18:45:00Z',
    updatedAt: '2026-11-25T10:00:00Z',
    isRepeatedDoubt: false,
    helpfulVotes: 3,
    priority: 'Normal',
    instantHelp: {
      answer: "Combining Path Compression with Union by Rank gives DSU an amortized time complexity of O(m * alpha(n)), where alpha(n) is the extremely slow-growing Inverse Ackermann function. For all practical values of n (even 10^80), alpha(n) <= 4, making each operation essentially O(1).",
      confidence: 'high',
      source: 'Curated Academic Knowledge Base (Data Structures)',
      suggestedQuestions: [
        "What happens to time complexity if we use path compression WITHOUT union by rank?",
        "How does DSU handle cycle detection in undirected graphs?"
      ],
      studyResources: [
        { title: 'CLRS Chapter 21: Data Structures for Disjoint Sets', linkOrRef: 'Section 21.3', type: 'Textbook' }
      ],
      wasHelpful: true,
      timestamp: '2026-11-24T18:45:05Z'
    },
    replies: [],
    tags: ['DSU', 'Amortized Analysis', 'Graphs']
  },
  {
    id: 'q-103',
    studentId: 'user-std-1',
    studentName: 'Aarav Sharma',
    studentRoll: '21BCE1042',
    facultyId: 'user-fac-3',
    facultyName: 'Dr. Ananya Roy',
    subject: 'Database Management Systems',
    title: 'Lossless join vs Dependency Preservation in BCNF decomposition',
    description: 'During Lab Exercise 4, problem 3 required decomposing a relation into BCNF. While the decomposition was strictly lossless, we could not preserve functional dependency (A, B -> C). Is it always acceptable in production database design to drop dependency preservation in favor of 3NF?',
    category: 'Assignment / Lab',
    status: 'Answered',
    sentToFaculty: true,
    createdAt: '2026-11-22T11:20:00Z',
    updatedAt: '2026-11-23T16:00:00Z',
    isRepeatedDoubt: true,
    helpfulVotes: 4,
    priority: 'High',
    instantHelp: {
      answer: "In 3NF, for every functional dependency X -> Y, either X is a superkey OR Y is a prime attribute. In BCNF, X must ALWAYS be a superkey. BCNF eliminates all redundancy caused by functional dependencies, but decomposing into BCNF can sacrifice Functional Dependency Preservation.",
      confidence: 'high',
      source: 'Curated Academic Knowledge Base (Database Systems)',
      suggestedQuestions: [
        "How to check if a decomposition preserves all functional dependencies?",
        "When is 3NF preferred over BCNF in production relational databases?"
      ],
      studyResources: [
        { title: 'Elmasri & Navathe - Fundamentals of Database Systems Chapter 14', linkOrRef: 'Section 14.5', type: 'Textbook' }
      ],
      wasHelpful: true,
      timestamp: '2026-11-22T11:20:05Z'
    },
    replies: [
      {
        id: 'rep-2',
        authorId: 'user-fac-3',
        authorName: 'Dr. Ananya Roy',
        authorRole: 'faculty',
        content: "This trade-off is one of the classic dilemmas in relational schema design. In practice, many systems choose 3NF specifically to avoid running cross-table assertions or triggers. Let us review the schema diagrams in detail during office hours so I can demonstrate how PostgreSQL handling compares to Oracle.",
        createdAt: '2026-11-23T16:00:00Z',
        suggestOfficeMeeting: true,
        meetingNote: 'Please book a 15-minute slot on Wednesday between 2:00 PM - 3:30 PM.',
        isHelpfulCount: 3
      }
    ],
    tags: ['Normalization', 'BCNF', 'Relational Model']
  }
];

const INITIAL_SLOTS: AppointmentSlot[] = [
  {
    id: 'slot-1',
    facultyId: 'user-fac-1',
    facultyName: 'Dr. Meenakshi Sundaram',
    dayOfWeek: 'Monday',
    startTime: '10:00',
    endTime: '11:30',
    room: 'Block 3, Cabin 402',
    maxCapacity: 3
  },
  {
    id: 'slot-2',
    facultyId: 'user-fac-1',
    facultyName: 'Dr. Meenakshi Sundaram',
    dayOfWeek: 'Wednesday',
    startTime: '14:00',
    endTime: '16:00',
    room: 'Block 3, Cabin 402',
    maxCapacity: 4
  },
  {
    id: 'slot-3',
    facultyId: 'user-fac-2',
    facultyName: 'Prof. Rajesh Verma',
    dayOfWeek: 'Tuesday',
    startTime: '11:00',
    endTime: '12:30',
    room: 'Block 2, Cabin 108',
    maxCapacity: 3
  },
  {
    id: 'slot-4',
    facultyId: 'user-fac-3',
    facultyName: 'Dr. Ananya Roy',
    dayOfWeek: 'Thursday',
    startTime: '15:00',
    endTime: '17:00',
    room: 'Block 4, Cabin 204',
    maxCapacity: 4
  },
  {
    id: 'slot-5',
    facultyId: 'user-fac-4',
    facultyName: 'Prof. Vikramaditya Rao',
    dayOfWeek: 'Friday',
    startTime: '10:30',
    endTime: '12:00',
    room: 'Block 1, Cabin 305',
    maxCapacity: 3
  }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-201',
    studentId: 'user-std-1',
    studentName: 'Aarav Sharma',
    studentRoll: '21BCE1042',
    facultyId: 'user-fac-1',
    facultyName: 'Dr. Meenakshi Sundaram',
    date: '2026-11-30',
    timeSlot: '14:00 - 14:30',
    subject: 'Operating Systems',
    purpose: 'Reviewing deadlock detection graph in mini-project submission',
    status: 'Confirmed',
    createdAt: '2026-11-24T10:00:00Z',
    location: 'Block 3, Cabin 402'
  },
  {
    id: 'apt-202',
    studentId: 'user-std-1',
    studentName: 'Aarav Sharma',
    studentRoll: '21BCE1042',
    facultyId: 'user-fac-3',
    facultyName: 'Dr. Ananya Roy',
    date: '2026-12-03',
    timeSlot: '15:00 - 15:30',
    subject: 'Database Management Systems',
    purpose: 'Clarification on BCNF vs 3NF multi-table constraints from Question #q-103',
    status: 'Pending',
    createdAt: '2026-11-25T08:30:00Z',
    location: 'Block 4, Cabin 204'
  }
];

const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    subject: 'Operating Systems',
    category: 'Memory Management',
    question: "Why does Belady's Anomaly not happen in LRU or Optimal replacement?",
    answer: "LRU and Optimal are 'stack algorithms' satisfying the inclusion property: M(n, r) ⊆ M(n+1, r). The pages retained in n frames are always a subset of those in n+1 frames. FIFO lacks this inclusion property, so adding frames can cause more page faults for certain access strings.",
    facultyAuthor: 'Dr. Meenakshi Sundaram',
    isPopular: true,
    frequencyCount: 14
  },
  {
    id: 'faq-2',
    subject: 'Operating Systems',
    category: 'Process Synchronization',
    question: "What are the 4 necessary conditions for deadlock and how can we prevent hold-and-wait?",
    answer: "The 4 conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Hold-and-wait can be prevented by requiring a process to request all its resources before execution begins, or to release all currently held resources before requesting new ones.",
    facultyAuthor: 'Dr. Meenakshi Sundaram',
    isPopular: true,
    frequencyCount: 19
  },
  {
    id: 'faq-3',
    subject: 'Database Management Systems',
    category: 'Normalization',
    question: "What is the key practical difference between 3NF and BCNF?",
    answer: "In 3NF, for every functional dependency X -> Y, either X is a superkey OR Y is a prime attribute (part of candidate key). In BCNF, X must ALWAYS be a superkey, with no exceptions for prime attributes. Thus, BCNF is strictly stronger and eliminates all redundancy based on functional dependencies.",
    facultyAuthor: 'Dr. Ananya Roy',
    isPopular: true,
    frequencyCount: 12
  },
  {
    id: 'faq-4',
    subject: 'Data Structures & Algorithms',
    category: 'Dynamic Programming',
    question: "How do you distinguish between 0/1 Knapsack and Unbounded Knapsack states?",
    answer: "In 0/1 Knapsack, each item may be chosen at most once; thus, transitioning dp[i][w] considers dp[i-1][w - wt[i]]. In Unbounded Knapsack, an item can be chosen multiple times, so the recurrence considers dp[i][w - wt[i]] (same item index i).",
    facultyAuthor: 'Prof. Rajesh Verma',
    isPopular: true,
    frequencyCount: 16
  },
  {
    id: 'faq-5',
    subject: 'Computer Networks',
    category: 'Transport Layer',
    question: "Why does TCP use a Three-Way Handshake instead of a Two-Way Handshake?",
    answer: "A two-way handshake cannot guarantee both endpoints agree on initial sequence numbers (ISNs) in the presence of delayed, duplicated control packets from old connections. The 3-way handshake ensures both client and server acknowledge and synchronize their respective sequence numbers.",
    facultyAuthor: 'Prof. Vikramaditya Rao',
    isPopular: false,
    frequencyCount: 8
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    authorId: 'user-cr-1',
    authorName: 'Riya Patel',
    authorRole: 'class_rep',
    title: 'Mid-Term 2 Schedule & Doubt Submission Window',
    content: 'Mid-Term assessments commence next Monday. Faculty have requested all lab-related doubts be submitted through CampusConnect before Thursday 5 PM so they can be addressed during dedicated lab tutorial hours.',
    subject: 'General Academic',
    createdAt: '2026-11-24T16:00:00Z',
    isUrgent: true
  },
  {
    id: 'ann-2',
    authorId: 'user-fac-1',
    authorName: 'Dr. Meenakshi Sundaram',
    authorRole: 'faculty',
    title: 'Special Office Hours for OS Scheduling & Concurrency',
    content: 'Due to repeated questions on CPU synchronization barriers and Peterson’s Algorithm, I will be hosting open office hours on Wednesday from 2 PM to 4 PM in Cabin 402. Walk-ins welcome after booked appointments.',
    subject: 'Operating Systems',
    createdAt: '2026-11-23T11:30:00Z',
    isUrgent: false
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-std-1',
    targetRole: 'student',
    title: 'Instant Assistance Available',
    message: "Verified solution found in knowledge base for Peterson's Algorithm doubt.",
    timestamp: '2026-11-23T14:30:10Z',
    read: true,
    linkTab: 'my-questions',
    actionId: 'q-101'
  },
  {
    id: 'notif-2',
    userId: 'user-std-1',
    targetRole: 'student',
    title: 'Faculty Response Received',
    message: "Dr. Meenakshi Sundaram added a detailed explanation for your OS question.",
    timestamp: '2026-11-24T09:16:00Z',
    read: false,
    linkTab: 'my-questions',
    actionId: 'q-101'
  },
  {
    id: 'notif-3',
    userId: 'user-std-1',
    targetRole: 'student',
    title: 'Office Hours Recommended',
    message: 'Dr. Ananya Roy suggested an in-person meeting for your DBMS Normalization question.',
    timestamp: '2026-11-23T16:05:00Z',
    read: false,
    linkTab: 'appointments',
    actionId: 'q-103'
  }
];

// Fallback in-memory storage if browser localStorage is blocked
const memoryStore: Record<string, string> = {};

function safeGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {
    console.warn('LocalStorage read error, using memoryStore:', e);
  }
  return memoryStore[key] || null;
}

function safeSet(key: string, val: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, val);
    }
  } catch (e) {
    console.warn('LocalStorage write error, using memoryStore:', e);
  }
  memoryStore[key] = val;
}

const STORAGE_KEYS = {
  USERS: 'campusconnect_users_v2',
  ACTIVE_USER_ID: 'campusconnect_active_uid_v2',
  QUESTIONS: 'campusconnect_questions_v2',
  APPOINTMENTS: 'campusconnect_appointments_v2',
  SLOTS: 'campusconnect_slots_v2',
  FAQS: 'campusconnect_faqs_v2',
  ANNOUNCEMENTS: 'campusconnect_announcements_v2',
  NOTIFICATIONS: 'campusconnect_notifications_v2',
  THEME: 'campusconnect_theme_mode_v2'
};

export const CampusStorage = {
  // Users management
  getUsers(): User[] {
    const raw = safeGet(STORAGE_KEYS.USERS);
    if (!raw) {
      this.setUsers(DEFAULT_USERS);
      return DEFAULT_USERS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error('Failed to parse users, resetting defaults:', e);
    }
    this.setUsers(DEFAULT_USERS);
    return DEFAULT_USERS;
  },

  setUsers(users: User[]): void {
    safeSet(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getActiveUser(): User {
    const users = this.getUsers();
    const activeId = safeGet(STORAGE_KEYS.ACTIVE_USER_ID);
    if (activeId) {
      const found = users.find(u => u.id === activeId);
      if (found) return found;
    }
    // Default to the first demo student Aarav Sharma
    return users[0] || DEFAULT_USERS[0];
  },

  setActiveUserId(id: string): void {
    safeSet(STORAGE_KEYS.ACTIVE_USER_ID, id);
  },

  clearActiveSession(): void {
    safeSet(STORAGE_KEYS.ACTIVE_USER_ID, '');
  },

  // Questions
  getQuestions(): Question[] {
    const raw = safeGet(STORAGE_KEYS.QUESTIONS);
    if (!raw) {
      this.setQuestions(INITIAL_QUESTIONS);
      return INITIAL_QUESTIONS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error('Failed to parse questions, resetting:', e);
    }
    this.setQuestions(INITIAL_QUESTIONS);
    return INITIAL_QUESTIONS;
  },

  setQuestions(questions: Question[]): void {
    safeSet(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  // Appointments
  getAppointments(): Appointment[] {
    const raw = safeGet(STORAGE_KEYS.APPOINTMENTS);
    if (!raw) {
      this.setAppointments(INITIAL_APPOINTMENTS);
      return INITIAL_APPOINTMENTS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error('Failed to parse appointments:', e);
    }
    this.setAppointments(INITIAL_APPOINTMENTS);
    return INITIAL_APPOINTMENTS;
  },

  setAppointments(appointments: Appointment[]): void {
    safeSet(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  },

  // Slots
  getAppointmentSlots(): AppointmentSlot[] {
    const raw = safeGet(STORAGE_KEYS.SLOTS);
    if (!raw) {
      this.setAppointmentSlots(INITIAL_SLOTS);
      return INITIAL_SLOTS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error('Failed to parse slots:', e);
    }
    this.setAppointmentSlots(INITIAL_SLOTS);
    return INITIAL_SLOTS;
  },

  setAppointmentSlots(slots: AppointmentSlot[]): void {
    safeSet(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
  },

  // FAQs
  getFAQs(): FAQItem[] {
    const raw = safeGet(STORAGE_KEYS.FAQS);
    if (!raw) {
      this.setFAQs(INITIAL_FAQS);
      return INITIAL_FAQS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error('Failed to parse FAQs:', e);
    }
    this.setFAQs(INITIAL_FAQS);
    return INITIAL_FAQS;
  },

  setFAQs(faqs: FAQItem[]): void {
    safeSet(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
  },

  // Announcements
  getAnnouncements(): Announcement[] {
    const raw = safeGet(STORAGE_KEYS.ANNOUNCEMENTS);
    if (!raw) {
      this.setAnnouncements(INITIAL_ANNOUNCEMENTS);
      return INITIAL_ANNOUNCEMENTS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error('Failed to parse announcements:', e);
    }
    this.setAnnouncements(INITIAL_ANNOUNCEMENTS);
    return INITIAL_ANNOUNCEMENTS;
  },

  setAnnouncements(announcements: Announcement[]): void {
    safeSet(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  },

  // Notifications
  getNotifications(): Notification[] {
    const raw = safeGet(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      this.setNotifications(INITIAL_NOTIFICATIONS);
      return INITIAL_NOTIFICATIONS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error('Failed to parse notifications:', e);
    }
    this.setNotifications(INITIAL_NOTIFICATIONS);
    return INITIAL_NOTIFICATIONS;
  },

  setNotifications(notifications: Notification[]): void {
    safeSet(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  // Theme mode
  getThemeMode(): 'light' | 'dark' {
    const raw = safeGet(STORAGE_KEYS.THEME);
    return raw === 'dark' ? 'dark' : 'light';
  },

  setThemeMode(mode: 'light' | 'dark'): void {
    safeSet(STORAGE_KEYS.THEME, mode);
  },

  // Global reset
  resetAllDemoData(): void {
    this.setUsers(DEFAULT_USERS);
    this.setActiveUserId(DEFAULT_USERS[0].id);
    this.setQuestions(INITIAL_QUESTIONS);
    this.setAppointments(INITIAL_APPOINTMENTS);
    this.setAppointmentSlots(INITIAL_SLOTS);
    this.setFAQs(INITIAL_FAQS);
    this.setAnnouncements(INITIAL_ANNOUNCEMENTS);
    this.setNotifications(INITIAL_NOTIFICATIONS);
    this.setThemeMode('light');
  }
};
