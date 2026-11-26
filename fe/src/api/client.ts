import type { User } from "@/types/library";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SESSION_KEY = "klesiko_session";

// ---------- Session (user + token) di localStorage ----------

export function getSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? (JSON.parse(saved) as User) : null;
  } catch {
    return null;
  }
}

export function saveSession(user: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ---------- Request helper berbasis native fetch ----------

async function request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getSession()?.token;
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.");
  }

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.message || `Permintaan gagal (${response.status}).`);
  }
  return json as T;
}

export const api = {
  get: <T>(endpoint: string) => request<T>("GET", endpoint),
  post: <T>(endpoint: string, body?: unknown) => request<T>("POST", endpoint, body),
  put: <T>(endpoint: string, body?: unknown) => request<T>("PUT", endpoint, body),
  patch: <T>(endpoint: string, body?: unknown) => request<T>("PATCH", endpoint, body),
  delete: <T>(endpoint: string) => request<T>("DELETE", endpoint),
};
