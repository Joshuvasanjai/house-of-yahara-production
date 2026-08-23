import { useState } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { subscribeNewsletter } from '@/services/contact';

export function Newsletter() {
  const { settings } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    const { error } = await subscribeNewsletter(email.trim());
    if (error) {
      setStatus('error');
      setErrorMsg(error);
    } else {
      setStatus('success');
      setEmail('');
    }
  };

  return (
    <section className="py-24 md:py-32 bg-soft-white border-t border-border/10">
      <div className="container-lux text-center max-w-xl mx-auto">
        <h2 className="font-serif text-3xl md:text-5xl text-primary mb-4">
          {settings.homepage.newsletterTitle}
        </h2>
        <p className="text-muted text-sm mb-8 leading-relaxed">
          {settings.homepage.newsletterText}
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="flex-1 bg-transparent border-b border-border px-1 py-3 text-sm text-primary placeholder:text-muted outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-lux text-primary border-primary disabled:opacity-50"
          >
            <span>{status === 'loading' ? 'JOINING...' : 'JOIN'}</span>
          </button>
        </form>
        {status === 'success' && (
          <p className="text-accent text-xs mt-4">Thank you for joining the journal.</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 text-xs mt-4">{errorMsg || 'Something went wrong. Please try again.'}</p>
        )}
      </div>
    </section>
  );
}
