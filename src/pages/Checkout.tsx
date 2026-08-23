import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createOrder } from '@/services/orders';
import { formatPrice } from '@/utils/format';
import type { Order } from '@/types';

export function Checkout() {
  const { lines, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<Order | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  if (success) {
    return (
      <div className="pt-28 md:pt-32 pb-20 min-h-screen bg-soft-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-green-700" strokeWidth={2} />
          </div>
          <h1 className="font-serif text-3xl text-primary mb-4">Order Confirmed</h1>
          <p className="text-sm text-muted mb-2">Your order number is</p>
          <p className="font-serif text-xl text-primary mb-6">{success.order_number}</p>
          <p className="text-sm text-muted mb-8">
            We've received your order and will contact you shortly to confirm shipping details.
          </p>
          <Link to="/shop" className="btn-lux text-primary border-primary">
            <span>CONTINUE SHOPPING</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="pt-28 min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl text-primary mb-4">Your cart is empty</p>
          <Link to="/shop" className="label-sm text-primary link-underline">EXPLORE SHOP</Link>
        </div>
      </div>
    );
  }

  const shippingCost = subtotal >= 50000 ? 0 : 500;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    setLoading(true);
    setError('');

    const { order, error: orderError } = await createOrder({
      userId: user.id,
      lines,
      subtotal,
      shippingCost,
      total,
      shippingAddress: {
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
      customerEmail: form.email,
      customerName: form.name,
      customerPhone: form.phone,
      notes: form.notes || undefined,
    });

    if (orderError) {
      setError(orderError);
      setLoading(false);
      return;
    }

    clearCart();
    setSuccess(order);
    setLoading(false);
  };

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="pt-28 md:pt-32 pb-20 min-h-screen bg-soft-white">
      <div className="container-lux">
        <h1 className="font-serif text-4xl md:text-5xl text-primary mb-12">Checkout</h1>

        {!user && (
          <div className="bg-accent/20 p-6 mb-8 text-center">
            <p className="text-sm text-primary">
              Please <Link to="/login?redirect=/checkout" className="underline">sign in</Link> to complete your order.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <h2 className="font-serif text-2xl text-primary mb-4">Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label-sm text-muted block mb-2">FULL NAME *</label>
                <input required type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
                  className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="label-sm text-muted block mb-2">EMAIL *</label>
                <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                  className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="label-sm text-muted block mb-2">PHONE *</label>
                <input required type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                  className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="label-sm text-muted block mb-2">PINCODE *</label>
                <input required type="text" value={form.pincode} onChange={(e) => update('pincode', e.target.value)}
                  className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="label-sm text-muted block mb-2">ADDRESS *</label>
                <input required type="text" value={form.address} onChange={(e) => update('address', e.target.value)}
                  className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="label-sm text-muted block mb-2">CITY *</label>
                <input required type="text" value={form.city} onChange={(e) => update('city', e.target.value)}
                  className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="label-sm text-muted block mb-2">STATE *</label>
                <input required type="text" value={form.state} onChange={(e) => update('state', e.target.value)}
                  className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <div>
              <label className="label-sm text-muted block mb-2">ORDER NOTES</label>
              <textarea rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)}
                className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors resize-none" />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button type="submit" disabled={loading || !user}
              className="btn-lux text-primary border-primary disabled:opacity-50">
              <span>{loading ? 'PLACING ORDER...' : 'PLACE ORDER'}</span>
            </button>
          </form>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-background p-8 sticky top-28">
              <h2 className="font-serif text-xl text-primary mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {lines.map((line) => (
                  <div key={line.product.id} className="flex gap-3">
                    <div className="w-14 h-18 bg-soft-white flex-shrink-0 overflow-hidden">
                      {line.product.product_images?.[0] && (
                        <img src={line.product.product_images[0].image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                      )}
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-serif text-sm text-primary">{line.product.name}</p>
                      <p className="text-muted mt-1">Qty: {line.quantity}</p>
                      <p className="text-primary mt-1">{formatPrice(line.product.price * line.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/20 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border/20">
                  <span className="label-sm text-muted">TOTAL</span>
                  <span className="font-serif text-xl text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
