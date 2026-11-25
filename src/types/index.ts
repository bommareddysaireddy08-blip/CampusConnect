export type Role = 'student' | 'faculty' | 'class_rep';

export type QuestionStatus = 
  | 'Instant Help Available' 
  | 'Sent to Faculty' 
  | 'Answered' 
  | 'Resolved'
  | 'Submitted'           // backwards compatibility
  | 'In Review'           // backwards compatibility
  | 'Meeting Suggested';  // backwards compatibility

export type QuestionCategory = 
  | 'Concept Clarification'
  | 'Assignment / Lab'
  | 'Exam Preparation'
  | 'Project Guidance'
  | 'General Academic';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  department: string;
  yearOfStudy?: string;
  identifier: string; // Roll number or Faculty ID
  avatar: string;
  passwordHash?: string; // Client-side hashed for demonstration security
  designation?: string;
  bookmarks?: string[];
  createdAt?: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface QuestionReply {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  content: string;
  createdAt: string;
  suggestOfficeMeeting?: boolean;
  meetingNote?: string;
  isHelpfulCount?: number;
}

export interface StudyResource {
  title: string;
  linkOrRef: string;
  type: 'Textbook' | 'Lecture Notes' | 'Documentation' | 'Practice';
}

export interface InstantHelpResult {
  answer: string;
  confidence: 'high' | 'medium' | 'none';
  source: string;
  suggestedQuestions: string[];
  studyResources: StudyResource[];
  wasHelpful?: boolean | null;
  timestamp: string;
}

export interface Question {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  facultyId: string;
  facultyName: string;
  subject: string;
  title: string;
  description: string;
  category: QuestionCategory;
  status: QuestionStatus;
  createdAt: string;
  updatedAt: string;
  replies: QuestionReply[];
  attachments?: Attachment[];
  instantHelp?: InstantHelpResult;
  sentToFaculty: boolean;
  isRepeatedDoubt?: boolean;
  tags?: string[];
  helpfulVotes?: number;
  priority?: 'High' | 'Medium' | 'Normal';
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Cancelled' | 'Completed';

export interface AppointmentSlot {
  id: string;
  facultyId: string;
  facultyName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  maxCapacity: number;
}

export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  facultyId: string;
  facultyName: string;
  date: string;       // YYYY-MM-DD
  timeSlot: string;   // e.g. "14:00 - 14:30"
  subject: string;
  purpose: string;
  status: AppointmentStatus;
  createdAt: string;
  facultyFeedback?: string;
  location: string;
}

export interface FAQItem {
  id: string;
  subject: string;
  category: string;
  question: string;
  answer: string;
  facultyAuthor: string;
  isPopular?: boolean;
  frequencyCount?: number;
}

export interface Announcement {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'class_rep' | 'faculty';
  title: string;
  content: string;
  subject?: string;
  createdAt: string;
  isUrgent?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  targetRole?: Role;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTab?: string;
  actionId?: string;
}
