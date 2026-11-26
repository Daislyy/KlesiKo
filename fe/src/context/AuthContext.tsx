"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi, clearSession, getSession, saveSession, type RegisterInput } from "@/api";
import type { User } from "@/types/library";

interface AuthContextType {
  user: User | null;
  ready: boolean; // false selama sesi lama sedang dicek ke backend
  login: (identifier: string, password: string) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cek token yang tersimpan ke backend (/auth/me) agar role benar-benar terverifikasi.
async function restoreSession(): Promise<User | null> {
  const saved = getSession();
  if (!saved?.token) return null;

  try {
    const fresh = await authApi.me();
    const user = { ...fresh, token: saved.token };
    saveSession(user);
    return user;
  } catch {
    clearSession();
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    restoreSession().then((restored) => {
      setUser(restored);
      setReady(true);
    });
  }, []);

  const login = async (identifier: string, password: string) => {
    const loggedIn = await authApi.login(identifier, password);
    saveSession(loggedIn);
    setUser(loggedIn);
    return loggedIn;
  };

  const register = async (input: RegisterInput) => {
    const registered = await authApi.register(input);
    saveSession(registered);
    setUser(registered);
    return registered;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return context;
}
