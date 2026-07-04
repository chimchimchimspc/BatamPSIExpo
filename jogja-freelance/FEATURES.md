# Jogja Freelance Passport — Dokumentasi Fitur

## Ringkasan Platform

**Jogja Freelance Passport** adalah platform untuk freelancer di Yogyakarta menemukan lowongan lokal, mengikuti panduan 30 hari, dan membangun kredibilitas via badge sistem. Employer dapat posting lowongan dan mengelola pelamar.

Semua data saat ini **UI-only / mocked** — tidak ada backend. Integrasi API bisa dilakukan di fase produksi.

---

## 📍 Halaman Utama & Flow

### **1. Landing Page (`/`)**

**Tujuan:** First impression, overview value proposition.

**Konten:**
- Hero section: tagline + search bar + quick skill tags
- Features section: 4 fitur utama (Jobs, Passport, Badge, Community)
- Job preview: showcase 3 lowongan terbaru
- Passport preview: contoh 30-day guide
- Badge preview: kumpulan badge yang bisa diraih
- CTA section: ajakan daftar

**Alasan layout:**
- Gradient dark (smooth purple solid) → professional, tidak agresif
- Search bar & skill tags di hero → langsung actionable
- Preview sections → educate sebelum sign up
- CTA di bawah → conversion funnel

---

### **2. Lowongan / Jobs (`/jobs`, `/jobs/[id]`)**

**Tujuan:** Browse & apply lowongan lokal, view detail per job.

**`/jobs` Features:**
- Search bar (by title/company/desc)
- Filters: kategori, budget range, deadline, skills
- Sort: terbaru, budget tertinggi, deadline terdekat, paling populer
- Job cards: title, company, budget, deadline, skills, views, rating
- Modal apply: form dengan portfolio link + cover letter
- Toast notif: apply berhasil

**Alasan layout:**
- Sidebar filter + grid cards (desktop) / stack (mobile) → familiar e-commerce UX
- Sort options → freelancer bisa prioritas by budget atau urgency
- Quick apply modal → reduce friction, tidak perlu redirect page baru
- "Lamaranku" button di atas → quick access status apply

**`/jobs/[id]` Features:**
- Full job detail: deskripsi lengkap, skills, timeline, contact
- Company info: nama, lokasi, review
- Applicant stats: berapa orang apply, berapa hire rate
- Recommended freelancers: 3 profil yang pas dengan skill
- Apply button di sticky top

**Alasan layout:**
- Hero section dengan company branding
- Left col: job detail + applicant stats (trust signal)
- Right col: quick apply CTA + company card
- Timeline/requirements jelas → reduce confusion

---

### **3. Passport / 30-Day Guide (`/passport`)**

**Tujuan:** Daily checklist untuk onboarding freelancer, unlock badge, track progress.

**Features:**
- Sidebar: progress bar, current level, badges, streak
- Main timeline: per hari ada task + tips + link event/lowongan
- Task completion: checkbox toggle, unlock badge animation
- Phase colors: Onboarding (biru), Eksplorasi (hijau), Action (oranye), Wrap-up (ungu)
- Day detail expand: tips, recommended event, lowongan cocok

**Alasan layout:**
- Vertical timeline → intuitive daily progress
- Sidebar progress → motivasi visual (level, badge count)
- Color-coded phase → quick scan mana yang sedang
- Task toggle immediately → instant gratification
- Tips & event links in-context → "next action" jelas

---

### **4. Profile (`/profile`)**

**Tujuan:** Show freelancer journey & stats, showcase badge collection.

**Features:**
- Profile header: avatar, name, level, rating, badges earned
- Passport journey: days completed, progress bar, next milestone
- Badge grid: 8 badge total, earned show golden, unearned greyscale
- Work stats: rating breakdown, completed projects, total earning, review count

**Alasan layout:**
- Avatar + level top → identity & achievement di-emphasize
- Three-column stats: days, progress, next milestone → story telling (6/30 → 15 → done)
- Badge grid 4×2 → grid terlihat lengkap tapi tidak overwhelming
- Stats section: rating + project achievements → employer trust signals

---

### **5. Events (`/events`, `/events/[id]`)**

**Tujuan:** Community events di Jogja (networking, workshop).

**`/events`:**
- Calendar filter: show events by date
- Event cards: thumbnail, title, date, attendee count, check-in status
- Attend button: toggle attendance + show badge unlock trigger

**`/events/[id]`:**
- Full event detail: description, location, time, speaker
- Attendee list dengan avatar
- Check-in modal: mark attendance, unlock badge
- Related events: 3 event sejenis

**Alasan layout:**
- Calendar filter → easy find event by time
- Attendance tracking → community engagement metric
- Check-in modal + badge unlock → creates moment of delight

---

### **6. Admin Panel (`/admin`, `/admin/jobs`, dll)**

**Tujuan:** Moderation & analytics.

**Dashboard:**
- Stats: pending jobs, active users, new applications, avg rating
- Recent activity: job approvals, new users, badge unlocks
- Quick actions: approve/reject job

**Alasan layout:**
- Sidebar navigation → standard admin convention
- Top dark bar → distinguish from main site
- Stats cards → KPI visibility
- Activity feed → at-a-glance moderation queue

---

### **7. Employer Dashboard (`/employer`)**

**Tujuan:** Employer manage jobs & applicants.

**Features:**
- Stats: active jobs, total applicants, shortlisted, total posted
- Job list: status (active/draft/closed), applicant count, deadline remaining
- Recent applicants feed: latest 4 across all jobs
- Company profile card: join date, hiring history

**Alasan layout:**
- Top banner: company branding + CTA "Post New Job" → visible & accessible
- Stats grid 4-column → KPI overview
- Job cards left, sidebar right → mimic freelancer job browse (familiar)
- Recent applicants → quick action on new submissions

**Alasan warna smooth:**
- Primary: `#7B5EA7` (muted purple) button & active state
- Accent: `#C97B4B` (warm amber) untuk stats & highlights
- Dark bg: `#2E1F5E` untuk section headers
- Light bg: `#F8F6FF` (faint lavender) untuk page background
  → Kombinasi ini **smooth & professional**, tidak seperti Amazon orange yang ngejreng

---

### **8. Post Job Form (`/employer/post-job`)**

**Tujuan:** Employer create & submit new job listing.

**Features:**
- Form sections: info dasar (title, category, desc), skills picker, budget & timeline, preferences
- Skill picker: text input + button, saran per kategori, max 6 skill
- Budget input: Rp format, validation min > 100k
- Deadline slider: 3–60 hari
- Location & experience level: radio buttons
- Form validation: required fields, min char length, budget range check
- Success screen: confirmation + ringkasan

**Alasan layout:**
- Section grouping → organize complexity
- Skill picker dengan saran → reduce cognitive load (tidak perlu invent skill names)
- Budget visual format (Rp) → clarity
- Success screen → confirm submission went through
- "Post Another" button → streamline for high-volume posters

---

### **9. Manage Applicants (`/employer/jobs/[id]/applicants`)**

**Tujuan:** Review & filter pelamar per job.

**Features:**
- Quick stats: total, shortlisted, pending
- Tab filters: Semua, Pending, Shortlisted, Ditolak
- Applicant cards:
  - Avatar gradient, name, level badge, status badge
  - Stats: rating, completed projects, badge count, passport days
  - Skills pills
  - Expandable cover note
  - Actions: Shortlist / Tolak / Reset to Pending
  - Link to view full profile
- Cards highlight green if shortlisted

**Alasan layout:**
- Tab interface → quick filter without page reload
- Card design → one applicant per "card", resembles job browsing (mirror UX)
- Level + status badges → quick visual scan (color coded)
- Stats inline → all info visible before expand
- Expand cover note → keep interface clean but show detail on demand
- Action buttons clear → Shortlist (green), Tolak (red), Reset (neutral)
- Link to profile → can deep-dive if interested

---

## 🏗️ Struktur Data

### Freelancer Data (`/app/data/`)

**`jobs.ts`:**
- `Job`: title, category, company, budget, deadline, skills, views, applicants count, rating
- `Application`: freelancer id, job id, status, date, cover letter
- Mock data: 8 jobs, 4 applications

**`passport.ts`:**
- `DayEntry`: day number, phase, task, tips, badge unlock, completed flag
- `PassportProgress`: current day, completed days, level, earned badges
- Mock: 30 days of tasks, current at day 7, completed days 1–6

**`profile.ts`:**
- `FreelancerProfile`: name, avatar, level, rating, badges, completed projects, earning
- `Badge`: name, rarity (common/uncommon/rare/legendary), unlock condition
- Mock: 1 user, 8 badges

**`events.ts`:**
- `Event`: title, date, location, attendee count, speaker
- `UserAttendance`: event id, user id, checked in flag
- Mock: 6 events

---

### Employer Data (`/app/data/`)

**`employer.ts`:**
- `EmployerJob`: title, category, budget range, deadline days, applicant count, shortlisted count, skills, description, location type, experience level
- `Applicant`: name, level, badge count, skills, rating, completed projects, applied date, status (pending/shortlisted/rejected), cover note, passport days
- Mock: 4 employer jobs, 10 applicants across jobs

---

## 🎨 Design System

### Color Palette (Smooth)

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#7B5EA7` | Buttons, active tabs, links |
| Primary Hover | `#6A4E94` | Button hover state |
| Primary Dark | `#2E1F5E` | Section headers, dark backgrounds |
| Accent | `#C97B4B` | Stats, badges, warnings, icons |
| Accent Hover | `#B56A3A` | Accent hover |
| Dark Slate | `#1E1B2E` | Text, primary dark bg |
| Light Slate | `#2E1F5E` | Card separator, divider |
| Background | `#F8F6FF` | Page background (faint lavender) |
| Border | `#EAE6F5` | Card borders, input borders |
| Text Gray | `#6B6880` | Secondary text |
| Caption | `#6B6880` | Small labels |

**Why smooth gradient replaced:**
- Old: bright orange (#FF6B35) + vivid purple (#7C3AED) → garish, tiresome
- New: warm amber (#C97B4B) + muted purple (#7B5EA7) → professional, warm, less fatiguing
- Backgrounds solid instead of gradient → focus on content, not decoration

### Typography

- Headings: Semibold / Bold, `text-xl` to `text-3xl`
- Body: Regular, `text-sm` to `text-base`
- Labels: Semibold, `text-xs` to `text-sm`
- Monospace: For pricing (Rp format)

### Spacing

- Page padding: `px-4` (mobile), `max-w-7xl` (desktop)
- Card padding: `p-5` / `p-6`
- Gap between elements: `gap-3` / `gap-4` / `gap-6`

### Icons

- **lucide-react** for all UI icons (small, clean, consistent)
- Emojis only in badges (✓, 🎤, 🌟, 🏆, etc.)

---

## 🚀 Technical Stack

- **Framework:** Next.js 16.2.9 with App Router
- **Styling:** Tailwind CSS v4 (@import syntax, no config file)
- **UI Kit:** Custom components in `/app/components/ui/`
- **Icons:** lucide-react
- **State:** React hooks (useState, useMemo, use(params))
- **Routing:** Next.js 16 dynamic routes with `use(params)` pattern
- **Dev Server:** Turbopack (running on localhost:3000)

---

## 📱 Responsive Design

- **Mobile-first:** Mobile layout default, desktop via `md:` breakpoints
- **Breakpoints:** Tailwind defaults (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- **Sidebar filters:** Hidden on mobile (toggle via "Filter" button), sidebar on md+
- **Grid layouts:** 1 col mobile, 2–4 col desktop (e.g., job cards, badge grid)
- **Navigation:** Mobile nav collapse in header, desktop nav always visible

---

## 🔄 User Flows

### Freelancer Flow

1. **Landing** (`/`) → Learn platform
2. **Register** (`/auth/register?role=freelancer`) → Create profile
3. **Browse jobs** (`/jobs`) → Filter & apply
4. **Start passport** (`/passport`) → Daily checklist
5. **Attend events** (`/events`) → Unlock badges
6. **View profile** (`/profile`) → See badges & stats
7. **Check applications** (`/jobs/applications`) → Status updates

### Employer Flow

1. **Register** (`/auth/register?role=employer`) → Create company profile
2. **Post job** (`/employer/post-job`) → Submit for approval
3. **Dashboard** (`/employer`) → Monitor submissions
4. **Review applicants** (`/employer/jobs/[id]/applicants`) → Shortlist candidates
5. **Hire** (Link to profile) → Evaluate & contact

### Admin Flow

1. **Dashboard** (`/admin`) → Overview
2. **Approve jobs** (`/admin/jobs`) → Check listing quality
3. **Manage users** (`/admin/users`) → Check compliance
4. **Monitor badges** (`/admin/badges`) → Verify unlock logic

---

## 🧪 Testing Checklist (Manual)

- [ ] Mobile: navbar collapse, filter toggle, card stack
- [ ] Filters: category, budget, skill, deadline all apply
- [ ] Job detail: recommended freelancers load correctly
- [ ] Passport: task toggle, badge animation, level calculation
- [ ] Badge grid: earned (golden pulse), unearned (grayscale)
- [ ] Employer form: validation (budget > min, desc > 50 char)
- [ ] Applicant tabs: count updates, expand/collapse smooth
- [ ] Colors: all #FF9900 replaced with #C97B4B, no loud gradients

---

## 🔮 Next Steps (Untuk Produksi)

1. **Backend API:** Implement job CRUD, application management, user auth
2. **Database:** PostgreSQL for users, jobs, applications, badges
3. **Payment:** Integrate for job escrow (optional)
4. **Real messaging:** Replace with actual chat system
5. **Search:** Full-text search, Elasticsearch (optional)
6. **Analytics:** Track user journey, completion rates
7. **Email:** Send job alerts, application updates
8. **Mobile app:** React Native wrapper (optional)

---

## 📝 File Structure

```
app/
├── page.tsx                    # Landing
├── layout.tsx                  # Root layout
├── globals.css                 # Global colors & animations
│
├── auth/
│   ├── register/page.tsx       # Freelancer & employer signup
│   ├── login/page.tsx          # Login
│   └── profile-setup/page.tsx  # Profile completion
│
├── jobs/
│   ├── page.tsx                # Job listing
│   ├── [id]/page.tsx           # Job detail
│   └── applications/page.tsx   # My applications
│
├── passport/
│   └── page.tsx                # 30-day guide
│
├── profile/
│   └── page.tsx                # Freelancer profile
│
├── events/
│   ├── page.tsx                # Event listing
│   └── [id]/page.tsx           # Event detail
│
├── employer/
│   ├── page.tsx                # Employer dashboard
│   ├── post-job/page.tsx       # Create job form
│   └── jobs/[id]/applicants/page.tsx  # Manage applicants
│
├── admin/
│   ├── layout.tsx              # Admin sidebar
│   ├── page.tsx                # Dashboard
│   ├── jobs/page.tsx           # Job moderation
│   ├── users/page.tsx          # User management
│   ├── events/page.tsx         # Event management
│   ├── badges/page.tsx         # Badge management
│   ├── analytics/page.tsx      # Analytics
│   └── settings/page.tsx       # Admin settings
│
├── components/
│   ├── ui/                     # Reusable: Button, Input, Modal, Toast, Badge, ProgressBar
│   ├── layout/                 # Header, Footer
│   ├── sections/               # Hero, Features, Job/Passport/Badge preview
│   ├── jobs/                   # JobCard, JobFilters, ApplyModal
│   ├── passport/               # DailyTaskCard, PassportSidebar, Timeline, BadgeUnlockModal
│   ├── profile/                # ProfileHeader, BadgeGrid
│   ├── events/                 # EventCard, CheckInModal
│   ├── auth/                   # RegisterForm, LoginForm, ProfileSetupForm
│   └── admin/                  # AdminSidebar, StatCards, ActivityFeed
│
└── data/
    ├── jobs.ts                 # Mock job listings & applications
    ├── passport.ts             # Mock 30-day guide & progress
    ├── profile.ts              # Mock freelancer profile & badges
    ├── events.ts               # Mock events
    ├── employer.ts             # Mock employer jobs & applicants
    └── admin.ts                # Mock admin data
```

---

## ✅ Completion Status

**All 7 Stages Complete:**

| Stage | Feature | Status |
|-------|---------|--------|
| 1 | Landing + Auth pages | ✅ Done |
| 2 | Job browse & detail | ✅ Done |
| 3 | Job applications | ✅ Done |
| 4 | Passport 30-day guide | ✅ Done |
| 5 | Profile & badges | ✅ Done |
| 6 | Events & community | ✅ Done |
| 7 | Admin dashboard | ✅ Done |
| Bonus | Employer POV (dashboard, post job, applicants) | ✅ Done |
| Color refactor | Smooth purple-amber (no garish gradients) | ✅ Done |

All UI-only, mock data, ready for backend integration.
