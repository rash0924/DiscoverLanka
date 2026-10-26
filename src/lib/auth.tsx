import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type AppRole = 'user' | 'admin';
interface AuthUser { id: string; email: string; role: AppRole }
interface Session { access_token: string; refresh_token: string; expires_at?: number; user: { id: string; email?: string } }
interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string, expectedRole?: AppRole) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const STORAGE_KEY = 'discoverlanka-auth-session';
const apiUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const configured = Boolean(apiUrl && anonKey);
const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): Session | null {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as Session | null; }
  catch { return null; }
}

export function getCurrentAccessToken(): string | null {
  return readSession()?.access_token ?? null;
}

function saveSession(session: Session | null) {
  if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else localStorage.removeItem(STORAGE_KEY);
}

async function authRequest<T>(path: string, body?: unknown, token?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiUrl}/auth/v1/${path}`, {
      method: 'POST',
      headers: { apikey: anonKey!, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error('Could not reach Supabase. Copy the Project URL from the Supabase Connect dialog into VITE_SUPABASE_URL, confirm the project is active, and check your internet connection.');
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.msg || result.message || result.error_description || 'Authentication failed.');
  return result as T;
}

async function refreshSession(session: Session): Promise<Session> {
  const refreshed = await authRequest<Session>('token?grant_type=refresh_token', { refresh_token: session.refresh_token });
  const next = { ...refreshed, expires_at: Date.now() / 1000 + (refreshed as Session & { expires_in?: number }).expires_in! };
  saveSession(next);
  return next;
}

async function getValidSession(): Promise<Session | null> {
  const session = readSession();
  if (!session) return null;
  if (session.expires_at && session.expires_at < Date.now() / 1000 + 30) {
    try { return await refreshSession(session); }
    catch { saveSession(null); return null; }
  }
  return session;
}

async function fetchProfile(session: Session): Promise<AuthUser> {
  const response = await fetch(`${apiUrl}/rest/v1/profiles?id=eq.${session.user.id}&select=id,role`, {
    headers: { apikey: anonKey!, Authorization: `Bearer ${session.access_token}` },
  });
  if (!response.ok) throw new Error('Could not load your account role. Apply the database schema and try again.');
  const rows = await response.json() as { id: string; role: AppRole }[];
  return { id: session.user.id, email: session.user.email || '', role: rows[0]?.role || 'user' };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    if (!configured) { setLoading(false); return; }
    try {
      const session = await getValidSession();
      if (session) setUser(await fetchProfile(session));
      else setUser(null);
    } catch { saveSession(null); setUser(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadCurrentUser(); }, [loadCurrentUser]);

  const signIn = useCallback(async (email: string, password: string, expectedRole?: AppRole) => {
    const session = await authRequest<Session>('token?grant_type=password', { email, password });
    const saved = { ...session, expires_at: Date.now() / 1000 + (session as Session & { expires_in?: number }).expires_in! };
    saveSession(saved);
    let profile: AuthUser;
    try { profile = await fetchProfile(saved); }
    catch (error) { saveSession(null); throw error; }
    if (expectedRole && profile.role !== expectedRole) {
      await authRequest('logout', {}, saved.access_token).catch(() => undefined);
      saveSession(null);
      throw new Error(expectedRole === 'admin' ? 'This account does not have administrator access.' : 'Please use administrator sign in for this account.');
    }
    setUser(profile);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await authRequest('signup', { email, password });
  }, []);

  const signOut = useCallback(async () => {
    const session = readSession();
    if (configured && session) await authRequest('logout', {}, session.access_token).catch(() => undefined);
    saveSession(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, configured, signIn, signUp, signOut }), [user, loading, signIn, signUp, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
