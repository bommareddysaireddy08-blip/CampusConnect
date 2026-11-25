# CampusConnect – Academic Help & Faculty Connect
### University Academic Communication Platform
**Project Code: P09 – "Heard in Class, Lost After"**

CampusConnect is a full-stack, responsive, self-contained college academic communication web application. It connects students and faculty outside lecture hours, providing instant academic assistance, structured doubt queues, conflict-free faculty office hours, and class-wide academic trends.

---

## 🎨 Professional College Color Palette
Designed with a natural, human-designed institutional palette:
- **Deep Teal:** `#285E59` (Primary brand color, main navigation, headers)
- **Secondary Teal:** `#4D8178` (Accent links, active indicators)
- **Warm Ivory Background:** `#F7F6F1` (Soft, non-straining reading canvas)
- **White Card Background:** `#FFFFFF` (Clean, elevated component surfaces)
- **Soft Sage:** `#E6EEE8` (Informational panels, table headers, tag backgrounds)
- **Warm Amber Accent:** `#D5A45B` (Urgent notices, instant help tags, important badges)
- **Main Typography:** `#26312F` & **Secondary Typography:** `#747D78`
- **Dark Mode Palette:** `#16201E` background, `#1F2C29` cards, `#E8ECE9` high-contrast text.

---

## 🌟 Upgraded Core Features

### 1. Robust Login & Registration System
- **Multi-Student Registration:** Allows students to register with Name, College Email, Roll Number/ID, Department, Year of Study, and Password.
- **Duplicate Prevention:** Validates email and Roll Number uniqueness.
- **Security Simulation:** Passwords are client-side salted & hashed (`hashPassword`) rather than saved as plain text. Clear disclaimer that production deployment requires an enterprise backend.
- **Session Persistence:** Active student session persists across page reloads.
- **Demo Logins:** 1-click test credentials provided for Student (`Aarav Sharma`), Faculty (`Dr. Meenakshi Sundaram`), and Class Rep (`Riya Patel`).
- **Role Isolation:** Public registration creates Student accounts only. Faculty and Class Representative privileges cannot be created through public student signups.

### 2. Instant Academic Help Assistant
- **Immediate Guidance:** Students type academic questions and receive instant answers from curated course syllabi (Operating Systems, DSA, DBMS, Computer Networks, etc.) and verified subject FAQs.
- **Replaced Waiting Messages:** All *"reply in 24 to 48 hours"* messages have been eliminated.
- **Curated Knowledge Sources:** Clear citations of textbooks, lecture slide numbers, and official documentation.
- **Recommended Study Materials:** Direct references to textbooks, lecture notes, and practice problem sets.
- **Interactive Follow-ups:** Students can converse and ask follow-up questions within the instant assistance thread.
- **Helpful Rating:** Students rate answers with "Was this answer useful?" feedback.
- **Faculty Escalation:** One-click *"Send to Faculty for Clarification"* forwards any question to the professor's queue.
- **Two Distinct Sections:**
  - **Section A:** Instant Help from the knowledge base.
  - **Section B:** Detailed personalized explanation from the actual course professor.

### 3. Upgraded Question & Discussion System
- **Attachment Support:** Attach lecture notes, handwritten formulas, or error traces with file size and type preview.
- **Dynamic Author Identity:** Automatically reflects the actual logged-in student's profile name (no hardcoded names).
- **Similar Question Detection:** Real-time suggestion of existing doubts while typing to reduce repeated queries.
- **Updated Statuses:** `Instant Help Available`, `Sent to Faculty`, `Answered`, `Resolved`.
- **Threaded Dialogue:** Students and faculty can exchange multiple follow-up replies.
- **One-Click Resolution:** Students mark doubts as `Resolved` once understood.

### 4. Faculty Consultation & Calendar View
- **Interactive Calendar:** Toggle between List View and Month Agenda View.
- **Conflict Prevention:** Prevents double-booking the same faculty slot and blocks past dates.
- **Office Hours Publishing:** Professors configure recurring consultation availability with capacity limits.
- **Booking Management:** Faculty can approve, reject, or mark meetings complete with preparation notes.

### 5. Personalized Profile & Identity
- **Edit Profile:** Edit Name, Department, Year of Study, and Profile Avatar.
- **Cascading Name Updates:** Changing the profile name updates it everywhere across the application—in questions, replies, and navigation.
- **Change Password:** In-app interface with old password verification and confirmation.
- **Dark/Light Mode:** Toggle in top header and profile page.
- **Answer Bookmarks:** Save important answers for exam preparation.

---

## 🏃 Running Instructions

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Start development server
npm run dev
# Open http://localhost:5173 in your browser

# 3. Run production build & preview
npm run build
npm run preview
```

---

## 🧪 Automated Feature Verification
Run the verification suite:
```bash
node verify-all-features.js
```
All 6 core feature tests passed:
- Salted password hashing
- Multi-student registration and duplicate prevention
- Real student name reflection across doubts
- Instant academic help engine & resources
- Faculty reply, follow-up, and resolution cycle
- Double-booking conflict rejection

---

## 🔍 Production Readiness & Architecture Notes
- **Current Prototype State:** Runs as a 100% self-contained frontend application utilizing browser `LocalStorage` with in-memory fallbacks. This guarantees maximum stability during university grading and project demonstrations with zero dependency on external network servers.
- **Production Deployment Requirements:**
  - **Backend Server:** For multi-device authentication and persistent cross-user synchronization, a production backend (Node.js/Express, Python/FastAPI, or Java/Spring Boot) with PostgreSQL/MySQL and JWT/OAuth2 session tokens would replace `LocalStorage`.
  - **AI Integration:** The current engine searches a verified curriculum knowledge base and FAQs. For generative AI (e.g. Google Gemini API), a secure server-side proxy route should be configured using `GEMINI_API_KEY` in environment variables so keys are never exposed in frontend bundles.
