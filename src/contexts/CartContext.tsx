import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Product } from '@/types';

type CartLine = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  loading: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const GUEST_CART_KEY = 'hoy_guest_cart';

type GuestCartEntry = { productId: string; quantity: number };

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadServerCart(user.id);
    } else {
      loadGuestCart();
    }
  }, [user]);

  async function loadServerCart(userId: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select('product_id, quantity, product:products(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error loading cart:', error);
      setLoading(false);
      return;
    }

    const cartLines: CartLine[] = (data || [])
      .filter((item) => item.product)
      .map((item) => ({
        product: item.product as unknown as Product,
        quantity: item.quantity,
      }));
    setLines(cartLines);
    setLoading(false);
  }

  function loadGuestCart() {
    try {
      const raw = localStorage.getItem(GUEST_CART_KEY);
      if (!raw) {
        setLines([]);
        return;
      }
      const entries: GuestCartEntry[] = JSON.parse(raw);
      void loadGuestProducts(entries);
    } catch {
      setLines([]);
    }
  }

  async function loadGuestProducts(entries: GuestCartEntry[]) {
    if (entries.length === 0) {
      setLines([]);
      return;
    }
    const productIds = entries.map((e) => e.productId);
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*), product_images(*)')
      .in('id', productIds);

    if (error || !data) {
      setLines([]);
      return;
    }

    const cartLines: CartLine[] = entries
      .map((entry) => {
        const product = data.find((p) => p.id === entry.productId);
        if (!product) return null;
        return { product: product as Product, quantity: entry.quantity };
      })
      .filter((l): l is CartLine => l !== null);
    setLines(cartLines);
  }

  function saveGuestCart(cartLines: CartLine[]) {
    const entries: GuestCartEntry[] = cartLines.map((l) => ({
      productId: l.product.id,
      quantity: l.quantity,
    }));
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(entries));
  }

  const addToCart = useCallback(
    async (product: Product, quantity = 1) => {
      if (user) {
        const existing = lines.find((l) => l.product.id === product.id);
        if (existing) {
          await updateQuantity(product.id, existing.quantity + quantity);
          return;
        }
        const { error } = await supabase
          .from('cart_items')
          .insert({ user_id: user.id, product_id: product.id, quantity });
        if (error) {
          console.error('Error adding to cart:', error);
          return;
        }
        setLines((prev) => [...prev, { product, quantity }]);
      } else {
        setLines((prev) => {
          const existing = prev.find((l) => l.product.id === product.id);
          let next: CartLine[];
          if (existing) {
            next = prev.map((l) =>
              l.product.id === product.id ? { ...l, quantity: l.quantity + quantity } : l
            );
          } else {
            next = [...prev, { product, quantity }];
          }
          saveGuestCart(next);
          return next;
        });
      }
      setIsOpen(true);
    },
    [user, lines]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        if (error) console.error('Error removing from cart:', error);
      }
      setLines((prev) => {
        const next = prev.filter((l) => l.product.id !== productId);
        if (!user) saveGuestCart(next);
        return next;
      });
    },
    [user]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity < 1) {
        await removeFromCart(productId);
        return;
      }
      if (user) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('product_id', productId);
        if (error) console.error('Error updating cart:', error);
      }
      setLines((prev) => {
        const next = prev.map((l) =>
          l.product.id === productId ? { ...l, quantity } : l
        );
        if (!user) saveGuestCart(next);
        return next;
      });
    },
    [user, removeFromCart]
  );

  const clearCart = useCallback(() => {
    setLines([]);
    if (!user) localStorage.removeItem(GUEST_CART_KEY);
  }, [user]);

  // Merge guest cart into server cart on login
  useEffect(() => {
    if (user) {
      const raw = localStorage.getItem(GUEST_CART_KEY);
      if (!raw) return;
      const entries: GuestCartEntry[] = JSON.parse(raw);
      if (entries.length === 0) return;

      (async () => {
        for (const entry of entries) {
          const { error } = await supabase
            .from('cart_items')
            .upsert(
              { user_id: user.id, product_id: entry.productId, quantity: entry.quantity },
              { onConflict: 'user_id,product_id' }
            );
          if (error) console.error('Error merging cart:', error);
        }
        localStorage.removeItem(GUEST_CART_KEY);
        await loadServerCart(user.id);
      })();
    }
  }, [user]);

  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        lines,
        count,
        subtotal,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
