import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Product } from '@/types';

type WishlistContextValue = {
  wishlistProductIds: Set<string>;
  toggleWishlist: (product: Product) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  loading: boolean;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

const GUEST_WISHLIST_KEY = 'hoy_guest_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlistProductIds, setWishlistProductIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadServerWishlist(user.id);
    } else {
      loadGuestWishlist();
    }
  }, [user]);

  async function loadServerWishlist(userId: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', userId);
    if (error) {
      console.error('Error loading wishlist:', error);
      setLoading(false);
      return;
    }
    setWishlistProductIds(new Set((data || []).map((w) => w.product_id)));
    setLoading(false);
  }

  function loadGuestWishlist() {
    try {
      const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
      if (!raw) return;
      const ids: string[] = JSON.parse(raw);
      setWishlistProductIds(new Set(ids));
    } catch {
      setWishlistProductIds(new Set());
    }
  }

  function saveGuestWishlist(ids: Set<string>) {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify([...ids]));
  }

  const toggleWishlist = useCallback(
    async (product: Product) => {
      const isCurrentlyWishlisted = wishlistProductIds.has(product.id);

      if (user) {
        if (isCurrentlyWishlisted) {
          await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', product.id);
        } else {
          await supabase
            .from('wishlists')
            .insert({ user_id: user.id, product_id: product.id });
        }
      }

      setWishlistProductIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyWishlisted) {
          next.delete(product.id);
        } else {
          next.add(product.id);
        }
        if (!user) saveGuestWishlist(next);
        return next;
      });
    },
    [user, wishlistProductIds]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlistProductIds.has(productId),
    [wishlistProductIds]
  );

  // Merge guest wishlist on login
  useEffect(() => {
    if (user) {
      const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
      if (!raw) return;
      const ids: string[] = JSON.parse(raw);
      if (ids.length === 0) return;

      (async () => {
        for (const productId of ids) {
          await supabase
            .from('wishlists')
            .upsert(
              { user_id: user.id, product_id: productId },
              { onConflict: 'user_id,product_id' }
            );
        }
        localStorage.removeItem(GUEST_WISHLIST_KEY);
        await loadServerWishlist(user.id);
      })();
    }
  }, [user]);

  return (
    <WishlistContext.Provider
      value={{ wishlistProductIds, toggleWishlist, isWishlisted, loading }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
