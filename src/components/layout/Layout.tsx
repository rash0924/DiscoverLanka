import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/lib/auth';
import { isSupabaseDataConfigured, supabaseData } from '@/lib/supabaseData';

function AccountFavoritesSync() {
  const { user } = useAuth();
  const favorites = useAppStore((state) => state.favorites);
  const setFavorites = useAppStore((state) => state.setFavorites);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isSupabaseDataConfigured) { setLoadedFor(null); return; }
    let cancelled = false;
    void supabaseData<{ destination_id: string }[]>('favorites', { query: `user_id=eq.${user.id}&select=destination_id` })
      .then(async (rows) => {
        if (cancelled) return;
        const merged = [...new Set([...favorites, ...rows.map((row) => row.destination_id)])];
        setFavorites(merged);
        setLoadedFor(user.id);
        const missing = merged.filter((id) => !rows.some((row) => row.destination_id === id));
        if (missing.length) await supabaseData('favorites', { method: 'POST', prefer: 'resolution=merge-duplicates,return=minimal', body: missing.map((destination_id) => ({ user_id: user.id, destination_id })) });
      }).catch(() => setLoadedFor(user.id));
    return () => { cancelled = true; };
  }, [user?.id, isSupabaseDataConfigured]);

  useEffect(() => {
    if (!user || !isSupabaseDataConfigured || loadedFor !== user.id) return;
    let cancelled = false;
    const sync = async () => {
      try {
        const rows = await supabaseData<{ destination_id: string }[]>('favorites', { query: `user_id=eq.${user.id}&select=destination_id` });
        if (cancelled) return;
        const add = favorites.filter((id) => !rows.some((row) => row.destination_id === id));
        const remove = rows.map((row) => row.destination_id).filter((id) => !favorites.includes(id));
        if (add.length) await supabaseData('favorites', { method: 'POST', prefer: 'resolution=merge-duplicates,return=minimal', body: add.map((destination_id) => ({ user_id: user.id, destination_id })) });
        if (remove.length) await supabaseData('favorites', { method: 'DELETE', query: `user_id=eq.${user.id}&destination_id=in.(${remove.join(',')})` });
      } catch { /* Keep local favorites usable while offline. */ }
    };
    void sync();
    return () => { cancelled = true; };
  }, [favorites, loadedFor, user?.id]);

  return null;
}

export function Layout() {
  const location = useLocation();
  const isMapPage = location.pathname === '/map';
  const language = useAppStore((state) => state.language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Sidebar />
      <AccountFavoritesSync />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <main className={isMapPage ? 'flex-1 overflow-hidden pt-16' : 'flex-1 pb-20 pt-16 lg:pb-0'}>
          <Outlet />
        </main>
        {!isMapPage && <Footer />}
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          className: 'task-toast-banner',
          style: {
            background: '#ffffff',
            color: '#1f2937',
            border: '1px solid #dce8df',
            borderLeft: '4px solid #1b6b3a',
            borderRadius: '14px',
            fontSize: '14px',
            fontWeight: 600,
            maxWidth: 'min(92vw, 420px)',
            boxShadow: '0 16px 40px rgba(20, 50, 34, 0.18)',
          },
          success: {
            iconTheme: { primary: '#1B6B3A', secondary: '#fff' },
          },
          error: {
            style: { borderLeft: '4px solid #dc2626', borderColor: '#fee2e2' },
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
}
