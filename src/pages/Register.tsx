import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export function Register() {
  const { signUp, signInWithGoogle } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: signUpError } = await signUp(email, password, name);
    if (signUpError) {
      setError(signUpError);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
          <h1 className="font-serif text-3xl text-primary mb-4">Account Created</h1>
          <p className="text-sm text-muted mb-8">Your account has been created. You can now sign in.</p>
          <Link to="/login" className="btn-lux text-primary border-primary"><span>SIGN IN</span></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link to="/" className="font-serif text-2xl tracking-ultra-wide text-primary">
            {settings.brand.logoText || settings.brand.name}
          </Link>
        </div>

        <h1 className="font-serif text-3xl text-primary text-center mb-2">Create Account</h1>
        <p className="text-sm text-muted text-center mb-10">Join the House of Yahara</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label-sm text-muted block mb-2">FULL NAME</label>
            <input required type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="label-sm text-muted block mb-2">EMAIL</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="label-sm text-muted block mb-2">PASSWORD</label>
            <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors" />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="btn-lux text-primary border-primary w-full disabled:opacity-50">
            <span>{loading ? 'CREATING...' : 'CREATE ACCOUNT'}</span>
          </button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-border/30" />
          <span className="text-xs text-muted">OR</span>
          <div className="flex-1 h-px bg-border/30" />
        </div>

        <button onClick={signInWithGoogle}
          className="w-full border border-border/40 py-4 text-sm text-primary hover:bg-background transition-colors flex items-center justify-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-muted mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-primary underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
