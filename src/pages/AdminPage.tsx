import { useEffect, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Database, Users, MapPinned, Megaphone, Check, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { isSupabaseDataConfigured, supabaseData } from '@/lib/supabaseData';
import toast from 'react-hot-toast';

interface ReviewQueueItem { id: string; destination_id: string; rating: number; comment: string; created_at: string }
interface SuggestionQueueItem { id: string; destination_id: string | null; destination_name: string; message: string; created_at: string }

export function AdminPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewQueueItem[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionQueueItem[]>([]);
  const [advisoryTitle, setAdvisoryTitle] = useState('');
  const [advisoryRegion, setAdvisoryRegion] = useState('Sri Lanka');
  const [advisoryCategory, setAdvisoryCategory] = useState('General');
  const [advisoryBody, setAdvisoryBody] = useState('');
  const [advisorySource, setAdvisorySource] = useState('');
  const [advisoryEndsAt, setAdvisoryEndsAt] = useState('');
  const [savingAdvisory, setSavingAdvisory] = useState(false);

  const refreshQueue = async () => {
    if (!isSupabaseDataConfigured) return;
    try {
      const [reviewRows, suggestionRows] = await Promise.all([
        supabaseData<ReviewQueueItem[]>('reviews', { query: 'status=eq.pending&select=id,destination_id,rating,comment,created_at&order=created_at.asc' }),
        supabaseData<SuggestionQueueItem[]>('destination_submissions', { query: 'status=eq.pending&select=id,destination_id,destination_name,message,created_at&order=created_at.asc' }),
      ]);
      setReviews(reviewRows); setSuggestions(suggestionRows);
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Could not load moderation queue.'); }
  };

  useEffect(() => { if (user?.role === 'admin') void refreshQueue(); }, [user]);

  const moderate = async (table: 'reviews' | 'destination_submissions', id: string, status: string) => {
    try { await supabaseData(table, { method: 'PATCH', query: `id=eq.${id}`, prefer: 'return=minimal', body: { status } }); await refreshQueue(); toast.success('Queue updated.'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Could not update queue item.'); }
  };

  const publishAdvisory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSavingAdvisory(true);
    try {
      await supabaseData('travel_advisories', { method: 'POST', prefer: 'return=minimal', body: { title: advisoryTitle.trim(), region: advisoryRegion.trim(), category: advisoryCategory.trim(), body: advisoryBody.trim(), source_url: advisorySource.trim() || null, ends_at: advisoryEndsAt ? new Date(`${advisoryEndsAt}T23:59:59+05:30`).toISOString() : null } });
      setAdvisoryTitle(''); setAdvisoryBody(''); setAdvisorySource(''); setAdvisoryEndsAt(''); toast.success('Advisory published.');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Could not publish advisory.'); }
    finally { setSavingAdvisory(false); }
  };
  useEffect(() => { if (!loading && !user) navigate('/admin/login', { replace: true }); }, [loading, user, navigate]);
  if (loading || !user) return <div className="min-h-[70vh] grid place-items-center text-gray-500">Checking administrator access…</div>;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-sand-100 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800"><ShieldCheck size={16} /> Administrator</div><h1 className="text-3xl font-bold text-gray-900">Admin dashboard</h1><p className="mt-1 text-gray-600">Signed in as {user.email}</p></div>
          <button onClick={() => void signOut().then(() => navigate('/admin/login'))} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"><LogOut size={17} /> Sign out</button>
        </div>
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[{ title: 'Account roles', detail: 'Managed securely in the Supabase profiles table.', icon: <Users /> }, { title: 'Database', detail: 'PostgreSQL tables and row-level security are ready to apply.', icon: <Database /> }, { title: 'Destinations', detail: 'Destination listings currently come from the app catalog.', icon: <MapPinned /> }].map((item) => <article key={item.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-700">{item.icon}</div><h2 className="font-semibold text-gray-900">{item.title}</h2><p className="mt-1 text-sm leading-6 text-gray-500">{item.detail}</p></article>)}
        </section>
        {isSupabaseDataConfigured && <>
          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><h2 className="mb-4 font-semibold text-gray-900">Pending reviews ({reviews.length})</h2>{reviews.length ? <div className="space-y-3">{reviews.map((review) => <article key={review.id} className="rounded-xl bg-sand-50 p-4"><p className="font-semibold text-amber-700">{'★'.repeat(review.rating)} <span className="text-xs text-gray-500">· {review.destination_id}</span></p><p className="mt-1 text-sm text-gray-700">{review.comment}</p><div className="mt-3 flex gap-2"><button onClick={() => void moderate('reviews', review.id, 'published')} className="inline-flex items-center gap-1 rounded-lg bg-primary-700 px-3 py-1.5 text-xs font-semibold text-white"><Check size={14} /> Publish</button><button onClick={() => void moderate('reviews', review.id, 'rejected')} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600"><X size={14} /> Reject</button></div></article>)}</div> : <p className="text-sm text-gray-500">No reviews waiting for moderation.</p>}</div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><h2 className="mb-4 font-semibold text-gray-900">Destination suggestions ({suggestions.length})</h2>{suggestions.length ? <div className="space-y-3">{suggestions.map((suggestion) => <article key={suggestion.id} className="rounded-xl bg-sand-50 p-4"><h3 className="font-semibold text-gray-900">{suggestion.destination_name}</h3><p className="mt-1 text-sm text-gray-700">{suggestion.message}</p><div className="mt-3 flex gap-2"><button onClick={() => void moderate('destination_submissions', suggestion.id, 'reviewed')} className="inline-flex items-center gap-1 rounded-lg bg-primary-700 px-3 py-1.5 text-xs font-semibold text-white"><Check size={14} /> Mark reviewed</button><button onClick={() => void moderate('destination_submissions', suggestion.id, 'rejected')} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600"><X size={14} /> Reject</button></div></article>)}</div> : <p className="text-sm text-gray-500">No destination suggestions waiting.</p>}</div>
          </section>
          <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><h2 className="mb-1 flex items-center gap-2 font-semibold text-gray-900"><Megaphone size={18} className="text-primary-700" /> Publish travel advisory</h2><p className="mb-4 text-sm text-gray-500">Include an authoritative source and expiration date so alerts do not stay up after they become stale.</p><form onSubmit={(event) => void publishAdvisory(event)} className="grid gap-3 sm:grid-cols-2"><input required maxLength={160} value={advisoryTitle} onChange={(event) => setAdvisoryTitle(event.target.value)} placeholder="Advisory title" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" /><input required value={advisoryRegion} onChange={(event) => setAdvisoryRegion(event.target.value)} placeholder="Region" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" /><input required value={advisoryCategory} onChange={(event) => setAdvisoryCategory(event.target.value)} placeholder="Category (weather, road, park…)" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" /><input required type="date" value={advisoryEndsAt} onChange={(event) => setAdvisoryEndsAt(event.target.value)} className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" aria-label="Advisory expiration date" /><input type="url" value={advisorySource} onChange={(event) => setAdvisorySource(event.target.value)} placeholder="Official source URL" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm sm:col-span-2" /><textarea required maxLength={2000} value={advisoryBody} onChange={(event) => setAdvisoryBody(event.target.value)} placeholder="Advisory details" className="min-h-24 rounded-xl border border-gray-200 px-3 py-2.5 text-sm sm:col-span-2" /><div className="sm:col-span-2"><button disabled={savingAdvisory} className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{savingAdvisory ? 'Publishing…' : 'Publish advisory'}</button></div></form></section>
        </>}
        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"><h2 className="font-semibold text-gray-900">Getting started</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-gray-600"><li>Apply <code className="rounded bg-gray-100 px-1.5 py-0.5">supabase/migrations/001_initial_schema.sql</code> and then <code className="rounded bg-gray-100 px-1.5 py-0.5">supabase/migrations/002_travel_features.sql</code>.</li><li>Create your account through <Link to="/login" className="font-medium text-primary-700 underline">user sign up</Link>.</li><li>Promote the account to admin with the SQL statement in <code className="rounded bg-gray-100 px-1.5 py-0.5">DEPLOYMENT.md</code>.</li></ol></section>
      </div>
    </main>
  );
}
