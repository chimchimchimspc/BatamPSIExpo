// Simple API client for the Jogja Freelance backend.
// Base URL is configurable via NEXT_PUBLIC_API_URL; defaults to the local backend.

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const TOKEN_KEY = "jfp_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export interface ApiError extends Error {
  status?: number;
  errors?: Array<{ msg?: string; path?: string }>;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    // Send the server-side session cookie (jfp.sid) with every request.
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let body: { success?: boolean; message?: string; data?: T; errors?: ApiError["errors"] } | null = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok || (body && body.success === false)) {
    const err: ApiError = new Error(
      body?.message || `Permintaan gagal (${res.status})`
    );
    err.status = res.status;
    err.errors = body?.errors;
    throw err;
  }

  // Backend wraps payloads as { success, message, data }
  return (body && "data" in body ? (body.data as T) : (body as unknown as T));
}

// ---- Types matching the backend responses ----
export interface ApiUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  city?: string;
  is_verified?: boolean;
  created_at?: string;
}

export interface AuthResult {
  user: ApiUser;
  token: string;
  refreshToken?: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  city?: string;
  role?: "freelancer" | "employer";
}

// Shape returned by GET /applications (my applications)
export interface ApiApplication {
  id: string;
  status: "pending" | "reviewed" | "accepted" | "rejected" | "expired";
  submitted_at: string;
  reviewed_at?: string | null;
  expires_at?: string | null;
  cover_letter: string;
  job_id: string;
  job_title: string;
  employer_id?: string | null;
  company?: string | null;
  category?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
}

// ---- Chat types ----
export interface ApiConversation {
  id: string;
  created_at: string;
  updated_at: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar?: string | null;
  last_message?: string | null;
  last_message_at?: string | null;
  unread_count: number;
}

export interface ApiMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export const api = {
  register: (input: RegisterInput) =>
    request<AuthResult>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  login: (email: string, password: string) =>
    request<AuthResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<ApiUser>("/auth/me"),

  applications: {
    // Submit an application to a job (freelancer only, requires auth token).
    create: (jobId: string, coverLetter: string) =>
      request<{ id: string; status: string; submitted_at: string }>("/applications", {
        method: "POST",
        body: JSON.stringify({ job_id: jobId, cover_letter: coverLetter }),
      }),

    // List the current user's applications.
    mine: () => request<ApiApplication[]>("/applications"),

    // Withdraw a pending application.
    withdraw: (id: string) =>
      request<null>(`/applications/${id}/withdraw`, { method: "DELETE" }),
  },

  chat: {
    // List my conversations (with last message + unread count).
    conversations: () => request<ApiConversation[]>("/chat/conversations"),

    // Start (or fetch existing) a 1-on-1 conversation with another user.
    start: (userId: string) =>
      request<{ id: string }>("/chat/conversations", {
        method: "POST",
        body: JSON.stringify({ user_id: userId }),
      }),

    // Messages in a conversation (also marks incoming as read).
    messages: (conversationId: string) =>
      request<ApiMessage[]>(`/chat/conversations/${conversationId}/messages`),

    // Send a message.
    send: (conversationId: string, body: string) =>
      request<ApiMessage>(`/chat/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify({ body }),
      }),
  },
};
