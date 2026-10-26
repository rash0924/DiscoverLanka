import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Compass, LockKeyhole, Mail, MapPin, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth';

export function AuthPage({ role }: { role: 'user' | 'admin' }) {
  const { user, loading, configured, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const isAdminLogin = role === 'admin';

  useEffect(() => {
    if (user && !loading) navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-[70vh] grid place-items-center text-gray-500">Loading account…</div>;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === 'signup') {
        await signUp(email, password);
        toast.success('Account created. Check your email to confirm it, then sign in.');
        setMode('signin');
      } else {
        await signIn(email, password, role);
        // The role is checked after the profile loads; admins are routed to /admin.
        toast.success('Signed in successfully.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not complete sign in.');
    } finally { setBusy(false); }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-sand-100 via-white to-primary-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <section className="relative isolate min-h-52 overflow-hidden rounded-3xl bg-primary-900 shadow-xl shadow-primary-900/15 sm:min-h-64 lg:min-h-[600px]">
          <img src="https://images.unsplash.com/photo-1656314945066-edca54a983ec?auto=format&fit=crop&w=1800&q=85" alt="Misty Sri Lankan tea country at sunrise" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#143b2a]/75 via-[#173d2b]/20 to-[#102b20]/70" />
          <div className="relative flex min-h-52 flex-col justify-between p-5 text-white sm:min-h-64 sm:p-7 lg:min-h-[600px] lg:p-10">
            <Link to="/" className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold backdrop-blur-sm">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/15"><Compass size={15} /></span> LankaExplore
            </Link>
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-200"><Sparkles size={14} /> Your island story begins here</p>
              <h2 className="max-w-lg font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-5xl">A little closer to the places you love.</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/75 sm:text-base">Save the places that move you and bring your Sri Lanka plans together.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-white/70"><MapPin size={14} className="text-accent-200" /> From coastlines to the highlands</span>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-7 text-center lg:text-left">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-md shadow-primary-900/20 lg:mx-0"><Compass size={23} /></div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Welcome to LankaExplore</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-gray-900">{isAdminLogin ? 'Administrator sign in' : mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">{isAdminLogin ? 'Use an administrator account provisioned by your database owner.' : 'Save places and keep your Sri Lanka trip plans together.'}</p>
          </div>

        <div className="rounded-3xl border border-primary-100/70 bg-white p-6 shadow-card sm:p-8">
          {!configured ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              Login is not connected yet. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to your local environment and deployment settings, then apply <code>supabase/migrations/001_initial_schema.sql</code>.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block text-sm font-medium text-gray-700">Email
                <span className="relative mt-1.5 block"><Mail className="absolute left-3 top-3 text-gray-400" size={18} /><input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100" placeholder="you@example.com" /></span>
              </label>
              <label className="block text-sm font-medium text-gray-700">Password
                <span className="relative mt-1.5 block"><LockKeyhole className="absolute left-3 top-3 text-gray-400" size={18} /><input required minLength={8} type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100" placeholder="At least 8 characters" /></span>
              </label>
              <button disabled={busy} className="w-full rounded-xl bg-gradient-to-r from-primary-700 to-primary-600 px-4 py-3 font-semibold text-white shadow-md shadow-primary-900/15 transition hover:-translate-y-0.5 hover:from-primary-800 hover:to-primary-700 disabled:cursor-wait disabled:opacity-60">{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button>
              {!isAdminLogin && <p className="text-center text-sm text-gray-500">{mode === 'signin' ? 'New to Discover Lanka?' : 'Already have an account?'}{' '}<button type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="font-semibold text-primary-700 hover:underline">{mode === 'signin' ? 'Create an account' : 'Sign in'}</button></p>}
            </form>
          )}
        </div>
          <div className="mt-6 text-center text-sm text-gray-500"><Link to={isAdminLogin ? '/login' : '/admin/login'} className="hover:text-primary-700">{isAdminLogin ? 'User sign in' : 'Administrator sign in'}</Link><span className="mx-3">·</span><Link to="/" className="hover:text-primary-700">Back to home</Link></div>
        </div>
      </div>
    </main>
  );
}
