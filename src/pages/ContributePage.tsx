import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPinned, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { DESTINATIONS } from '@/data/destinations';
import { useAuth } from '@/lib/auth';
import { isSupabaseDataConfigured, supabaseData } from '@/lib/supabaseData';

export function ContributePage() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const initialDestination = DESTINATIONS.find((destination) => destination.id === params.get('destination'));
  const [destinationId, setDestinationId] = useState(initialDestination?.id ?? '');
  const [destinationName, setDestinationName] = useState(initialDestination?.name ?? '');
  const [message, setMessage] = useState('');
  const [contactEmail, setContactEmail] = useState(user?.email ?? '');
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSupabaseDataConfigured) {
      toast.error('Cloud submissions need Supabase configured and migration 002 applied.');
      return;
    }
    setBusy(true);
    try {
      await supabaseData('destination_submissions', {
        method: 'POST', prefer: 'return=minimal',
        body: { user_id: user?.id ?? null, destination_id: destinationId || null, destination_name: destinationName.trim(), message: message.trim(), contact_email: contactEmail.trim() || null },
      });
      setMessage('');
      toast.success('Thanks! Your suggestion was sent to the review queue.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not send your suggestion.');
    } finally { setBusy(false); }
  };

  return <main className="min-h-[70vh] bg-gradient-to-br from-sand-50 via-white to-primary-50 px-4 py-10 sm:py-16">
    <div className="mx-auto max-w-2xl rounded-3xl border border-gray-100 bg-white p-6 shadow-card sm:p-9">
      <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-primary-50 text-primary-700"><MapPinned /></div>
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Help improve the destination guide</h1>
      <p className="mt-2 text-sm leading-6 text-gray-600">Report outdated details or suggest a place to add. Submissions are reviewed before they change the guide.</p>
      {!isSupabaseDataConfigured && <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Configure Supabase and apply migration 002 to enable sending suggestions.</p>}
      <form onSubmit={(event) => void submit(event)} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-gray-700">Existing destination (optional)
          <select value={destinationId} onChange={(event) => { setDestinationId(event.target.value); const match = DESTINATIONS.find((item) => item.id === event.target.value); if (match) setDestinationName(match.name); }} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-3">
            <option value="">Suggest a new place</option>{DESTINATIONS.map((item) => <option key={item.id} value={item.id}>{item.name} — {item.district}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">Place name<input required maxLength={160} value={destinationName} onChange={(event) => setDestinationName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-3" placeholder="Name of the destination" /></label>
        <label className="block text-sm font-medium text-gray-700">What should we know?<textarea required minLength={10} maxLength={2000} value={message} onChange={(event) => setMessage(event.target.value)} className="mt-1.5 min-h-32 w-full rounded-xl border border-gray-200 px-3 py-3" placeholder="Share corrected details, location, source, or visitor information." /></label>
        <label className="block text-sm font-medium text-gray-700">Email for follow-up (optional)<input type="email" maxLength={254} value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-3" placeholder="you@example.com" /></label>
        <div className="flex flex-wrap items-center gap-3 pt-2"><Button type="submit" leftIcon={<Send size={16} />} isLoading={busy}>Send suggestion</Button><Link to="/explore" className="text-sm font-medium text-primary-700 hover:underline">Back to exploring</Link></div>
      </form>
    </div>
  </main>;
}
