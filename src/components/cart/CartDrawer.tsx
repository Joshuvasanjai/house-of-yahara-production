import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice, cn } from '@/utils/format';
import { getPrimaryImage } from '@/services/products';

export function CartDrawer() {
  const { isOpen, closeCart, lines, subtotal, count, updateQuantity, removeFromCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-primary/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-0 top-0 bottom-0 z-[71] w-full max-w-md bg-soft-white flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/20">
              <h2 className="font-serif text-xl tracking-wide-sm">
                Your Cart {count > 0 && <span className="text-muted text-sm">({count})</span>}
              </h2>
              <button onClick={closeCart} className="text-muted hover:text-primary transition-colors" aria-label="Close cart">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <ShoppingBag size={48} strokeWidth={1} className="text-border mb-4" />
                <p className="font-serif text-2xl text-primary mb-2">Your cart is empty</p>
                <p className="text-sm text-muted text-center mb-8">
                  Discover our collection of curated objects for the modern home.
                </p>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="btn-lux text-primary border-primary"
                >
                  <span>EXPLORE SHOP</span>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                  {lines.map((line) => {
                    const image = getPrimaryImage(line.product);
                    return (
                      <div key={line.product.id} className="flex gap-4">
                        <Link
                          to={`/product/${line.product.slug}`}
                          onClick={closeCart}
                          className="flex-shrink-0"
                        >
                          <div className="w-24 h-32 bg-background overflow-hidden">
                            {image && (
                              <img
                                src={image}
                                alt={line.product.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            )}
                          </div>
                        </Link>
                        <div className="flex-1 flex flex-col">
                          <Link
                            to={`/product/${line.product.slug}`}
                            onClick={closeCart}
                            className="font-serif text-lg leading-tight hover:text-muted transition-colors"
                          >
                            {line.product.name}
                          </Link>
                          {line.product.category && (
                            <p className="label-sm text-muted mt-1">{line.product.category.name}</p>
                          )}
                          <p className="text-sm mt-1">{formatPrice(line.product.price)}</p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center border border-border/40">
                              <button
                                onClick={() => updateQuantity(line.product.id, line.quantity - 1)}
                                className="px-2 py-1.5 text-muted hover:text-primary transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} strokeWidth={1.5} />
                              </button>
                              <span className="px-3 text-sm">{line.quantity}</span>
                              <button
                                onClick={() => updateQuantity(line.product.id, line.quantity + 1)}
                                className="px-2 py-1.5 text-muted hover:text-primary transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} strokeWidth={1.5} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(line.product.id)}
                              className="text-xs text-muted hover:text-primary transition-colors underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-border/20 px-6 py-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="label-sm text-muted">SUBTOTAL</span>
                    <span className="font-serif text-xl">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="text-xs text-muted">Shipping and taxes calculated at checkout.</p>
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/checkout"
                      onClick={closeCart}
                      className={cn(
                        'btn-lux text-primary border-primary w-full'
                      )}
                    >
                      <span>CHECKOUT</span>
                    </Link>
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="text-center label-sm text-muted hover:text-primary transition-colors pt-1"
                    >
                      VIEW FULL CART
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
