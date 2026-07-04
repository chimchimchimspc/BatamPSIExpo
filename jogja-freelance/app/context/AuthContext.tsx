"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  api,
  getToken,
  setToken,
  clearToken,
  type ApiUser,
  type RegisterInput,
} from "../lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapUser(u: ApiUser): User {
  return {
    id: u.id,
    name: u.full_name,
    email: u.email,
    role: u.role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Restore session from a saved token on first load.
  useEffect(() => {
    if (!getToken()) return;
    let active = true;
    setIsLoading(true);
    api
      .me()
      .then((u) => {
        if (active) setUser(mapUser(u));
      })
      .catch(() => {
        clearToken();
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await api.login(email, password);
      setToken(result.token);
      setUser(mapUser(result.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (input: RegisterInput) => {
    setIsLoading(true);
    try {
      const result = await api.register(input);
      setToken(result.token);
      setUser(mapUser(result.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth harus digunakan dalam AuthProvider");
  }
  return context;
}
