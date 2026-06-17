# REACT.JS IMPLEMENTATION GUIDE
## Jogja Freelance Passport - Production-Ready Code

---

## PROJECT SETUP

### Initial Setup

```bash
# Create Next.js project
npx create-next-app@latest jogja-freelance --typescript --tailwind

# Install dependencies
npm install \
  react@18 react-dom@18 next@14 typescript@5 \
  @reduxjs/toolkit@1.9 react-redux@8 \
  axios@1.6 react-query@3 react-hot-toast@2 \
  swr@2 zustand@4 date-fns@2 \
  @hookform/resolvers zod \
  next-auth@4 next-pwa@5 \
  sharp@0.33

# Dev dependencies
npm install --save-dev \
  @types/react@18 @types/node@20 \
  tailwindcss@3 postcss@8 autoprefixer@10 \
  prettier@3 eslint@8 \
  jest@29 @testing-library/react@14 \
  @testing-library/jest-dom@6
```

---

## PROJECT STRUCTURE

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css
│   ├── auth/
│   │   ├── register/page.tsx
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── jobs/
│   │   ├── page.tsx        # Job listing
│   │   ├── [id]/page.tsx   # Job detail
│   │   ├── apply/page.tsx
│   │   └── layout.tsx
│   ├── passport/
│   │   ├── page.tsx        # Passport guide
│   │   ├── [day]/page.tsx
│   │   └── layout.tsx
│   ├── profile/
│   │   ├── [userId]/page.tsx
│   │   ├── edit/page.tsx
│   │   └── layout.tsx
│   ├── events/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── moderation/page.tsx
│   │   └── analytics/page.tsx
│   └── api/
│       ├── auth/route.ts
│       ├── jobs/route.ts
│       ├── applications/route.ts
│       ├── passport/route.ts
│       └── [...]
│
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   ├── jobs/
│   │   ├── JobList.tsx
│   │   ├── JobCard.tsx
│   │   ├── JobDetail.tsx
│   │   ├── JobFilters.tsx
│   │   └── ApplyForm.tsx
│   ├── passport/
│   │   ├── PassportGuide.tsx
│   │   ├── DailyTask.tsx
│   │   ├── MilestoneCard.tsx
│   │   └── PassportProgress.tsx
│   ├── badges/
│   │   ├── BadgeCard.tsx
│   │   ├── BadgeDisplay.tsx
│   │   └── BadgeNotification.tsx
│   └── layout/
│       ├── MainLayout.tsx
│       └── AuthLayout.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useJobs.ts
│   ├── usePassport.ts
│   ├── useBadges.ts
│   ├── useEvents.ts
│   └── useFormValidation.ts
│
├── store/ (Redux)
│   ├── index.ts
│   ├── authSlice.ts
│   ├── jobSlice.ts
│   ├── passportSlice.ts
│   └── notificationSlice.ts
│
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   ├── jobs.service.ts
│   ├── passport.service.ts
│   ├── badges.service.ts
│   └── events.service.ts
│
├── types/
│   ├── index.ts
│   ├── auth.ts
│   ├── job.ts
│   ├── application.ts
│   ├── passport.ts
│   ├── badge.ts
│   └── event.ts
│
├── utils/
│   ├── validators.ts
│   ├── formatters.ts
│   ├── constants.ts
│   └── helpers.ts
│
└── styles/
    ├── globals.css
    ├── amazon-theme.css
    └── components.css
```

---

## CORE IMPLEMENTATIONS

### 1. Redux Setup

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import jobReducer from './jobSlice';
import passportReducer from './passportSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    passport: passportReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// src/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  fullName: string;
  skills: string[];
  profilePictureUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
  },
});

export const { setUser, setToken, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
```

### 2. Axios API Instance

```typescript
// src/services/api.ts
import axios, { AxiosError, AxiosInstance } from 'axios';
import { store } from '@/store';
import { logout } from '@/store/authSlice';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Custom Hooks

```typescript
// src/hooks/useAuth.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setUser, setToken, setError, setLoading, logout } from '@/store/authSlice';
import authService from '@/services/auth.service';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector((state: RootState) => state.auth);

  const register = useCallback(
    async (email: string, password: string, fullName: string, skills: string[]) => {
      dispatch(setLoading(true));
      try {
        const response = await authService.register({ email, password, fullName, skills });
        dispatch(setToken(response.token));
        dispatch(setUser(response.user));
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        dispatch(setError(message));
        return { success: false, error: message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      dispatch(setLoading(true));
      try {
        const response = await authService.login(email, password);
        dispatch(setToken(response.token));
        dispatch(setUser(response.user));
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        dispatch(setError(message));
        return { success: false, error: message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return { user, token, isLoading, error, register, login, logout: handleLogout };
};

// src/hooks/useJobs.ts
import { useCallback, useState } from 'react';
import jobsService from '@/services/jobs.service';

interface JobFilters {
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  skills?: string[];
  page?: number;
  limit?: number;
}

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async (filters?: JobFilters) => {
    setIsLoading(true);
    try {
      const response = await jobsService.getJobs(filters);
      setJobs(response.data);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch jobs';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchJobDetail = useCallback(async (jobId: string) => {
    try {
      const job = await jobsService.getJobDetail(jobId);
      return job;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job');
      return null;
    }
  }, []);

  return { jobs, isLoading, error, fetchJobs, fetchJobDetail };
};

// src/hooks/useFormValidation.ts
import { useState, useCallback } from 'react';

interface FormErrors {
  [key: string]: string;
}

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validate: (values: T) => FormErrors
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));

      if (touched[name as keyof T]) {
        const newErrors = validate({ ...values, [name]: fieldValue });
        setErrors(newErrors);
      }
    },
    [values, validate, touched]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
      const newErrors = validate(values);
      setErrors(newErrors);
    },
    [values, validate]
  );

  const handleSubmit = useCallback(
    (callback: (values: T) => Promise<void> | void) => {
      return async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validate(values);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
          await callback(values);
        }
      };
    },
    [values, validate]
  );

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};
```

### 4. React Components

```typescript
// src/components/auth/LoginForm.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFormValidation } from '@/hooks/useFormValidation';
import toast from 'react-hot-toast';

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const validate = (values: LoginFormValues) => {
    const errors: Record<string, string> = {};

    if (!values.email || !values.email.includes('@')) {
      errors.email = 'Email tidak valid';
    }

    if (!values.password || values.password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }

    return errors;
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormValidation<LoginFormValues>(
      { email: '', password: '' },
      validate
    );

  const onSubmit = async (formValues: LoginFormValues) => {
    const result = await login(formValues.email, formValues.password);

    if (result.success) {
      toast.success('Login berhasil!');
      router.push('/jobs');
    } else {
      toast.error(result.error || 'Login gagal');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 border rounded ${
            touched.email && errors.email
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-orange-500`}
          placeholder="your@email.com"
        />
        {touched.email && errors.email && (
          <p className="text-red-600 text-xs mt-1">✕ {errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 border rounded ${
            touched.password && errors.password
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-orange-500`}
          placeholder="••••••••"
        />
        {touched.password && errors.password && (
          <p className="text-red-600 text-xs mt-1">✕ {errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-orange-500 text-white py-2 rounded font-bold hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Logging in...' : 'Masuk'}
      </button>
    </form>
  );
};

// src/components/jobs/JobCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  category: string;
  description: string;
  budget: number;
  deadline: string;
  skills: string[];
  onApply: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  company,
  category,
  description,
  budget,
  deadline,
  skills,
  onApply,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
      <div className="mb-3">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
          {category}
        </span>
      </div>

      <h3 className="text-lg font-semibold mb-1 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">{company}</p>

      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{description}</p>

      <div className="flex gap-2 mb-4 flex-wrap">
        {skills.map((skill) => (
          <span key={skill} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <span>💰 Rp {budget.toLocaleString('id-ID')}</span>
        <span>⏰ {deadline}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onApply(id)}
          className="flex-1 bg-orange-500 text-white py-2 rounded font-bold hover:bg-orange-600 transition-colors"
        >
          Lamar
        </button>
        <Link
          href={`/jobs/${id}`}
          className="flex-1 border border-gray-300 py-2 rounded font-bold hover:bg-gray-100 transition-colors text-center"
        >
          Detail
        </Link>
      </div>
    </div>
  );
};

// src/components/passport/DailyTask.tsx
'use client';

import React from 'react';

interface DailyTaskProps {
  day: number;
  task: string;
  description: string;
  estimatedTime: string;
  completed: boolean;
  onComplete: () => void;
}

export const DailyTask: React.FC<DailyTaskProps> = ({
  day,
  task,
  description,
  estimatedTime,
  completed,
  onComplete,
}) => {
  return (
    <div className={`border-l-4 p-6 rounded-lg ${completed ? 'bg-green-50 border-green-500' : 'bg-white border-orange-500'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Day {day}: {task}</h3>
          <p className="text-gray-700">{description}</p>
        </div>
        {completed && <span className="text-2xl">✓</span>}
      </div>

      <p className="text-sm text-gray-600 mb-4">⏱️ Estimasi: {estimatedTime}</p>

      {!completed && (
        <button
          onClick={onComplete}
          className="bg-orange-500 text-white px-6 py-2 rounded font-bold hover:bg-orange-600 transition-colors"
        >
          Tandai Selesai
        </button>
      )}
    </div>
  );
};

// src/components/badges/BadgeCard.tsx
'use client';

import React from 'react';

interface BadgeCardProps {
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  name,
  icon,
  description,
  earned,
  earnedAt,
}) => {
  return (
    <div className={`text-center p-6 rounded-lg border-2 ${
      earned
        ? 'border-yellow-400 bg-yellow-50'
        : 'border-gray-300 bg-gray-50 opacity-40 grayscale'
    }`}>
      <div className={`text-6xl mb-3 ${earned ? 'animate-pulse' : ''}`}>
        {icon}
      </div>
      <h4 className="font-bold text-gray-900 mb-1">{name}</h4>
      <p className="text-xs text-gray-600 mb-3">{description}</p>
      {earned && earnedAt && (
        <p className="text-xs text-green-600 font-semibold">✓ Earned {earnedAt}</p>
      )}
    </div>
  );
};
```

### 5. API Route Handler (Next.js)

```typescript
// src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const offset = (page - 1) * limit;

    const jobs = await db.query(
      `SELECT * FROM job_postings 
       WHERE status = 'active'
       ${category ? 'AND category = $1' : ''}
       ORDER BY created_at DESC
       LIMIT $${category ? 2 : 1} OFFSET $${category ? 3 : 2}`,
      category ? [category, limit, offset] : [limit, offset]
    );

    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM job_postings WHERE status = 'active'`
    );

    return NextResponse.json({
      data: jobs,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(token);
    const body = await request.json();

    // Validation
    if (!body.title || !body.description || !body.contact_whatsapp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const jobPosting = await db.query(
      `INSERT INTO job_postings (employer_id, title, description, category, budget, deadline, contact_whatsapp, contact_email, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending_review', NOW())
       RETURNING *`,
      [user.id, body.title, body.description, body.category, body.budget, body.deadline, body.contact_whatsapp, body.contact_email]
    );

    return NextResponse.json(jobPosting[0], { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## TESTING

```typescript
// src/__tests__/components/JobCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { JobCard } from '@/components/jobs/JobCard';

describe('JobCard', () => {
  const mockJob = {
    id: '1',
    title: 'React Developer',
    company: 'Tech Startup',
    category: 'Web Development',
    description: 'Looking for a React developer',
    budget: 5000000,
    deadline: '30 days',
    skills: ['React', 'TypeScript'],
  };

  it('renders job information correctly', () => {
    const onApply = jest.fn();
    render(
      <JobCard {...mockJob} onApply={onApply} />
    );

    expect(screen.getByText(mockJob.title)).toBeInTheDocument();
    expect(screen.getByText(mockJob.company)).toBeInTheDocument();
  });

  it('calls onApply when button is clicked', () => {
    const onApply = jest.fn();
    render(
      <JobCard {...mockJob} onApply={onApply} />
    );

    fireEvent.click(screen.getByText('Lamar'));
    expect(onApply).toHaveBeenCalledWith(mockJob.id);
  });
});
```

---

## PERFORMANCE OPTIMIZATION

```typescript
// Use React.memo for components
const JobCard = React.memo(({ id, title, ...props }: JobCardProps) => {
  return (/* ... */);
});

// Use useMemo for expensive computations
const memoizedJobs = useMemo(() => {
  return jobs.filter(job => job.budget > minBudget);
}, [jobs, minBudget]);

// Use useCallback to memoize functions
const handleApply = useCallback((jobId: string) => {
  // apply logic
}, [dependencies]);

// Code splitting with dynamic imports
const AdminDashboard = dynamic(
  () => import('@/components/admin/AdminDashboard'),
  { ssr: false }
);
```

---

## DEPLOYMENT (VERCEL)

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url",
    "DATABASE_URL": "@database_url",
    "JWT_SECRET": "@jwt_secret"
  }
}
```

---

This is a production-ready React implementation for the Jogja Freelance Passport platform.
