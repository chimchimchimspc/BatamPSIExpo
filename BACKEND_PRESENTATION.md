# 🚀 Jogja Freelance Passport - Backend & Database Presentation

**Project**: Batam PSI Expo Platform  
**Version**: 1.0.0  
**Date**: June 2026

---

## 📋 Daftar Isi
1. [Ringkasan Proyek](#ringkasan-proyek)
2. [Arsitektur Sistem](#arsitektur-sistem)
3. [Database Schema](#database-schema)
4. [Backend Structure](#backend-structure)
5. [API Endpoints](#api-endpoints)
6. [Fitur Utama](#fitur-utama)
7. [Technology Stack](#technology-stack)
8. [Security & Best Practices](#security--best-practices)
9. [Deployment](#deployment)

---

## Ringkasan Proyek

### Apa itu Jogja Freelance Passport?
Platform digital yang menghubungkan **freelancer** dan **employer** di Yogyakarta dengan sistem **30-hari Passport** untuk onboarding dan skill development.

### Target Users
- **Freelancer**: Mencari pekerjaan, mengembangkan skill, tracking progress
- **Employer**: Posting job, review aplikasi, hire freelancer
- **Admin**: Manage jobs, events, badges, dan moderasi community

### Key Goals
✅ Memfasilitasi job matching antara freelancer dan employer  
✅ Tracking progress freelancer melalui 30-hari Passport  
✅ Event management dan community building  
✅ Badge system untuk motivasi dan recognition  
✅ Rating & review system untuk trust building

---

## Arsitektur Sistem

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT LAYER                           │
│              (Next.js Frontend - Port 3000)               │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────┐
│              API LAYER (Backend)                         │
│           Express.js Server - Port 5000                  │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Routes │ Controllers │ Services │ Middleware │Util  │ │
│  └────────────────────┬────────────────────────────────┘ │
└─────────────────────┬──────────────────────────────────┘
                      │
        ┌─────────────┬──────────────┐
        │             │              │
┌───────▼────┐  ┌────▼────────┐  ┌──▼──────────┐
│ PostgreSQL │  │    Redis    │  │ File Upload │
│  (Port     │  │   (Port     │  │   Storage   │
│  5432)     │  │   6379)     │  │  (AWS S3)   │
└────────────┘  └─────────────┘  └─────────────┘
```

### Architecture Layers

```
┌─────────────────────────────────────┐
│        Presentation (API)            │  HTTP Response
├─────────────────────────────────────┤
│        Controllers                   │  Business Logic
├─────────────────────────────────────┤
│        Services                      │  Core Functionality
├─────────────────────────────────────┤
│        Middleware & Utils            │  Cross-cutting Concerns
├─────────────────────────────────────┤
│        Database Layer (pg client)    │  Data Access
├─────────────────────────────────────┤
│        PostgreSQL Database           │  Persistent Storage
└─────────────────────────────────────┘
```

---

## Database Schema

### Overview
**Database**: PostgreSQL 15+  
**Total Tables**: 18 core tables + junctions  
**Features**: Triggers, Indexes, Constraints

### 1. Core User Tables

#### `users` - Central user registry
```
Columns:
├── id (UUID) - Primary Key
├── email (VARCHAR) - UNIQUE
├── password_hash (VARCHAR)
├── full_name (VARCHAR)
├── phone, city
├── role (ENUM) - freelancer | employer | admin
├── is_verified, is_email_verified
├── last_login, created_at, updated_at
└── password_reset_token, email_verification_token
```

**Indexing**: email, role, created_at  
**Triggers**: Auto-update updated_at

#### `freelancer_profiles` - Extended data for freelancers
```
Columns:
├── id (UUID)
├── user_id (UUID) - UNIQUE FOREIGN KEY
├── bio, profile_picture_url, portfolio_url
├── level (ENUM) - Bronze | Silver | Gold | Platinum
├── rating (DECIMAL 0-5), review_count, completed_projects
├── total_earnings
├── passport_days_completed, passport_start_date
└── created_at, updated_at
```

**Indexing**: user_id, rating DESC, level

#### `employer_profiles` - Extended data for employers/companies
```
Columns:
├── id (UUID)
├── user_id (UUID) - UNIQUE FOREIGN KEY
├── company_name, industry, company_description
├── company_logo_url, website_url, location
├── total_jobs_posted, total_hired
└── created_at, updated_at
```

---

### 2. Skills & Jobs Tables

#### `skills` - Master skill registry
```
Columns:
├── id (UUID)
├── name (VARCHAR) - UNIQUE
├── category (VARCHAR)
└── created_at
```

**Sample Skills**: React, Vue.js, Node.js, Laravel, Figma, Flutter, etc.

#### `user_skills` - Junction table (User ↔ Skills)
```
PRIMARY KEY: (user_id, skill_id)
Many-to-many relationship untuk skill profil freelancer
```

#### `job_postings` - Job listings from employers
```
Columns:
├── id (UUID)
├── employer_id (UUID) - FOREIGN KEY
├── title, description, category_id
├── budget_min, budget_max, budget_type (fixed | hourly)
├── deadline_days, deadline_date, location, location_type
├── experience_level (Junior | Mid | Senior)
├── contact_whatsapp, contact_email
├── status (ENUM) - draft | pending_review | active | closed | rejected
├── view_count, application_count
├── admin_notes, reviewed_by, reviewed_at
└── created_at, updated_at
```

**Indexing**: status, employer_id, category_id, created_at, deadline_date, budget_max, location_type

#### `job_skills` - Junction table (Job ↔ Skills)
```
PRIMARY KEY: (job_id, skill_id)
Persyaratan skill untuk setiap job posting
```

#### `job_requirements` - Free-text requirements per job
```
Columns:
├── id (UUID)
├── job_id (UUID) - FOREIGN KEY
├── requirement (TEXT)
└── order_index (INT)
```

---

### 3. Applications & Workflow Tables

#### `applications` - Job applications dari freelancer
```
Columns:
├── id (UUID)
├── job_id (UUID) - FOREIGN KEY
├── freelancer_id (UUID) - FOREIGN KEY
├── cover_letter (TEXT, max 300 chars) - CHECK constraint
├── status (ENUM) - pending | reviewed | accepted | rejected | expired
├── submitted_at, reviewed_at
├── expires_at (DEFAULT: NOW() + 14 days)
└── UNIQUE(job_id, freelancer_id)
```

**Auto-expire**: Applications otomatis expire after 14 days  
**Indexing**: job_id, freelancer_id, status, submitted_at DESC

#### `reviews` - Peer reviews setelah job completion
```
Columns:
├── id (UUID)
├── reviewer_id (UUID) - FOREIGN KEY
├── reviewee_id (UUID) - FOREIGN KEY
├── job_id (UUID) - FOREIGN KEY
├── rating (INT) - CHECK 1-5
├── comment (TEXT)
├── created_at
└── UNIQUE(reviewer_id, reviewee_id, job_id)
```

---

### 4. Passport Progress Tables (30-Day Journey)

#### `passport_progress` - User's 30-day journey state
```
Columns:
├── id (UUID)
├── user_id (UUID) - UNIQUE FOREIGN KEY
├── current_day (INT) - CHECK 1-30
├── start_date (DATE)
├── completed_at (TIMESTAMP)
├── level (ENUM) - Bronze | Silver | Gold | Platinum
├── created_at, updated_at
```

**Tracking**: Overall progress sa 30-day Passport program

#### `passport_day_completions` - Which days user has finished
```
Columns:
├── id (UUID)
├── user_id (UUID) - FOREIGN KEY
├── day_number (INT) - CHECK 1-30
├── completed_at (TIMESTAMP)
├── notes (TEXT)
└── UNIQUE(user_id, day_number)
```

**Sync Trigger**: Automatically updates `freelancer_profiles.passport_days_completed`

---

### 5. Badges & Recognition Tables

#### `badges` - Master badge definitions
```
Columns:
├── id (UUID)
├── name (VARCHAR) - UNIQUE
├── icon (VARCHAR)
├── description (TEXT)
├── rarity (ENUM) - common | uncommon | rare | legendary
├── trigger_condition (ENUM):
│   ├── profile_complete
│   ├── first_application
│   ├── event_attended
│   ├── day_5_milestone
│   ├── day_15_milestone
│   ├── day_30_complete
│   ├── job_completed
│   └── community_helper
├── requires_admin_verification (BOOLEAN)
└── created_at
```

**Pre-seeded Badges**:
- 🏅 Profile Complete (common)
- 📅 Day 5 Milestone (uncommon)
- 🎤 Event Attendee (common)
- ⭐ Day 15 Milestone (rare)
- 🎯 First Application (common)
- 💼 Job Completed (uncommon)
- 🤝 Community Helper (rare)
- 🏆 30-Day Passport Finisher (legendary)

#### `user_badges` - Earned badges by users
```
Columns:
├── id (UUID)
├── user_id (UUID) - FOREIGN KEY
├── badge_id (UUID) - FOREIGN KEY
├── earned_at (TIMESTAMP)
├── verified_by (UUID) - FOREIGN KEY (admin)
├── verified_at (TIMESTAMP)
├── is_active (BOOLEAN)
└── UNIQUE(user_id, badge_id)
```

---

### 6. Events & Community Tables

#### `events` - Community events di Yogyakarta
```
Columns:
├── id (UUID)
├── title, description
├── type (ENUM) - workshop | meetup | coffee_chat | networking
├── event_date, event_time
├── duration_minutes (DEFAULT: 60)
├── location_name, location_address
├── latitude, longitude
├── organizer_id (UUID), organizer_name
├── image_url
├── attendee_limit, attendee_count
├── check_in_code (VARCHAR) - UNIQUE
├── is_free (BOOLEAN), price (DECIMAL)
├── registration_url
└── created_at, updated_at
```

**Indexing**: event_date, type, organizer_id

#### `event_skills` - Junction table (Event ↔ Skills)
```
PRIMARY KEY: (event_id, skill_id)
Skills yang relevan untuk setiap event
```

#### `event_attendance` - RSVP + QR check-in
```
Columns:
├── id (UUID)
├── event_id (UUID) - FOREIGN KEY
├── user_id (UUID) - FOREIGN KEY
├── rsvp_at (TIMESTAMP)
├── checked_in (BOOLEAN)
├── checked_in_at (TIMESTAMP)
├── badge_awarded (BOOLEAN)
└── UNIQUE(event_id, user_id)
```

**Sync Trigger**: Automatically updates `events.attendee_count`

---

### 7. Notifications Table

#### `notifications` - User notifications
```
Columns:
├── id (UUID)
├── user_id (UUID) - FOREIGN KEY
├── type (ENUM):
│   ├── job_match
│   ├── application_update
│   ├── badge_earned
│   ├── event_reminder
│   ├── daily_task
│   ├── job_approved
│   └── job_rejected
├── title (VARCHAR)
├── message (TEXT)
├── is_read (BOOLEAN)
├── related_id (UUID) - reference to job, application, etc.
├── related_type (VARCHAR) - 'job', 'application', 'badge', etc.
└── created_at
```

**Indexing**: user_id, is_read, created_at DESC  
**Unread Partial Index**: `WHERE is_read = FALSE`

---

### 8. Job Categories

#### `job_categories` - Job category master data
```
Columns:
├── id (UUID)
├── name (VARCHAR) - UNIQUE
├── icon (VARCHAR) - emoji
└── created_at
```

**Pre-seeded**: Web Development, UI/UX Design, Mobile Development, Content Writing, Video Editing, Social Media, Logo Design, Photography, Data Entry

---

### Database Statistics

| Table | Purpose | Cardinality |
|-------|---------|-------------|
| users | Core users | ~5-10k per region |
| freelancer_profiles | Freelancer extended data | ~3-5k |
| employer_profiles | Company data | ~1-2k |
| job_postings | Active & closed jobs | ~5-10k |
| applications | Job applications | ~20-50k |
| badges | Badge definitions | ~8 (static) |
| user_badges | Earned badges | ~5-20k |
| events | Community events | ~50-100/year |
| event_attendance | RSVP records | ~1-5k |
| notifications | User notifications | ~100k+ (high volume) |

---

## Backend Structure

### Directory Structure
```
backend/
├── src/
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Server entry point
│   ├── config/
│   │   └── database.js           # PostgreSQL connection pool
│   ├── routes/
│   │   ├── index.js              # Route aggregator
│   │   ├── auth.routes.js        # Authentication routes
│   │   ├── profile.routes.js     # User profile routes
│   │   ├── jobs.routes.js        # Job posting routes
│   │   ├── applications.routes.js # Job application routes
│   │   ├── passport.routes.js    # Passport progress routes
│   │   ├── badges.routes.js      # Badge routes
│   │   ├── events.routes.js      # Event routes
│   │   ├── notifications.routes.js
│   │   └── admin.routes.js       # Admin-only routes
│   ├── controllers/              # Business logic handlers
│   │   ├── auth.controller.js
│   │   ├── profile.controller.js
│   │   ├── jobs.controller.js
│   │   ├── applications.controller.js
│   │   ├── passport.controller.js (MODIFIED - git status)
│   │   ├── badges.controller.js
│   │   ├── events.controller.js
│   │   ├── notifications.controller.js
│   │   └── admin.controller.js
│   ├── services/                 # Data access & business rules
│   │   ├── auth.service.js
│   │   ├── badge.service.js
│   │   ├── passport.service.js
│   │   ├── notification.service.js
│   │   └── ...
│   ├── middleware/               # Request/response processing
│   │   ├── auth.middleware.js    # JWT verification
│   │   ├── error.middleware.js   # Error handling
│   │   ├── validate.middleware.js# Input validation
│   │   └── rateLimiter.middleware.js # Rate limiting
│   ├── utils/                    # Utility functions
│   │   ├── response.util.js      # Standardized response format
│   │   ├── jwt.util.js           # JWT token generation
│   │   └── ...
│   └── uploads/                  # Temporary file storage
├── database/
│   ├── schema.sql                # PostgreSQL schema (DDL)
│   └── seed.sql                  # Initial data (DML)
├── package.json                  # Dependencies
├── Dockerfile                    # Container image definition
└── .dockerignore                 # Docker build exclusions
```

### Layered Architecture Pattern

```
Request Flow:
┌────────────┐
│   Route    │ ← Handles HTTP method + path
├────────────┤
│ Middleware │ ← Auth, validation, rate limiting
├────────────┤
│ Controller │ ← Receives request, calls service
├────────────┤
│  Service   │ ← Business logic, data manipulation
├────────────┤
│  Database  │ ← Query execution via pg client
└────────────┘
     ↓
┌────────────┐
│  Response  │ ← Standardized JSON via response.util.js
└────────────┘
```

---

## API Endpoints

### 1. Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/register` | Register user (freelancer/employer) | ❌ |
| POST | `/login` | Login user | ❌ |
| POST | `/refresh-token` | Refresh access token | ❌ |
| POST | `/forgot-password` | Request password reset | ❌ |
| POST | `/reset-password` | Reset password with token | ❌ |
| POST | `/verify-email` | Verify email address | ❌ |

**Response Format**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "freelancer"
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

### 2. Profile Routes (`/api/v1/profile`)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/` | Get current user profile | ✅ |
| PUT | `/` | Update profile | ✅ |
| PUT | `/avatar` | Upload profile picture | ✅ |
| GET | `/:userId` | Get public profile | ❌ |
| POST | `/skills` | Add skills to profile | ✅ |
| DELETE | `/skills/:skillId` | Remove skill | ✅ |

---

### 3. Job Routes (`/api/v1/jobs`)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/` | List jobs (with filters) | ❌ |
| POST | `/` | Create job posting | ✅ (employer) |
| GET | `/:jobId` | Get job details | ❌ |
| PUT | `/:jobId` | Update job posting | ✅ (employer) |
| DELETE | `/:jobId` | Delete job posting | ✅ (employer) |
| GET | `/search` | Advanced search | ❌ |

**Filters Supported**:
- `category`: Job category
- `experience_level`: Junior, Mid, Senior
- `budget_min`, `budget_max`: Budget range
- `location_type`: Remote, Onsite, Hybrid
- `status`: active, closed, etc.
- `sort`: newest, highest_budget, most_viewed

---

### 4. Application Routes (`/api/v1/applications`)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/` | Submit job application | ✅ (freelancer) |
| GET | `/` | List my applications | ✅ (freelancer) |
| GET | `/job/:jobId` | List applications for job | ✅ (employer) |
| PUT | `/:appId` | Update application status | ✅ (employer) |
| DELETE | `/:appId` | Withdraw application | ✅ (freelancer) |
| GET | `/:appId` | Get application details | ✅ |

**Application Statuses**: pending → reviewed → accepted/rejected → expired (auto after 14 days)

---

### 5. Passport Routes (`/api/v1/passport`)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/` | Get passport progress | ✅ |
| POST | `/complete-day/:dayNumber` | Mark day as complete | ✅ |
| GET | `/days` | Get all day completions | ✅ |
| POST | `/start` | Start 30-day journey | ✅ |
| PUT | `/level` | Update level (by system) | ✅ (admin) |

**Milestones**: 
- Day 5 → Uncommon Badge
- Day 15 → Rare Badge
- Day 30 → Legendary Badge + level up potential

---

### 6. Badge Routes (`/api/v1/badges`)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/` | List all badges | ❌ |
| GET | `/user` | My earned badges | ✅ |
| GET | `/:userId/badges` | User's earned badges | ❌ |
| POST | `/verify/:badgeId/:userId` | Admin verify badge | ✅ (admin) |

---

### 7. Event Routes (`/api/v1/events`)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/` | List events | ❌ |
| POST | `/` | Create event | ✅ (admin/organizer) |
| GET | `/:eventId` | Get event details | ❌ |
| PUT | `/:eventId` | Update event | ✅ (organizer) |
| POST | `/:eventId/rsvp` | RSVP to event | ✅ |
| POST | `/:eventId/check-in` | QR check-in | ✅ |
| GET | `/:eventId/attendees` | List attendees | ✅ (organizer) |

---

### 8. Notification Routes (`/api/v1/notifications`)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/` | Get my notifications | ✅ |
| PUT | `/:notifId/read` | Mark as read | ✅ |
| DELETE | `/:notifId` | Delete notification | ✅ |
| GET | `/unread/count` | Unread notification count | ✅ |

---

### 9. Admin Routes (`/api/v1/admin`)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/jobs/pending` | List pending job approvals | ✅ (admin) |
| PUT | `/jobs/:jobId/approve` | Approve job posting | ✅ (admin) |
| PUT | `/jobs/:jobId/reject` | Reject job posting | ✅ (admin) |
| GET | `/users` | List all users | ✅ (admin) |
| PUT | `/users/:userId/role` | Change user role | ✅ (admin) |
| GET | `/statistics` | Platform statistics | ✅ (admin) |

---

## Fitur Utama

### 1. 🔐 Authentication & Authorization
- **Registration**: Separate flows untuk freelancer vs employer
- **JWT Tokens**: Access token (24h) + Refresh token (7d)
- **Password Reset**: Email-based token flow
- **Role-Based Access**: freelancer, employer, admin roles
- **Email Verification**: Optional verification workflow

### 2. 👤 User Profiles
- **Freelancer Profiles**: Bio, portfolio, skills, ratings, earnings tracking
- **Employer Profiles**: Company info, hiring history
- **Profile Pictures**: AWS S3 integration
- **Skill Management**: Add/remove skills from master list

### 3. 💼 Job Marketplace
- **Job Posting**: Employers post jobs dengan detailed info
- **Job Search & Filter**: Category, experience level, budget, location type
- **Job Status Workflow**: draft → pending_review → active → closed/rejected
- **Admin Review**: Jobs require admin approval sebelum publish
- **Job Requirements**: Free-text requirements per job
- **Skill Matching**: Jobs linked to required skills

### 4. 📋 Application System
- **Apply to Jobs**: Freelancers submit applications dengan cover letter (max 300 chars)
- **Application Tracking**: Status: pending → reviewed → accepted/rejected
- **Auto-Expiry**: Applications expire after 14 days
- **Application Counter**: Auto-increments job application count
- **Prevent Duplicates**: UNIQUE constraint on (job_id, freelancer_id)

### 5. 🎫 30-Day Passport System
- **Onboarding Journey**: 4-phase program (Onboarding, Eksplorasi, Action, Wrap-up)
- **Day Completion Tracking**: Record completion per day
- **Level Progression**: Bronze → Silver → Gold → Platinum
- **Milestone Achievements**: Day 5, 15, 30 milestones
- **Passport Sync**: Automatically updates freelancer profile progress

### 6. 🏆 Badge & Recognition System
- **Auto-triggered Badges**: 
  - ✅ Profile Complete (when profile 100% filled)
  - 📅 Day 5, 15, 30 Milestones (automatic)
  - 🎯 First Application (on first job apply)
  - 💼 Job Completed (after job completion)
  - 🎤 Event Attended (with admin verification)
  - 🤝 Community Helper (manual nomination)
  - 🏆 Legendary 30-Day Finisher
- **Admin Verification**: Some badges require admin approval
- **Badge Rarity**: common, uncommon, rare, legendary

### 7. 🎤 Event Management
- **Event Types**: Workshop, meetup, coffee chat, networking
- **RSVP System**: Users dapat reserve tempat
- **QR Check-in**: Physical attendance validation
- **Location Tracking**: Latitude/longitude untuk mapping
- **Attendee Management**: Track attendance count
- **Event Skills**: Tag skills relevan untuk setiap event
- **Badge on Check-in**: Potentially award badges sa attendance

### 8. 📢 Notification System
- **Push Notifications**: Job matches, application updates, badge earning
- **Notification Types**: 
  - job_match
  - application_update
  - badge_earned
  - event_reminder
  - daily_task
  - job_approved
  - job_rejected
- **Unread Tracking**: Users dapat track unread notifications
- **Related References**: Link notifications ke job/application/badge

### 9. ⭐ Review & Rating System
- **Peer Reviews**: After job completion, both parties can review
- **Rating Scale**: 1-5 stars
- **Review Uniqueness**: Prevent duplicate reviews via UNIQUE constraint
- **Rating Calculation**: Aggregate user ratings in freelancer_profiles
- **Review Count**: Track number of reviews received

### 10. 🔒 Security & Rate Limiting
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs dengan salt 12
- **CORS Protection**: Configurable CORS origins
- **Helmet.js**: HTTP security headers
- **Rate Limiting**: 
  - Global: 100 requests per 15 minutes
  - Login-specific: 5 attempts per 15 minutes
- **Input Validation**: express-validator untuk semua inputs
- **SQL Injection Prevention**: Parameterized queries (pg)

---

## Technology Stack

### Backend
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | Node.js | 18.0.0+ | JavaScript runtime |
| **Framework** | Express.js | ^4.19.2 | Web framework |
| **Database** | PostgreSQL | 15+ | Relational database |
| **Cache** | Redis | 7+ | In-memory caching |
| **Auth** | JWT | jsonwebtoken ^9.0.2 | Token-based auth |
| **Password** | bcryptjs | ^2.4.3 | Password hashing |
| **Validation** | express-validator | ^7.1.0 | Input validation |
| **Security** | Helmet | ^7.1.0 | HTTP security |
| **Rate Limit** | express-rate-limit | ^7.3.1 | Rate limiting |
| **File Upload** | multer | ^1.4.5 | File upload handling |
| **CORS** | cors | ^2.8.5 | CORS middleware |
| **UUID** | uuid | ^10.0.0 | UUID generation |
| **Env** | dotenv | ^16.4.5 | Environment variables |
| **Dev** | nodemon | ^3.1.4 | Auto-restart on changes |

### External Services
| Service | Purpose | Config |
|---------|---------|--------|
| **AWS S3** | File storage for profile pictures, portfolios | AWS_* env vars |
| **SendGrid** | Email notifications | SENDGRID_API_KEY |
| **Redis** | Caching, session management (future) | REDIS_URL |

### Database Extensions & Features
- **UUID-OSSP**: PostgreSQL extension untuk UUID generation
- **Custom Triggers**: Auto-update timestamps, sync counters
- **Indexes**: 30+ indexes untuk query optimization
- **Constraints**: CHECK, UNIQUE, FOREIGN KEY untuk data integrity
- **Enums**: Custom PostgreSQL ENUM types untuk data validation

---

## Security & Best Practices

### Authentication & Authorization

#### JWT Token Structure
```javascript
Access Token:
{
  id: "user-uuid",
  role: "freelancer|employer|admin",
  email: "user@example.com",
  iat: 1234567890,
  exp: 1234567890 + 24h
}

Refresh Token:
{
  id: "user-uuid",
  type: "refresh",
  iat: 1234567890,
  exp: 1234567890 + 7d
}
```

#### Role-Based Access Control (RBAC)
```javascript
// Middleware protection example:
router.post('/admin/jobs/:id/approve', 
  authMiddleware,                    // Must be authenticated
  requireRole('admin'),              // Must have admin role
  adminController.approveJob
);
```

#### Password Security
- Bcryptjs hashing dengan salt rounds 12
- Password reset token (expires dalam 24h)
- Email verification token

### Input Validation

```javascript
// Example validation chain
const { body, validationResult } = require('express-validator');

router.post('/applications', [
  body('job_id')
    .isUUID().withMessage('Invalid job ID'),
  body('cover_letter')
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage('Cover letter must be 10-300 characters'),
], applicationController.createApplication);
```

### Database Security
- **Parameterized Queries**: All queries use `$1, $2, ...` placeholders
- **Foreign Key Constraints**: Enforce referential integrity
- **CHECK Constraints**: Validate data at DB level (e.g., rating 0-5)
- **Transactions**: Critical operations use BEGIN/COMMIT/ROLLBACK

### API Security
- **CORS**: Configurable origins (whitelist production domains)
- **Helmet**: HTTP security headers
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Strict-Transport-Security
- **Rate Limiting**: Global + per-endpoint limits
- **HTTPS**: Enforced in production (via reverse proxy/load balancer)

### Infrastructure Security
- **Environment Variables**: Sensitive data in `.env`, not in code
- **Docker**: Non-root user (express:nodejs) for container execution
- **Database Password**: Configured via PGPASSWORD env var
- **JWT Secret**: Min 32 characters via env config

### Best Practices Implemented

✅ **Separation of Concerns**: Controllers → Services → Database layer  
✅ **Error Handling**: Centralized error middleware + try-catch  
✅ **Logging**: Query logging in development mode  
✅ **Response Format**: Standardized JSON responses via response.util.js  
✅ **Connection Pooling**: PostgreSQL pool dengan max 20 connections  
✅ **Idle Connection Timeout**: 30 seconds untuk efficient resource usage  
✅ **Connection Timeout**: 2 seconds untuk preventing hangs  
✅ **Database Triggers**: Auto-update timestamps, sync counters  
✅ **Unique Constraints**: Prevent duplicate data (email, applications, badges)  
✅ **Cascading Deletes**: ON DELETE CASCADE untuk referential integrity  

---

## Deployment

### Docker Compose Setup
Platform dapat di-deploy menggunakan Docker Compose dengan 4 services:

```yaml
Services:
├── db (PostgreSQL 15-alpine)
│   ├── Port: 5432
│   ├── Volume: db_data
│   ├── Init Scripts: schema.sql, seed.sql
│   └── Healthcheck: pg_isready
│
├── redis (Redis 7-alpine)
│   ├── Port: 6379
│   └── Healthcheck: redis-cli ping
│
├── backend (Node.js 18-alpine)
│   ├── Port: 5000
│   ├── Dependencies: db, redis (healthy)
│   ├── Healthcheck: /health endpoint
│   └── Volume: uploads/
│
└── frontend (Next.js)
    ├── Port: 3000
    ├── Dependencies: backend (healthy)
    └── ENV: NEXT_PUBLIC_API_URL

Named Volumes:
├── db_data: PostgreSQL persistent storage
└── uploads: Temporary file uploads
```

### Environment Variables

**Backend Configuration**:
```bash
# Server
PORT=5000
NODE_ENV=production

# Database
PGHOST=db
PGPORT=5432
PGDATABASE=jogja_freelance_db
PGUSER=postgres
PGPASSWORD=your_secure_password

# JWT
JWT_SECRET=your_min_32_char_secret_key_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100           # global limit
LOGIN_RATE_LIMIT_MAX=5       # login attempts

# File Upload
MAX_FILE_SIZE_MB=5

# Redis
REDIS_URL=redis://redis:6379

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@yourdomain.com

# AWS S3 (File Storage)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=your_s3_bucket
AWS_REGION=ap-southeast-1
```

### Startup Commands

```bash
# Local Development
npm install
npm run dev

# Production (Docker)
docker-compose up -d

# Database Migration
npm run db:migrate

# Database Seeding
npm run db:seed

# Health Check
curl http://localhost:5000/health
```

### Database Initialization

PostgreSQL automatically runs on startup:
1. **schema.sql** - Creates all tables, indexes, triggers, enums
2. **seed.sql** - Inserts initial data (job categories, skills, badges)

No additional setup required after `docker-compose up -d`

---

## Performance Optimization

### Database Optimizations
- **Indexes**: 30+ strategic indexes on frequently queried columns
- **Connection Pooling**: Max 20 concurrent connections
- **Query Logging**: Monitors slow queries in development
- **Partial Indexes**: Unread notifications filtered at DB level

### Caching Strategy
- **Redis Integration**: Ready for session/response caching
- **Rate Limiter Store**: Can use Redis for distributed rate limiting

### API Optimization
- **Request Size Limit**: 10MB max JSON payload
- **Pagination**: Implement offset/limit for list endpoints
- **Selective Fields**: Avoid returning all columns unnecessarily

---

## Recent Changes (Git Status)

### Modified Files
```
M  backend/src/controllers/passport.controller.js
   └─ Recently updated passport progress logic
```

### Untracked Files
```
?? .env                    (Environment configuration - not committed)
?? .env.example            (Template for .env)
?? backend/.dockerignore   (Docker build exclusions)
?? backend/Dockerfile      (Container image definition)
?? docker-compose.yaml     (Multi-container orchestration)
?? secret-JWT.txt          (JWT secret - should be .env only!)
```

### Submodules
```
m  jogja-freelance
   └─ Frontend repository (Next.js) - linked as submodule
```

---

## Kesimpulan & Key Takeaways

### Arsitektur
✅ **Clean Layered Architecture**: Routes → Controllers → Services → Database  
✅ **Scalable**: Stateless design, horizontal scaling ready  
✅ **Secure**: JWT, password hashing, rate limiting, input validation  
✅ **Maintainable**: Clear separation of concerns, well-structured codebase

### Database
✅ **Comprehensive Schema**: 18 core tables covering all business entities  
✅ **Data Integrity**: Constraints, triggers, foreign keys  
✅ **Performance**: 30+ indexes, connection pooling, optimized queries  
✅ **Future-proof**: Enum types, extensible design

### Fitur
✅ **Job Marketplace**: Complete posting, search, apply workflow  
✅ **30-Day Passport**: Gamified onboarding dengan milestones  
✅ **Badge System**: 8 unlockable badges untuk recognition  
✅ **Community**: Events, attendee tracking, RSVP management  
✅ **Quality Control**: Review system, rating tracking, admin moderation

### Deployment
✅ **Docker-Ready**: Complete docker-compose setup  
✅ **Production-Safe**: Environment variables, non-root user  
✅ **Health Checks**: Built-in health endpoints, container healthchecks  
✅ **Extensible**: Easy to add new services (analytics, payment, etc.)

---

## Questions & Discussion

**Slide ini menjelaskan**:
1. ✅ Arsitektur backend dan flow data
2. ✅ Struktur database PostgreSQL lengkap
3. ✅ API endpoints untuk semua fitur
4. ✅ Security best practices & implementasi
5. ✅ Technology stack & deployment strategy
6. ✅ Badge system & gamification mechanics
7. ✅ Scalability & performance optimization

**Siap untuk pertanyaan dan diskusi! 🚀**

---

*Generated: June 2026*  
*Version: 1.0.0*  
*Platform: Batam PSI Expo*
