import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { getPrimaryImage } from '@/services/products';
import { formatPrice } from '@/utils/format';

export function Cart() {
  const { lines, subtotal, updateQuantity, removeFromCart } = useCart();

  if (lines.length === 0) {
    return (
      <div className="pt-28 md:pt-32 pb-20 min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-3xl text-primary mb-4">Your cart is empty</p>
          <p className="text-sm text-muted mb-8">Discover our collection of curated objects.</p>
          <Link to="/shop" className="btn-lux text-primary border-primary">
            <span>EXPLORE SHOP</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-32 pb-20 min-h-screen bg-soft-white">
      <div className="container-lux">
        <h1 className="font-serif text-4xl md:text-5xl text-primary mb-12">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-8">
            {lines.map((line, i) => {
              const image = getPrimaryImage(line.product);
              return (
                <motion.div
                  key={line.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex gap-6 pb-8 border-b border-border/20"
                >
                  <Link to={`/product/${line.product.slug}`} className="flex-shrink-0">
                    <div className="w-28 h-36 md:w-32 md:h-40 bg-background overflow-hidden">
                      {image && <img src={image} alt={line.product.name} className="w-full h-full object-cover" loading="lazy" />}
                    </div>
                  </Link>
                  <div className="flex-1 flex flex-col">
                    {line.product.category && <p className="label-sm text-muted mb-1">{line.product.category.name}</p>}
                    <Link to={`/product/${line.product.slug}`} className="font-serif text-xl text-primary hover:text-muted transition-colors">
                      {line.product.name}
                    </Link>
                    <p className="text-sm text-muted mt-1">{formatPrice(line.product.price)}</p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center border border-border/40">
                        <button onClick={() => updateQuantity(line.product.id, line.quantity - 1)} className="px-3 py-2 text-muted hover:text-primary transition-colors" aria-label="Decrease">
                          <Minus size={14} strokeWidth={1.5} />
                        </button>
                        <span className="px-4 text-sm">{line.quantity}</span>
                        <button onClick={() => updateQuantity(line.product.id, line.quantity + 1)} className="px-3 py-2 text-muted hover:text-primary transition-colors" aria-label="Increase">
                          <Plus size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{formatPrice(line.product.price * line.quantity)}</span>
                        <button onClick={() => removeFromCart(line.product.id)} className="text-muted hover:text-red-600 transition-colors" aria-label="Remove">
                          <Trash2 size={16} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-background p-8 sticky top-28">
              <h2 className="font-serif text-2xl text-primary mb-6">Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-primary">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span className="text-primary">{subtotal >= 50000 ? 'Free' : 'Calculated at checkout'}</span>
                </div>
              </div>
              <div className="border-t border-border/20 pt-4 flex justify-between items-center mb-6">
                <span className="label-sm text-muted">TOTAL</span>
                <span className="font-serif text-2xl text-primary">{formatPrice(subtotal)}</span>
              </div>
              <Link to="/checkout" className="btn-lux text-primary border-primary w-full block text-center">
                <span>CHECKOUT</span>
              </Link>
              <Link to="/shop" className="block text-center label-sm text-muted hover:text-primary transition-colors mt-4">
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
