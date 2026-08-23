import { Link } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useState } from 'react';
import { subscribeNewsletter } from '@/services/contact';

export function Footer() {
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
    <footer className="bg-primary text-foreground pt-20 pb-10">
      <div className="container-lux">
        {/* Newsletter */}
        {settings.footer.newsletterEnabled && (
          <div className="border-b border-foreground/10 pb-16 mb-16">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl mb-3">
                {settings.homepage.newsletterTitle}
              </h2>
              <p className="text-foreground/60 text-sm mb-8 leading-relaxed">
                {settings.homepage.newsletterText}
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="flex-1 bg-transparent border-b border-foreground/30 px-1 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-foreground transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="label-sm text-foreground border border-foreground/40 px-6 py-3 hover:bg-foreground hover:text-primary transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? 'JOINING...' : 'JOIN'}
                </button>
              </form>
              {status === 'success' && (
                <p className="text-accent text-xs mt-4">Thank you for joining the journal.</p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-xs mt-4">{errorMsg || 'Something went wrong. Please try again.'}</p>
              )}
            </div>
          </div>
        )}

        {/* Footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          <div className="md:col-span-1">
            <h3 className="font-serif text-xl tracking-ultra-wide mb-4">
              {settings.brand.logoText || settings.brand.name}
            </h3>
            <p className="text-foreground/50 text-sm leading-relaxed">
              {settings.footer.text}
            </p>
          </div>

          <div>
            <h4 className="label-sm text-foreground/40 mb-4">SHOP</h4>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-sm text-foreground/70 hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/collections" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Collections</Link></li>
              <li><Link to="/shop?featured=true" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Featured</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="label-sm text-foreground/40 mb-4">INFORMATION</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-foreground/70 hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/policies/shipping" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Shipping</Link></li>
              <li><Link to="/policies/returns" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Returns</Link></li>
              <li><Link to="/policies/privacy" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link to="/policies/terms" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Terms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="label-sm text-foreground/40 mb-4">CONNECT</h4>
            <ul className="space-y-3 mb-6">
              <li className="text-sm text-foreground/70">{settings.contact.email}</li>
              <li className="text-sm text-foreground/70">{settings.contact.phone}</li>
            </ul>
            <div className="flex gap-4">
              {settings.social.instagram && (
                <a href={settings.social.instagram} target="_blank" rel="noreferrer" className="text-foreground/60 hover:text-foreground transition-colors" aria-label="Instagram">
                  <Instagram size={18} strokeWidth={1.5} />
                </a>
              )}
              {settings.social.facebook && (
                <a href={settings.social.facebook} target="_blank" rel="noreferrer" className="text-foreground/60 hover:text-foreground transition-colors" aria-label="Facebook">
                  <Facebook size={18} strokeWidth={1.5} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-foreground/40">
            © {new Date().getFullYear()} {settings.brand.name}. All rights reserved.
          </p>
          <p className="text-xs text-foreground/40">
            Designed and crafted in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
