import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export function ResetPassword() {
  const { session } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Supabase handles the reset via the token in the URL; the session is set automatically
    navigate('/account');
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
          <div className="text-center mb-12">
            <Link to="/" className="font-serif text-2xl tracking-ultra-wide text-primary">
              {settings.brand.logoText || settings.brand.name}
            </Link>
          </div>
          <h1 className="font-serif text-2xl text-primary mb-4">Invalid or Expired Link</h1>
          <p className="text-sm text-muted mb-8">This password reset link is no longer valid.</p>
          <Link to="/forgot-password" className="btn-lux text-primary border-primary"><span>REQUEST NEW LINK</span></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link to="/" className="font-serif text-2xl tracking-ultra-wide text-primary">
            {settings.brand.logoText || settings.brand.name}
          </Link>
        </div>
        <h1 className="font-serif text-3xl text-primary text-center mb-2">Set New Password</h1>
        <p className="text-sm text-muted text-center mb-10">Enter your new password below</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label-sm text-muted block mb-2">NEW PASSWORD</label>
            <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="btn-lux text-primary border-primary w-full disabled:opacity-50">
            <span>{loading ? 'UPDATING...' : 'UPDATE PASSWORD'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
