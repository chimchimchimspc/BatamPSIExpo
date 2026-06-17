# USER JOURNEYS & WORKFLOW INTEGRATION
## Jogja Freelance Passport - Complete User Flows

---

## JOURNEY 1: Freelancer Registration & Onboarding

```
START: New freelancer opens app
│
├─ Click "Daftar sebagai Freelancer"
│  ├─ Email/Password form
│  ├─ Name + City (should be Jogja)
│  ├─ Select 3-5 skills
│  └─ Agree to terms
│
├─ Account created
│  └─ Email verification sent
│
├─ Verification email clicked
│  └─ Account activated
│
├─ Redirected to profile setup
│  ├─ Upload profile picture
│  ├─ Write bio (max 500 chars)
│  ├─ Add portfolio URL
│  └─ Confirm skills
│
├─ Profile saved
│  └─ Trigger: "Profile Complete" badge
│
├─ Directed to Passport Guide
│  ├─ Show 30-day overview
│  ├─ Day 1 task already completed
│  ├─ Today's task highlighted
│  └─ Progress bar showing 1/30 complete
│
└─ Dashboard loaded with:
   ├─ Personalized job recommendations
   ├─ Daily task card
   ├─ Upcoming events
   └─ Passport progress
```

### Key Data Collected
- Email, password (hashed)
- Full name
- Profile picture (AWS S3)
- Bio & portfolio URL
- Skills array (3-5 selected)
- Created timestamp
- Verification status

### Database Transactions
```sql
-- User registration
INSERT INTO users (email, password_hash, full_name, city, created_at)
VALUES (...);

-- User profile
INSERT INTO user_profiles (user_id, skills, portfolio_url, ...)
VALUES (...);

-- Auto-create passport entry for Day 1
INSERT INTO passport_entries (user_id, day_number, date, task_type, task_description, ...)
VALUES (user_id, 1, TODAY(), 'onboarding', 'Lengkapi profil dasar', ...);

-- Badge trigger check
IF profile.is_complete THEN
  INSERT INTO user_badges (user_id, badge_id, earned_at)
  SELECT user_id, badges.id, NOW()
  FROM badges WHERE name = 'Profile Complete';
END IF;
```

---

## JOURNEY 2: Daily Passport Guide & Progression

```
USER OPENS APP → PASSPORT TAB
│
├─ Load current day (relative to signup date)
│  ├─ Calculate days_since_join = TODAY() - created_at
│  └─ Max day is 30
│
├─ Display today's recommended task
│  ├─ Primary action (e.g., "Join an event")
│  ├─ Description & why it matters
│  ├─ Estimated time to complete
│  ├─ Nearby events/relevant resources
│  └─ "Mark as Complete" button
│
├─ User completes task
│  ├─ Click "Tandai Selesai"
│  ├─ System records completion timestamp
│  └─ Toast: "Great job! Check tomorrow for your next task."
│
├─ Progress bar updates
│  ├─ Visually shows X/30 days complete
│  ├─ Percentage of journey done
│  └─ Next milestone badge preview
│
├─ At key milestones (Day 5, 15, 30)
│  ├─ Automatic badge unlocked
│  ├─ Celebration pop-up with animation
│  ├─ Share to social option
│  └─ Add to Passport display
│
└─ Timeline view shows all 30 days
   ├─ Completed days: ✓ (green)
   ├─ Current day: ◆ (orange)
   ├─ Future days: ○ (gray)
   └─ Click any day to see details
```

### 30-Day Milestone Breakdown

```javascript
const MILESTONES = {
  day_1: { phase: "Onboarding", task: "Profile complete", badge: "Profile Complete" },
  day_3: { phase: "Onboarding", task: "Add portfolio link", badge: null },
  day_5: { phase: "Onboarding", task: "Complete full profile", badge: "Day 5 Milestone" },
  day_7: { phase: "Exploration", task: "Attend 1 event", badge: "Event Attendee" },
  day_10: { phase: "Exploration", task: "Network with 5 freelancers", badge: null },
  day_15: { phase: "Exploration", task: "Visit 3 coffee/workspace spots", badge: "Day 15 Milestone" },
  day_18: { phase: "Action", task: "Submit first application", badge: "First Application" },
  day_22: { phase: "Action", task: "Apply to 3 jobs", badge: null },
  day_25: { phase: "Action", task: "Schedule interview", badge: null },
  day_28: { phase: "Wrap-up", task: "Write reflection", badge: null },
  day_30: { phase: "Wrap-up", task: "Finalize plans", badge: "30-Day Passport Complete" }
};
```

### Daily Recommendations Engine

```typescript
const getDailyRecommendations = (userId, dayNumber) => {
  const milestone = MILESTONES[`day_${dayNumber}`];
  const user = getUserProfile(userId);

  return {
    // Primary task
    task: milestone.task,
    description: milestone.description,
    
    // Contextual recommendations
    nearby_events: getEventsForDay(dayNumber, user.skills),
    matching_jobs: getJobsByUserSkills(user.skills, limit: 3),
    suggested_readings: getArticlesByPhase(milestone.phase),
    community_tips: getTipsByPhase(milestone.phase),
    local_resources: getNearbyPlaces(user.city, dayNumber), // Coffee shops, coworking
    
    // Motivation
    why_matters: generateMotivationMessage(milestone.phase),
    success_stories: getRelatedSuccess Stories(milestone.phase),
  };
};
```

---

## JOURNEY 3: Browsing & Applying to Jobs

```
USER NAVIGATES TO JOBS TAB
│
├─ Load job listing (paginated, 20 per page)
│  ├─ Default sort: newest first
│  ├─ Filter options visible:
│  │  ├─ Category (Web Development, UI/UX, etc.)
│  │  ├─ Budget range (slider)
│  │  ├─ Deadline (days remaining)
│  │  └─ Required skills (multi-select)
│  │
│  └─ Display job cards in grid layout
│     ├─ Category badge
│     ├─ Job title
│     ├─ Company name
│     ├─ Description (2-line preview)
│     ├─ Required skills as tags
│     ├─ Budget + deadline
│     └─ [Lamar] [Detail] buttons
│
├─ USER APPLIES FILTERS
│  ├─ Real-time filtering (debounced 500ms)
│  ├─ URL params updated for shareability
│  └─ Job list re-renders with matching results
│
├─ USER CLICKS "LAMAR"
│  ├─ Check: Is profile at least 70% complete?
│  │  └─ If NO: Show error "Lengkapi profil dulu..."
│  │
│  ├─ Check: Already applied to this job?
│  │  └─ If YES: Show "Sudah melamar pekerjaan ini"
│  │
│  ├─ Application modal opens:
│  │  ├─ Job summary (title, company, budget)
│  │  ├─ Your profile preview (what employer sees)
│  │  ├─ Text area: Cover letter (max 300 chars)
│  │  ├─ Character count indicator
│  │  └─ [Cancel] [Kirim Lamaran] buttons
│  │
│  └─ User submits application
│     ├─ POST /api/applications
│     ├─ Application record created
│     ├─ Status: "pending"
│     ├─ Timestamp recorded
│     ├─ Toast success: "Lamaran berhasil dikirim!"
│     └─ Trigger: "First Application" badge (if first ever)
│
├─ BADGE EARNED (if first application)
│  ├─ Pop-up animation
│  ├─ Celebration message
│  ├─ Badge added to Passport
│  └─ Notification sent to user
│
└─ Application tracked in dashboard
   ├─ Application list shows:
   │  ├─ Job title
   │  ├─ Company
   │  ├─ Application date
   │  ├─ Status: "Menunggu Respons"
   │  ├─ Days remaining (14-day expiry timer)
   │  └─ [Withdraw] button (if still pending)
   │
   └─ Auto-expiry after 14 days if no response
      ├─ Status changes to "Kedaluwarsa"
      └─ Notification to freelancer
```

### Application Model

```typescript
interface Application {
  id: string;
  job_id: string;
  freelancer_id: string;
  freelancer_name: string;
  freelancer_skills: string[];
  freelancer_rating: number;
  freelancer_portfolio_url?: string;
  cover_letter: string;
  submitted_at: Date;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'expired';
  reviewed_at?: Date;
  expires_at: Date; // 14 days from submission
}
```

---

## JOURNEY 4: Employer Viewing Applications

```
EMPLOYER LOGS IN → JOBS TAB → POSTED JOBS
│
├─ Shows list of employer's job postings
│  ├─ Posted jobs with status badges
│  ├─ Application count for each job
│  ├─ Last applied date
│  └─ [View Applications] button
│
├─ EMPLOYER CLICKS "VIEW APPLICATIONS"
│  ├─ Load applications list
│  ├─ Sort by: newest, rating, experience
│  ├─ Filter: all, pending, reviewed
│  │
│  └─ Application cards show:
│     ├─ Freelancer name + photo
│     ├─ Skills (relevant ones highlighted)
│     ├─ Rating (stars + count)
│     ├─ Preview of portfolio (if available)
│     ├─ Cover letter
│     ├─ Badges earned (trust signal)
│     ├─ Applied date
│     └─ [View Profile] [Contact] buttons
│
├─ EMPLOYER CONTACTS FREELANCER
│  ├─ Click [Contact] button
│  ├─ Opens WhatsApp/Email client
│  ├─ Pre-filled message with job details
│  ├─ Contact is logged in system
│  └─ Application status can be marked "reviewed"
│
└─ Employer hires freelancer
   ├─ Contact happens outside platform (WhatsApp/Email)
   ├─ Application status: "accepted"
   └─ Freelancer gets notification
```

---

## JOURNEY 5: Events & Community

```
USER NAVIGATES TO EVENTS TAB
│
├─ Load upcoming events (within 50km of Jogja)
│  ├─ Filter by:
│  │  ├─ Type (workshop, meetup, coffee chat, networking)
│  │  ├─ Date range
│  │  └─ Keywords
│  │
│  └─ Event cards display:
│     ├─ Event name
│     ├─ Type badge
│     ├─ Date & time
│     ├─ Location (map preview)
│     ├─ Organizer info
│     ├─ Attendees count / capacity
│     ├─ Description (preview)
│     └─ [Details] [RSVP] buttons
│
├─ USER CLICKS "RSVP"
│  ├─ Add to calendar
│  ├─ Get reminder notification
│  ├─ Mark as "Attending"
│  └─ See other attendees' profiles
│
├─ EVENT DATE ARRIVES
│  ├─ Check-in opens 15 mins before start
│  ├─ User opens app & taps [Check In]
│  ├─ Scan QR code (or manual code entry)
│  ├─ System confirms attendance
│  ├─ Toast: "Check-in confirmed!"
│  └─ Trigger: "Event Attendee" badge (pending admin verification)
│
├─ BADGE VERIFICATION
│  ├─ Admin reviews event attendance manually
│  ├─ Can approve or reject as fraud
│  ├─ When approved: Badge becomes active
│  └─ User notified badge verified
│
└─ After event
   ├─ User can review event
   ├─ Leave feedback
   ├─ Connect with attendees
   └─ Badge permanently added to Passport
```

---

## JOURNEY 6: Passport Profile & Badges

```
USER NAVIGATES TO PROFILE TAB
│
├─ Display public profile with:
│  ├─ Profile picture
│  ├─ Name & city (Jogja)
│  ├─ Bio
│  ├─ Skills (with proficiency levels if any)
│  ├─ Portfolio link
│  ├─ Overall rating (from jobs completed)
│  ├─ Join date
│  └─ "Edit Profile" button (only own profile)
│
├─ PASSPORT SECTION (Core differentiator)
│  ├─ "My Achievements" heading
│  ├─ Progress bar: X badges earned
│  ├─ Badge grid (6-12 badges visible)
│  │  ├─ Earned badges: Full color + unlock date
│  │  └─ Locked badges: Grayed out + "?" mark
│  │
│  ├─ Badge details on hover:
│  │  ├─ Name
│  │  ├─ Description
│  │  ├─ How to earn
│  │  └─ Earned date (if earned)
│  │
│  ├─ Badge sharing
│  │  ├─ "Share" button per badge
│  │  ├─ Generate link: "I earned [Badge Name]!"
│  │  └─ Copy to clipboard or share to social
│  │
│  └─ 30-Day Passport overview
│     ├─ Days completed: X/30
│     ├─ Current phase
│     └─ Next milestone preview
│
└─ PUBLIC PROFILE IMPACT
   ├─ Employers see badges as trust signal
   ├─ Higher badge count = higher credibility
   ├─ "30-Day Jogja Passport Completer" is premium badge
   └─ Affects job recommendations ranking
```

### Available Badges

```javascript
const BADGES = {
  PROFILE_COMPLETE: {
    name: "Profile Complete",
    icon: "✓",
    trigger: "profile is 100% complete",
    auto_award: true,
  },
  FIRST_APPLICATION: {
    name: "First Application",
    icon: "🎯",
    trigger: "first job application submitted",
    auto_award: true,
  },
  EVENT_ATTENDEE: {
    name: "Event Attendee",
    icon: "🎤",
    trigger: "event check-in with QR",
    auto_award: false, // requires admin verification
  },
  DAY_5_MILESTONE: {
    name: "Day 5 Completer",
    icon: "📅",
    trigger: "5 days of Passport completed",
    auto_award: true,
  },
  DAY_30_COMPLETE: {
    name: "30-Day Jogja Passport Completer",
    icon: "🏆",
    trigger: "all 30 days completed",
    auto_award: true,
    rare: true,
  },
  JOB_COMPLETED: {
    name: "Job Completed",
    icon: "💼",
    trigger: "successfully completed freelance job",
    auto_award: true,
  },
  HELPFUL_COMMUNITY: {
    name: "Community Helper",
    icon: "🤝",
    trigger: "helped 3+ freelancers in forum",
    auto_award: true,
  },
};
```

---

## WORKFLOW: Job Posting (For Employers/MSMEs)

```
EMPLOYER LOGS IN → CREATE JOB
│
├─ Click "Post a Job"
│  └─ Opens job creation form
│
├─ Form fields:
│  ├─ Title (required, max 100 chars)
│  ├─ Description (required, max 2000 chars)
│  ├─ Category (dropdown: Web, UI/UX, Content, etc.)
│  ├─ Required skills (multi-select)
│  ├─ Budget (optional, range slider)
│  ├─ Deadline (required, date picker, min 7 days)
│  ├─ Contact WhatsApp (required, format validation)
│  ├─ Contact Email (required, email validation)
│  └─ [Preview] [Post Job] buttons
│
├─ Form validation
│  ├─ All required fields present
│  ├─ Email format valid
│  ├─ WhatsApp format: +62xxx (10-13 digits)
│  ├─ Deadline >= 7 days from now
│  ├─ Check for duplicate jobs (last 24h)
│  │  └─ If duplicate: Alert "Proyek serupa sudah ada"
│  │
│  └─ Show preview of listing
│
├─ Job submission
│  ├─ POST /api/jobs
│  ├─ Create with status: "pending_review"
│  ├─ Send admin notification
│  └─ Show message: "Proyek dalam antrian review (24 jam)"
│
├─ Admin review (within 24h)
│  ├─ Admin sees job in moderation queue
│  ├─ Review for:
│  │  ├─ No scams or malicious content
│  │  ├─ Reasonable budget/deadline
│  │  ├─ Valid contact information
│  │  └─ No spam/test postings
│  │
│  ├─ Approve:
│  │  ├─ Status → "active"
│  │  ├─ Broadcast notification to matching freelancers:
│  │  │  ├─ Skill match check
│  │  │  ├─ Location filter (Yogyakarta)
│  │  │  └─ Send push: "Proyek baru: [Title]"
│  │  │
│  │  └─ Job visible in job board
│  │
│  └─ Reject:
│     ├─ Status → "rejected"
│     ├─ Send email to employer with reason
│     └─ Offer to resubmit with corrections
│
└─ Employer tracks applications
   └─ Dashboard shows new applications real-time
```

---

## DATA FLOW ARCHITECTURE

```
┌─────────────────────────┐
│   FREELANCER/EMPLOYER   │
│        (Client)         │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   React Frontend        │
│   - Components          │
│   - Redux State         │
│   - API Services        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Next.js API Routes    │
│   - Validation          │
│   - Authentication      │
│   - Business logic      │
└────────────┬────────────┘
             │
             ├─────→ PostgreSQL (Users, Jobs, Applications, Badges)
             │
             ├─────→ Redis (Sessions, Cache)
             │
             ├─────→ AWS S3 (Profile pictures, Documents)
             │
             └─────→ Twilio/SendGrid (Notifications)
```

---

## KEY PERFORMANCE INDICATORS

```javascript
const KPIs = {
  // Registration
  signups_per_day: "Target: 100",
  registration_completion_rate: "Target: 80%+",
  
  // Engagement
  daily_active_users: "Target: 30% of registered",
  passport_30day_completion: "Target: 60%+",
  avg_session_duration: "Target: 12+ minutes",
  
  // Job Board
  jobs_per_month: "Target: 100+",
  applications_per_job: "Target: 3-5",
  job_fill_rate: "Target: 50% in 30 days",
  
  // Community
  event_attendance_rate: "Target: 20% of users/month",
  badge_earning_rate: "Target: 80% earn 1+ badge",
  
  // Retention
  7day_retention: "Target: 40%+",
  30day_retention: "Target: 25%+",
  
  // Success
  user_to_job_success_rate: "Target: 30% get hired in 30 days",
};
```

---

This comprehensive workflow documentation ensures all user journeys are smooth, well-tracked, and lead to the core value: **Helping freelancers find opportunities and build credibility in Yogyakarta through structured guidance and gamification.**
