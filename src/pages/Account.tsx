import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Heart, LogOut, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { fetchUserOrders } from '@/services/orders';
import { fetchProducts } from '@/services/products';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/format';
import { ProductCard } from '@/components/products/ProductCard';
import type { Order, Product } from '@/types';
import { cn } from '@/utils/format';

type Tab = 'profile' | 'orders' | 'wishlist' | 'settings';

export function Account() {
  const { user, profile, signOut, refreshProfile, isAdmin } = useAuth();
  const { wishlistProductIds } = useWishlist();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/account');
      return;
    }
    setLoading(true);
    Promise.all([
      fetchUserOrders(user.id),
      wishlistProductIds.size > 0
        ? fetchProducts({}).then((all) => all.filter((p) => wishlistProductIds.has(p.id)))
        : Promise.resolve([]),
    ])
      .then(([o, w]) => {
        setOrders(o);
        setWishlistProducts(w);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate, wishlistProductIds]);

  useEffect(() => {
    setName(profile?.full_name ?? '');
    setPhone(profile?.phone ?? '');
  }, [profile]);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('loading');
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name, phone })
      .eq('id', user.id);
    if (error) {
      setSaveStatus('error');
    } else {
      setSaveStatus('success');
      await refreshProfile();
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const tabs: { key: Tab; label: string; icon: typeof User }[] = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'orders', label: 'Orders', icon: Package },
    { key: 'wishlist', label: 'Wishlist', icon: Heart },
    { key: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="pt-28 md:pt-32 pb-20 min-h-screen bg-soft-white">
      <div className="container-lux">
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-primary">My Account</h1>
          <p className="text-sm text-muted mt-2">{user.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                      tab === t.key ? 'bg-primary text-foreground' : 'text-muted hover:text-primary hover:bg-background'
                    )}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    {t.label}
                    {t.key === 'wishlist' && wishlistProductIds.size > 0 && (
                      <span className="ml-auto text-xs opacity-70">{wishlistProductIds.size}</span>
                    )}
                    {t.key === 'orders' && orders.length > 0 && (
                      <span className="ml-auto text-xs opacity-70">{orders.length}</span>
                    )}
                  </button>
                );
              })}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-accent hover:bg-background transition-colors"
                >
                  <SettingsIcon size={18} strokeWidth={1.5} />
                  Admin Dashboard
                  <ChevronRight size={16} strokeWidth={1.5} className="ml-auto" />
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted hover:text-red-600 transition-colors"
              >
                <LogOut size={18} strokeWidth={1.5} />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {tab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-serif text-2xl text-primary mb-8">Profile Information</h2>
                <form onSubmit={handleSaveProfile} className="space-y-6 max-w-lg">
                  <div>
                    <label className="label-sm text-muted block mb-2">FULL NAME</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="label-sm text-muted block mb-2">EMAIL</label>
                    <input type="email" value={user.email ?? ''} disabled
                      className="w-full border-b border-border/40 py-3 bg-transparent text-muted outline-none" />
                  </div>
                  <div>
                    <label className="label-sm text-muted block mb-2">PHONE</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors" />
                  </div>
                  <button type="submit" disabled={saveStatus === 'loading'}
                    className="btn-lux text-primary border-primary disabled:opacity-50">
                    <span>{saveStatus === 'loading' ? 'SAVING...' : 'SAVE CHANGES'}</span>
                  </button>
                  {saveStatus === 'success' && <p className="text-green-700 text-sm">Profile updated.</p>}
                  {saveStatus === 'error' && <p className="text-red-600 text-sm">Failed to update. Please try again.</p>}
                </form>
              </motion.div>
            )}

            {tab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-serif text-2xl text-primary mb-8">Order History</h2>
                {loading ? (
                  <p className="text-sm text-muted">Loading...</p>
                ) : orders.length === 0 ? (
                  <p className="text-sm text-muted">You haven't placed any orders yet.</p>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-border/20 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-serif text-lg text-primary">{order.order_number}</p>
                            <p className="text-xs text-muted">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs uppercase tracking-wide-sm px-3 py-1 bg-background text-muted">
                              {order.status}
                            </span>
                            <p className="font-serif text-lg text-primary mt-1">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.order_items?.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 text-sm">
                              {item.product_image && (
                                <img src={item.product_image} alt="" className="w-10 h-12 object-cover" loading="lazy" />
                              )}
                              <span className="text-primary flex-1">{item.product_name}</span>
                              <span className="text-muted">×{item.quantity}</span>
                              <span className="text-primary">{formatPrice(item.price)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'wishlist' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-serif text-2xl text-primary mb-8">Wishlist</h2>
                {loading ? (
                  <p className="text-sm text-muted">Loading...</p>
                ) : wishlistProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted mb-4">Your wishlist is empty.</p>
                    <Link to="/shop" className="label-sm text-primary link-underline">EXPLORE SHOP</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlistProducts.map((p, i) => (
                      <ProductCard key={p.id} product={p} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-serif text-2xl text-primary mb-8">Settings</h2>
                <div className="space-y-4 max-w-lg">
                  <div className="flex items-center justify-between border-b border-border/20 pb-4">
                    <div>
                      <p className="text-sm text-primary">Email Notifications</p>
                      <p className="text-xs text-muted">Receive updates about your orders</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between border-b border-border/20 pb-4">
                    <div>
                      <p className="text-sm text-primary">Newsletter</p>
                      <p className="text-xs text-muted">Design stories and new collections</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
