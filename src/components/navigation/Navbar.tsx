import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/format';

const NAV_LINKS = [
  { label: 'HOME', path: '/' },
  { label: 'SHOP', path: '/shop' },
  { label: 'COLLECTIONS', path: '/collections' },
  { label: 'ABOUT', path: '/about' },
  { label: 'CONTACT', path: '/contact' },
];

export function Navbar() {
  const { settings } = useSiteSettings();
  const { count, openCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isHome = location.pathname === '/';
  const isDark = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-soft-white/90 backdrop-blur-md border-b border-border/20 py-3'
            : 'bg-transparent py-5'
        )}
      >
        <nav className="container-lux flex items-center justify-between">
          {/* Left nav (desktop) */}
          <div className="hidden lg:flex items-center gap-8 flex-1">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'label-sm link-underline transition-colors',
                  isDark ? 'text-foreground' : 'text-primary',
                  location.pathname === link.path && 'opacity-60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className={cn('lg:hidden', isDark ? 'text-foreground' : 'text-primary')}
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          {/* Logo / Brand */}
          <Link
            to="/"
            className={cn(
              'font-serif text-lg md:text-xl tracking-ultra-wide whitespace-nowrap transition-colors',
              isDark ? 'text-foreground' : 'text-primary'
            )}
          >
            {settings.brand.logoText || settings.brand.name}
          </Link>

          {/* Right nav (desktop) */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
            {NAV_LINKS.slice(3).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'label-sm link-underline transition-colors',
                  isDark ? 'text-foreground' : 'text-primary',
                  location.pathname === link.path && 'opacity-60'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className={cn('h-4 w-px', isDark ? 'bg-foreground/30' : 'bg-primary/20')} />
            <button
              onClick={() => setSearchOpen(true)}
              className={cn('transition-colors', isDark ? 'text-foreground' : 'text-primary')}
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link
              to={user ? '/account' : '/login'}
              className={cn('transition-colors', isDark ? 'text-foreground' : 'text-primary')}
              aria-label="Account"
            >
              <User size={18} strokeWidth={1.5} />
            </Link>
            <button
              onClick={openCart}
              className={cn('relative transition-colors', isDark ? 'text-foreground' : 'text-primary')}
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] font-medium leading-none bg-accent text-primary rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>

          {/* Mobile right icons */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className={cn(isDark ? 'text-foreground' : 'text-primary')}
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={openCart}
              className={cn('relative', isDark ? 'text-foreground' : 'text-primary')}
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] font-medium leading-none bg-accent text-primary rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md flex items-start justify-center pt-32"
            onClick={() => setSearchOpen(false)}
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSearch}
              className="w-full max-w-2xl px-6"
            >
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <Search size={24} strokeWidth={1.5} className="text-muted" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="flex-1 bg-transparent text-2xl font-serif placeholder:text-muted outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-muted hover:text-primary transition-colors"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              <p className="label-sm text-muted mt-4">Press Enter to search</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-primary lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-serif text-lg tracking-ultra-wide text-foreground">
                {settings.brand.logoText || settings.brand.name}
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-foreground"
                aria-label="Close menu"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center mt-20 gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                >
                  <Link
                    to={link.path}
                    className="block font-serif text-3xl text-foreground py-3 tracking-wide-sm"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + NAV_LINKS.length * 0.08, duration: 0.5 }}
                className="mt-6"
              >
                <Link
                  to={user ? '/account' : '/login'}
                  className="block font-serif text-3xl text-foreground py-3 tracking-wide-sm"
                >
                  ACCOUNT
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-10 left-0 right-0 flex justify-center gap-8"
            >
              {settings.social.instagram && (
                <a href={settings.social.instagram} target="_blank" rel="noreferrer" className="label-sm text-foreground/60">
                  Instagram
                </a>
              )}
              {settings.social.facebook && (
                <a href={settings.social.facebook} target="_blank" rel="noreferrer" className="label-sm text-foreground/60">
                  Facebook
                </a>
              )}
              {settings.social.pinterest && (
                <a href={settings.social.pinterest} target="_blank" rel="noreferrer" className="label-sm text-foreground/60">
                  Pinterest
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
