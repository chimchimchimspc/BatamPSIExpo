# JOGJA FREELANCE PASSPORT
## Platform untuk Menemukan Peluang Freelance & Panduan Harian di Yogyakarta

**Version:** 2.0 (REVISED)  
**Date:** June 2026  
**Focus:** 1 Platform terintegrasi untuk freelancer di Yogyakarta  
**Design:** Amazon UI Standards (Styling saja)  
**Tech Stack:** React.js, Node.js/Express, PostgreSQL, Redis  

---

## EXECUTIVE SUMMARY

**Jogja Freelance Passport** adalah platform yang membantu freelancer menemukan peluang kerja di Yogyakarta dan memberikan panduan harian selama mereka stay di kota. Platform ini mengintegrasikan:

1. **Job Board** - Proyek & peluang freelance lokal di Jogja
2. **Daily Passport Guide** - Panduan harian untuk aktivitas, networking, & skill-building
3. **Community System** - Marketplace mini, badge achievement, profile kredibilitas
4. **Networking Hub** - Events, workshops, coffee sessions untuk freelancer

**NOT** 3 ecosystem terpisah, tapi **1 platform terpadu** dengan fitur secondary.

---

## FASE 1: DISCUSS (Problem & Solution)

### Problem Identification

**Problem 1: Sulit menemukan peluang freelance di Jogja**
- Banyak project tetapi tersebar di berbagai platform
- Tidak ada yang "fokus Jogja"
- Freelancer pemula tidak tahu di mana mulai

**Problem 2: Freelancer baru tidak tahu bagaimana "survive" di Jogja**
- Tidak kenal networking
- Tidak tahu tempat productif (cafe, coworking)
- Tidak tahu event atau komunitas
- Tidak punya itinerary "produktif"

**Problem 3: Verifikasi kredibilitas**
- Freelancer baru tidak punya portfolio/review
- Employer tidak yakin kualitas
- Tidak ada trust signal

### Solution Agreed

**Solution Pillar 1: Unified Jogja-Focused Job Board**
- Hanya project yang berada di/untuk Jogja
- Real-time posting dari local MSME & startups
- Filter by: skill, budget, deadline, location
- Admin verification untuk quality assurance

**Solution Pillar 2: Daily Passport Guide**
- Panduan harian structured (Day 1 - Day 30)
- Setiap hari punya task/activity recommendation
- Milestone tracking dengan achievement badges
- Community-curated tips & resources

**Solution Pillar 3: Trust & Reputation System**
- Badge collection (portfolio, reviews, completed projects)
- Visible Passport (credential showcase)
- Verified badge after completing milestones
- Community reviews & ratings

**Solution Pillar 4: Amazon-Grade Design**
- Clean, minimal UI (orange CTA, dark slate text)
- Mobile-first responsive
- Fast loading (< 2s)
- Accessible (WCAG AA)

---

## FASE 2: PLAN (Features & Architecture)

### Core Features (MVP)

```
1. AUTH & PROFILE
   ├─ Register/Login (email, Google, GitHub)
   ├─ Profile setup (name, city, skills, portfolio link)
   ├─ Skill tags (Design, Development, Content, etc.)
   └─ Verification status (badge if verified)

2. JOB BOARD (MAIN FEATURE)
   ├─ Browse job list (card grid)
   ├─ Filter: Category, Budget, Deadline, Required Skills
   ├─ Sort: Newest, Budget, Deadline
   ├─ Job detail (full description, employer info)
   └─ Apply with cover letter (max 300 chars)

3. APPLICATION TRACKING
   ├─ My Applications (status: pending, accepted, rejected)
   ├─ Interview/Messaging link (external WhatsApp/Email)
   └─ Archive old applications

4. DAILY PASSPORT GUIDE (CORE FEATURE)
   ├─ 30-Day journey (personalized per user)
   ├─ Daily tasks/milestones
   │  ├─ Day 1-5: Onboarding (profile, skills, portfolio)
   │  ├─ Day 6-15: Exploration (events, networking, coffee sessions)
   │  ├─ Day 16-25: Action (apply to jobs, attend meetings)
   │  └─ Day 26-30: Wrap-up (consolidate network, final tips)
   │
   ├─ Daily recommendations engine
   │  ├─ Suggested task for today
   │  ├─ Nearby events/workshops/coffee meetings
   │  ├─ Curated job postings matching skills
   │  └─ Resource tips (articles, interviews)
   │
   ├─ Progress tracker (% completion)
   └─ Milestone badges (unlocked at key days)

5. ACHIEVEMENT SYSTEM
   ├─ Badges:
   │  ├─ Profile Complete
   │  ├─ First Application
   │  ├─ Job Interview
   │  ├─ Job Completed
   │  ├─ 5-Day Passport Complete
   │  ├─ 30-Day Passport Complete
   │  └─ Community Review
   │
   ├─ Passport display
   │  ├─ Show all badges on public profile
   │  ├─ Achievement timeline
   │  └─ Shareable link to profile
   │
   └─ Gamification (Level: Bronze → Silver → Gold → Platinum)

6. COMMUNITY & EVENTS
   ├─ Local events feed (workshops, meetups)
   ├─ Check-in system (QR code for attendance)
   ├─ Networking feature (find people with similar skills)
   └─ Community reviews (peer-to-peer feedback)

7. ADMIN DASHBOARD
   ├─ Job posting moderation
   ├─ User management
   ├─ Event management
   ├─ Badge verification (for attended events)
   └─ Analytics & metrics

```

### Architecture Overview

```
FRONTEND (React.js)
├─ Next.js 14 (SSR/SSG for SEO)
├─ Tailwind CSS (Amazon design system)
├─ Redux Toolkit (global state)
├─ React Query (API data fetching)
├─ Zustand (optional: local state)
└─ Firebase Notifications (push alerts)

BACKEND (Node.js)
├─ Express.js
├─ PostgreSQL (jobs, users, applications)
├─ Redis (cache, sessions, real-time)
├─ Bull queue (email, notifications)
├─ AWS S3 (profile pictures, documents)
└─ Elasticsearch (job search)

INTEGRATIONS
├─ Twilio (SMS/WhatsApp messaging)
├─ SendGrid (email)
├─ Firebase Cloud Messaging (push notifications)
├─ Google Maps API (location-based features)
└─ Auth0 / Firebase Auth (authentication)

DEPLOYMENT
├─ Vercel (Frontend CDN)
├─ AWS ECS + RDS (Backend services)
├─ Docker (containerization)
└─ GitHub Actions (CI/CD)
```

### Database Schema

```sql
-- USERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  phone VARCHAR(20),
  city VARCHAR(100), -- Should be "Yogyakarta" primarily
  bio TEXT,
  profile_picture_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- USER PROFILES (Extended)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id),
  skills TEXT[], -- Array of skill tags
  portfolio_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  completed_projects INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- JOB POSTINGS
CREATE TABLE job_postings (
  id UUID PRIMARY KEY,
  employer_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  required_skills TEXT[],
  budget DECIMAL(10,2),
  deadline DATE,
  location VARCHAR(255), -- "Yogyakarta" or specific area
  contact_whatsapp VARCHAR(20),
  contact_email VARCHAR(255),
  status ENUM('draft', 'pending_review', 'active', 'closed'),
  view_count INT DEFAULT 0,
  application_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- APPLICATIONS
CREATE TABLE applications (
  id UUID PRIMARY KEY,
  job_id UUID REFERENCES job_postings(id),
  freelancer_id UUID REFERENCES users(id),
  cover_letter TEXT,
  status ENUM('pending', 'reviewed', 'accepted', 'rejected'),
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);

-- DAILY PASSPORT ENTRIES
CREATE TABLE passport_entries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  day_number INT, -- 1-30
  date DATE,
  task_completed BOOLEAN DEFAULT FALSE,
  task_type ENUM('onboarding', 'exploration', 'action', 'network'),
  task_description TEXT,
  completed_at TIMESTAMP,
  notes TEXT, -- User notes on day
  created_at TIMESTAMP DEFAULT NOW()
);

-- BADGES/ACHIEVEMENTS
CREATE TABLE badges (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url TEXT,
  trigger_condition ENUM('profile_complete', 'first_app', 'event_attend', 'day_5', 'day_30', 'project_complete'),
  created_at TIMESTAMP DEFAULT NOW()
);

-- USER BADGES
CREATE TABLE user_badges (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- EVENTS
CREATE TABLE events (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  event_date TIMESTAMP,
  location_name VARCHAR(255),
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  organizer_id UUID REFERENCES users(id),
  type ENUM('workshop', 'meetup', 'coffee_chat', 'networking'),
  attendee_limit INT,
  check_in_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- EVENT ATTENDANCE
CREATE TABLE event_attendance (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES users(id),
  checked_in_at TIMESTAMP,
  UNIQUE(event_id, user_id)
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type ENUM('job_match', 'application_update', 'badge_earned', 'event_reminder', 'daily_task'),
  title VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints

```
AUTH
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/verify-email

PROFILES
GET    /api/v1/profile
GET    /api/v1/profile/:userId (public)
PUT    /api/v1/profile
POST   /api/v1/profile/upload-picture

JOB BOARD
GET    /api/v1/jobs (list with filters)
GET    /api/v1/jobs/:id
POST   /api/v1/jobs (create - employer only)
PUT    /api/v1/jobs/:id (update - owner only)
DELETE /api/v1/jobs/:id

APPLICATIONS
POST   /api/v1/applications (submit)
GET    /api/v1/applications (my applications)
GET    /api/v1/applications/:id
PUT    /api/v1/applications/:id/status (employer update)

PASSPORT GUIDE
GET    /api/v1/passport/journey
GET    /api/v1/passport/today-task
GET    /api/v1/passport/daily/:dayNumber
PUT    /api/v1/passport/mark-complete/:dayNumber
GET    /api/v1/passport/progress

BADGES
GET    /api/v1/badges
GET    /api/v1/badges/:userId
POST   /api/v1/badges/check-trigger
POST   /api/v1/badges/:id/claim

EVENTS
GET    /api/v1/events
POST   /api/v1/events (create)
GET    /api/v1/events/:id
POST   /api/v1/events/:id/check-in
GET    /api/v1/events/:id/attendees

SEARCH
GET    /api/v1/search/jobs
GET    /api/v1/search/profiles

NOTIFICATIONS
GET    /api/v1/notifications
PUT    /api/v1/notifications/:id/read
DELETE /api/v1/notifications/:id

ADMIN
GET    /api/v1/admin/jobs-pending
PUT    /api/v1/admin/jobs/:id/approve
PUT    /api/v1/admin/jobs/:id/reject
GET    /api/v1/admin/analytics
POST   /api/v1/admin/badges/:id/verify
```

---

## FASE 3: EXECUTE (Implementation)

### React Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   ├── auth/
│   │   ├── RegisterForm.tsx
│   │   ├── LoginForm.tsx
│   │   └── ProfileSetup.tsx
│   ├── jobs/
│   │   ├── JobList.tsx
│   │   ├── JobCard.tsx
│   │   ├── JobDetail.tsx
│   │   ├── JobFilters.tsx
│   │   └── ApplyForm.tsx
│   ├── passport/
│   │   ├── PassportGuide.tsx
│   │   ├── DailyTask.tsx
│   │   ├── PassportProgress.tsx
│   │   ├── MilestoneCard.tsx
│   │   └─ PassportTimeline.tsx
│   ├── badges/
│   │   ├── BadgeCard.tsx
│   │   ├── PassportDisplay.tsx
│   │   └── BadgeNotification.tsx
│   ├── events/
│   │   ├── EventList.tsx
│   │   ├── EventCard.tsx
│   │   ├── EventDetail.tsx
│   │   └── CheckInForm.tsx
│   └── admin/
│       ├── ModerationPanel.tsx
│       ├── Analytics.tsx
│       └── EventManagement.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useJobs.ts
│   ├── usePassport.ts
│   ├── useBadges.ts
│   ├── useEvents.ts
│   └── useFormValidation.ts
├── store/ (Redux)
│   ├── authSlice.ts
│   ├── jobSlice.ts
│   ├── passportSlice.ts
│   └── notificationSlice.ts
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   ├── jobs.service.ts
│   ├── passport.service.ts
│   ├── badges.service.ts
│   └── events.service.ts
├── pages/
│   ├── index.tsx (home)
│   ├── auth/register.tsx
│   ├── auth/login.tsx
│   ├── jobs/index.tsx
│   ├── jobs/[id].tsx
│   ├── passport/index.tsx
│   ├── profile/[userId].tsx
│   ├── profile/edit.tsx
│   ├── events.tsx
│   ├── admin/dashboard.tsx
│   └── 404.tsx
└── styles/
    ├── globals.css
    ├── amazon-theme.css
    └── components.css
```

### Daily Passport Guide Logic

```javascript
// Example: 30-Day Passport Structure

const PASSPORT_MILESTONES = [
  {
    day: 1,
    phase: "Onboarding",
    task: "Lengkapi profil dasar (foto, bio, 3 skill utama)",
    description: "Atur profil Anda agar menarik untuk employer",
    badge_unlock: "Profile Complete",
    estimated_time: "30 min"
  },
  {
    day: 3,
    phase: "Onboarding",
    task: "Tambah portfolio link & resume",
    description: "Tunjukkan karya terbaik Anda",
    recommended_action: "Upload ke portfolio site atau GitHub",
    estimated_time: "1 hour"
  },
  {
    day: 5,
    phase: "Onboarding",
    task: "Selesaikan profile (bio lengkap, bahasa, timezone)",
    badge_unlock: "Day 5 Milestone",
    estimated_time: "30 min"
  },
  {
    day: 7,
    phase: "Exploration",
    task: "Ikuti 1 event/workshop di Jogja",
    description: "Cari di tab Events, daftar & datang",
    recommended_action: "https://maps.google.com (nearby events)",
    badge_unlock: "Event Attendee",
    estimated_time: "2-3 hours"
  },
  {
    day: 10,
    phase: "Exploration",
    task: "Networking: Connect dengan 5 freelancer lain",
    description: "Gunakan networking feature untuk find freelancers similar skills",
    estimated_time: "1.5 hours"
  },
  {
    day: 15,
    phase: "Exploration",
    task: "Kunjungi 3 cafe/coworking space terbaik di Jogja",
    description: "Temukan tempat favorit untuk bekerja",
    recommended_places: ["Kopi Pendakian", "Workspace Jogja", "Macchiato"],
    estimated_time: "3 hours"
  },
  {
    day: 18,
    phase: "Action",
    task: "Submit aplikasi ke job pertama",
    description: "Jangan takut, coba apply!",
    badge_unlock: "First Application",
    estimated_time: "30 min"
  },
  {
    day: 22,
    phase: "Action",
    task: "Apply ke 3 job matching skills Anda",
    description: "Tingkatkan peluang landing project",
    estimated_time: "1 hour"
  },
  {
    day: 25,
    phase: "Action",
    task: "Jadwalkan interview atau call dengan employer",
    description: "Ambil langkah selanjutnya dalam proses",
    estimated_time: "1 hour setup"
  },
  {
    day: 28,
    phase: "Wrap-up",
    task: "Dokumentasi pengalaman Anda",
    description: "Tulis reflection di notes - apa yang dipelajari?",
    estimated_time: "30 min"
  },
  {
    day: 30,
    phase: "Wrap-up",
    task: "Finalisasi koneksi dan planning next steps",
    description: "Jadwalkan follow-up calls atau coffee session lanjutan",
    badge_unlock: "30-Day Passport Finisher",
    estimated_time: "1.5 hours"
  }
];

// Daily Recommendation Engine
const getDailyRecommendation = (userId, dayNumber) => {
  const milestone = PASSPORT_MILESTONES.find(m => m.day === dayNumber);
  
  return {
    primary_task: milestone.task,
    description: milestone.description,
    estimated_time: milestone.estimated_time,
    
    // Contextual recommendations
    nearby_events: getEventsForDay(),
    matching_jobs: getJobsByUserSkills(userId),
    suggested_readings: getArticlesForDay(dayNumber),
    community_tips: getTipsByPhase(milestone.phase),
  };
};

// Badge Earning
const checkBadgeTriggers = async (userId, actionType) => {
  const triggers = {
    'profile_complete': () => user.profile.isComplete,
    'first_application': () => applications.count >= 1,
    'event_attended': () => eventAttendance.count >= 1,
    'day_5_milestone': () => passportProgress.daysCompleted >= 5,
    'day_30_milestone': () => passportProgress.daysCompleted >= 30,
    'project_completed': () => completedProjects.count >= 1,
  };
  
  if (triggers[actionType]()) {
    // Award badge
    await createUserBadge(userId, actionType);
    // Send notification with celebration
    showBadgeEarnedPopup();
  }
};
```

---

## FASE 4: VERIFY (Testing & Quality)

### Functional Testing Checklist

```
AUTH
- [ ] Register dengan email baru ✓
- [ ] Register dengan email duplikat → Error ✓
- [ ] Login dengan credentials benar ✓
- [ ] Login dengan password salah → Error ✓
- [ ] Forgot password flow ✓
- [ ] Email verification ✓

JOB BOARD
- [ ] Browse job list dengan pagination ✓
- [ ] Filter by skill, budget, deadline ✓
- [ ] Sort by newest, budget ✓
- [ ] View job detail ✓
- [ ] Apply to job dengan validation ✓
- [ ] Application status tracking ✓
- [ ] Cannot apply twice to same job ✓

PASSPORT GUIDE
- [ ] Daily task loads correctly ✓
- [ ] Mark day as complete ✓
- [ ] Progress bar updates ✓
- [ ] Milestone badges unlock at right day ✓
- [ ] Next day task recommended after completion ✓
- [ ] Timeline view shows all 30 days ✓

EVENTS
- [ ] Browse events ✓
- [ ] Filter by date, type ✓
- [ ] Check-in with QR code ✓
- [ ] Event attendance tracked ✓
- [ ] Automatic badge on attendance ✓

ADMIN
- [ ] Job posting moderation ✓
- [ ] Approve/Reject job ✓
- [ ] Analytics dashboard loads ✓
- [ ] Badge verification works ✓
```

### Performance Targets

```
Page Load: < 2 seconds (p95)
API Response: < 200ms (p95)
Database Query: < 50ms (p95)
Concurrent Users: 5,000
Cache Hit Ratio: > 85%
Uptime: 99.9%
```

### Security Checklist

```
- [ ] JWT token expiration (24 hours)
- [ ] Password hashing (bcrypt 12 rounds)
- [ ] Rate limiting on login (5 attempts/15min)
- [ ] HTTPS enforced
- [ ] CSRF protection on state-changing endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] Admin endpoints require authentication
- [ ] Data validation on server-side
- [ ] Sensitive data not logged
```

---

## FASE 5: SHIP (Deployment & Launch)

### Deployment Strategy

```
STAGING
├─ Automated from main branch
├─ Full test suite runs
├─ Manual QA cycle (3 days)
└─ Ready for production tag

PRODUCTION
├─ Docker image built
├─ Deploy to AWS ECS
├─ Database migrations run
├─ Health check (10 min)
├─ Smoke tests pass
└─ Rollback ready
```

### Launch Plan

```
SOFT LAUNCH (Week 1)
├─ 100 beta users (invited)
├─ Monitor bugs & feedback
├─ Fix critical issues
└─ Iterate on UI/UX

PHASE 1 LAUNCH (Week 2-3)
├─ 1,000 users (Jogja freelancer community)
├─ Marketing: Instagram, WhatsApp groups
├─ Community building: Early adopter events
└─ Daily monitoring

EXPANSION (Week 4+)
├─ Growth to 10,000 users
├─ Feature refinements based on feedback
├─ New features: Direct messaging, ratings
└─ Marketing partnerships
```

### Monitoring & Analytics

```
Key Metrics:
├─ Daily active users (target: 30% of registered)
├─ Job applications per user (target: 2-3 per month)
├─ Passport completion rate (target: 60% complete 30 days)
├─ Badge earning rate (target: 80% earn at least 1 badge)
├─ Event attendance (target: 30% attend 1+ events)
├─ User retention (target: 40% return 7-day)
└─ Success rate (% landing job within 30 days)
```

---

## Key Features Details

### 1. Daily Passport Guide (Core Differentiator)

**What makes it special:**
- Not a checklist, but a **personalized guide** for freelancer life in Jogja
- Combines: onboarding, networking, skill-building, job-hunting
- Daily recommendations based on local context (nearby events, jobs, cafes)
- Visual progress tracker with milestone badges
- Community tips curated for each phase

**How it works:**
1. User completes Day 1 task (profile setup)
2. System sends notification: "Good job! Here's your Day 2 task..."
3. Task includes: primary activity + recommended events + matching jobs
4. User marks day complete when done
5. Unlock badge at key milestones (Day 5, 15, 30)

### 2. Job Board (Main Revenue Driver)

**Features:**
- Job postings from Jogja-based MSMEs & startups
- Pre-verified listings (admin review)
- Rich filtering (skill, budget, deadline, location)
- Application tracking (freelancer view)
- Contact integration (WhatsApp/Email for interviews)

**For Employers:**
- Post job → admin review → publish → receive applications
- View applicant profiles & Passport badges
- Direct contact freelancer via platform

**For Freelancers:**
- Browse matching jobs
- Quick apply with cover letter
- Track application status
- Get interview when selected

### 3. Achievement & Gamification System

**Badges:**
- Profile Complete
- First Application
- Event Attendee (verified via QR check-in)
- Day 5 Milestone Reached
- Day 30 Passport Complete
- Job Interview Secured
- Job Completed Successfully
- 5-Star Review Received
- Community Helper (helped 3+ peers)

**Passport Display:**
- Public profile shows all earned badges
- Shareable badge collection link
- Verification badge for completed milestones
- "Completed 30-Day Jogja Passport" as trust signal

**Gamification:**
- Levels: Bronze (1-3 badges) → Silver (4-6) → Gold (7-10) → Platinum (11+)
- Progress bar toward next level
- Leaderboard (opt-in) for competitive freelancers

---

## Design System (Amazon Standards)

**Colors:**
- Primary CTA: #FF9900 (Orange)
- Text: #232F3E (Dark Slate)
- Secondary: #146EB4 (Blue)
- Background: #F1F1F1 (Light Gray)
- Success: #12A54D (Green)
- Error: #DC2C1E (Red)

**Typography:**
- Headings: Bold 32px (H1) → 18px (H4)
- Body: Regular 14px
- Monospace: Code blocks

**Spacing:**
- 8px base unit
- 4, 8, 12, 16, 24, 32px common sizes

**Components:**
- Buttons (primary, secondary, tertiary)
- Cards (job card, event card, badge card)
- Forms (input, select, checkbox, textarea)
- Navigation (header, sidebar)
- Modals & dialogs

**Responsive:**
- Mobile: 320px (4 columns)
- Tablet: 768px (8 columns)
- Desktop: 1440px (12 columns)

---

## Success Metrics & Timeline

### Month 1-2: MVP Launch
- [ ] 500 registered users
- [ ] 50 job postings
- [ ] 30% daily active rate
- [ ] 0 critical bugs

### Month 3: Growth
- [ ] 5,000 registered users
- [ ] 500 job postings
- [ ] 40% monthly applications success rate
- [ ] Average 4 badges earned per user

### Month 6: Expansion
- [ ] 20,000 users
- [ ] 2,000 job postings
- [ ] 50% Passport completion rate
- [ ] 60% user retention (30-day)

### Month 12: Scale
- [ ] 100,000 users
- [ ] 10,000+ jobs posted (lifetime)
- [ ] 70% Passport completion
- [ ] 5,000 jobs successfully filled

---

## Implementation Timeline

```
WEEK 1-2:  DISCUSS & DESIGN
├─ Finalize requirements
├─ Design Figma mockups
├─ Setup project repo
└─ Team kickoff

WEEK 3-4:  PLAN & SETUP
├─ Database schema
├─ API specification
├─ Component library planning
└─ Dev environment ready

WEEK 5-8:  EXECUTE PHASE 1
├─ Sprint 1: Auth + Profile (2 weeks)
├─ Sprint 2: Job Board (2 weeks)
└─ Code review & bug fixes

WEEK 9-12: EXECUTE PHASE 2
├─ Sprint 3: Passport Guide (2 weeks)
├─ Sprint 4: Events + Badges (2 weeks)
└─ Code review & bug fixes

WEEK 13-14: VERIFY
├─ Full testing
├─ Performance optimization
├─ Security audit
└─ Staging deployment

WEEK 15-16: SHIP
├─ Soft launch (100 users)
├─ Monitor & iterate
├─ Public launch
└─ Post-launch support
```

---

## Technology Stack Summary

**Frontend:**
- React.js 18
- Next.js 14
- TypeScript 5
- Tailwind CSS
- Redux Toolkit
- React Query

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- Redis
- Elasticsearch
- AWS S3

**DevOps:**
- Docker
- Vercel (Frontend)
- AWS ECS (Backend)
- GitHub Actions
- Sentry (Error tracking)

**Integrations:**
- Twilio (WhatsApp/SMS)
- SendGrid (Email)
- Firebase (Notifications & Auth)
- Google Maps API

---

## Budget Estimate

```
Team (4 people):
├─ Tech Lead (1)
├─ Frontend Dev (1)
├─ Backend Dev (1)
└─ QA/DevOps (1)

Monthly Cost: Rp 200-300M
Timeline: 4 months MVP

Total: Rp 800M - 1.2B for MVP
```

---

## Next Steps

1. **Week 1:** Finalize design mockups
2. **Week 2:** Setup development environment
3. **Week 3:** Start Sprint 1 (Auth & Profile)
4. **Week 4:** Parallel: API development
5. **Week 5+:** Continue sprints with daily standups

---

**This is the CORRECT specification for Jogja Freelance Passport - a single unified platform focused on helping freelancers find jobs and navigate life in Yogyakarta, NOT a 3-ecosystem marketplace.**
