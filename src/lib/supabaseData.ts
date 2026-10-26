import { getCurrentAccessToken } from '@/lib/auth';

const projectUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseDataConfigured = Boolean(projectUrl && publishableKey);

export async function supabaseData<T>(
  table: string,
  options: { method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'; query?: string; body?: unknown; prefer?: string } = {}
): Promise<T> {
  if (!projectUrl || !publishableKey) throw new Error('Cloud features need Supabase project settings.');
  const token = getCurrentAccessToken();
  const response = await fetch(`${projectUrl}/rest/v1/${table}${options.query ? `?${options.query}` : ''}`, {
    method: options.method ?? 'GET',
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${token ?? publishableKey}`,
      'Content-Type': 'application/json',
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || payload?.details || `Supabase request failed (${response.status}).`);
  return payload as T;
}
