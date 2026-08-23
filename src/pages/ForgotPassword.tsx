import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export function ForgotPassword() {
  const { resetPassword } = useAuth();
  const { settings } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: resetError } = await resetPassword(email);
    if (resetError) {
      setError(resetError);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link to="/" className="font-serif text-2xl tracking-ultra-wide text-primary">
            {settings.brand.logoText || settings.brand.name}
          </Link>
        </div>

        {sent ? (
          <div className="text-center">
            <h1 className="font-serif text-3xl text-primary mb-4">Check Your Email</h1>
            <p className="text-sm text-muted mb-8">We've sent a password reset link to {email}.</p>
            <Link to="/login" className="btn-lux text-primary border-primary"><span>BACK TO SIGN IN</span></Link>
          </div>
        ) : (
          <>
            <h1 className="font-serif text-3xl text-primary text-center mb-2">Reset Password</h1>
            <p className="text-sm text-muted text-center mb-10">Enter your email to receive a reset link</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label-sm text-muted block mb-2">EMAIL</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors" />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button type="submit" disabled={loading}
                className="btn-lux text-primary border-primary w-full disabled:opacity-50">
                <span>{loading ? 'SENDING...' : 'SEND RESET LINK'}</span>
              </button>
            </form>
            <p className="text-center text-sm text-muted mt-8">
              <Link to="/login" className="text-primary underline">Back to sign in</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
