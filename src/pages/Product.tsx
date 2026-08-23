import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Heart, ShoppingBag, ChevronLeft, ChevronRight, X, Truck, RotateCcw, Shield, Check } from 'lucide-react';
import { fetchProductBySlug, fetchRelatedProducts, getPrimaryImage } from '@/services/products';
import { ProductCard } from '@/components/products/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import type { Product } from '@/types';
import { formatPrice, cn } from '@/utils/format';

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    setLoading(true);
    setError(false);
    setSelectedImage(0);
    setQuantity(1);
    if (!slug) return;
    fetchProductBySlug(slug)
      .then((p) => {
        if (!p) {
          setError(true);
          setLoading(false);
          return;
        }
        setProduct(p);
        if (p.category_id) {
          fetchRelatedProducts(p.category_id, p.id, 4).then(setRelated).catch(() => {});
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-28 min-h-screen bg-soft-white">
        <div className="container-lux py-20">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[4/5] bg-background" />
            <div className="space-y-4">
              <div className="h-4 bg-background w-1/4" />
              <div className="h-10 bg-background w-3/4" />
              <div className="h-6 bg-background w-1/3" />
              <div className="h-24 bg-background w-full mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-28 min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-3xl text-primary mb-4">Product not found</p>
          <Link to="/shop" className="label-sm text-primary link-underline">RETURN TO SHOP</Link>
        </div>
      </div>
    );
  }

  const images = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) ?? [];
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
  };

  return (
    <div className="pt-28 md:pt-32 pb-20 min-h-screen bg-soft-white">
      <div className="container-lux">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs text-muted">
          <Link to="/" className="hover:text-primary transition-colors">HOME</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary transition-colors">SHOP</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/shop?category=${product.category.slug}`} className="hover:text-primary transition-colors">
                {product.category.name.toUpperCase()}
              </Link>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image gallery */}
          <div>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-[4/5] overflow-hidden bg-background cursor-zoom-in"
              onClick={() => setFullscreen(true)}
            >
              {images[selectedImage] && (
                <img
                  src={images[selectedImage].image_url}
                  alt={images[selectedImage].alt_text ?? product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>

            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'flex-shrink-0 w-20 h-24 overflow-hidden bg-background transition-all',
                      i === selectedImage ? 'ring-1 ring-primary' : 'opacity-60 hover:opacity-100'
                    )}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:py-8">
            {product.category && (
              <p className="label-sm text-muted mb-3">{product.category.name}</p>
            )}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl text-primary">{formatPrice(product.price)}</span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-sm text-muted line-through">{formatPrice(product.compare_at_price)}</span>
              )}
            </div>

            {product.short_description && (
              <p className="text-muted text-sm leading-relaxed mb-8">{product.short_description}</p>
            )}

            <div className="border-t border-border/20 pt-6 space-y-6">
              {/* Stock status */}
              <div className="flex items-center gap-2 text-sm">
                {product.stock > 0 ? (
                  <>
                    <Check size={16} className="text-green-700" strokeWidth={2} />
                    <span className="text-muted">In Stock — {product.stock} available</span>
                  </>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="label-sm text-muted">QUANTITY</span>
                <div className="flex items-center border border-border/40">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-muted hover:text-primary transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} strokeWidth={1.5} />
                  </button>
                  <span className="px-4 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 text-muted hover:text-primary transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn-lux text-primary border-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag size={16} strokeWidth={1.5} />
                    ADD TO CART
                  </span>
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={cn(
                    'flex items-center justify-center gap-2 px-6 py-4 border transition-all label-sm',
                    wishlisted
                      ? 'border-red-400 text-red-600 bg-red-50'
                      : 'border-border text-muted hover:text-primary hover:border-primary'
                  )}
                >
                  <Heart size={16} strokeWidth={1.5} fill={wishlisted ? 'currentColor' : 'none'} />
                  {wishlisted ? 'SAVED' : 'WISHLIST'}
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="mt-12 space-y-6 border-t border-border/20 pt-8">
              {product.description && (
                <div>
                  <h3 className="label-sm text-primary mb-3">THE STORY</h3>
                  <p className="text-sm text-muted leading-relaxed">{product.description}</p>
                </div>
              )}
              {product.materials && (
                <div>
                  <h3 className="label-sm text-primary mb-2">MATERIALS</h3>
                  <p className="text-sm text-muted">{product.materials}</p>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <h3 className="label-sm text-primary mb-2">DIMENSIONS</h3>
                  <p className="text-sm text-muted">{product.dimensions}</p>
                </div>
              )}
              {product.care_instructions && (
                <div>
                  <h3 className="label-sm text-primary mb-2">CARE</h3>
                  <p className="text-sm text-muted">{product.care_instructions}</p>
                </div>
              )}
            </div>

            {/* Shipping info */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border/20 pt-8">
              <div className="flex items-center gap-3">
                <Truck size={20} strokeWidth={1} className="text-muted" />
                <span className="text-xs text-muted">Free shipping over ₹50,000</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={20} strokeWidth={1} className="text-muted" />
                <span className="text-xs text-muted">14-day returns</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={20} strokeWidth={1} className="text-muted" />
                <span className="text-xs text-muted">2-year warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-24 md:mt-32">
            <h2 className="font-serif text-3xl md:text-4xl text-primary mb-10 text-center">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen viewer */}
      <AnimatePresence>
        {fullscreen && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-primary/95 flex items-center justify-center"
            onClick={() => setFullscreen(false)}
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-6 right-6 text-foreground/70 hover:text-foreground transition-colors"
            >
              <X size={28} strokeWidth={1.5} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((i) => (i - 1 + images.length) % images.length);
              }}
              className="absolute left-4 md:left-8 text-foreground/70 hover:text-foreground transition-colors"
            >
              <ChevronLeft size={32} strokeWidth={1.5} />
            </button>
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={images[selectedImage].image_url}
              alt=""
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((i) => (i + 1) % images.length);
              }}
              className="absolute right-4 md:right-8 text-foreground/70 hover:text-foreground transition-colors"
            >
              <ChevronRight size={32} strokeWidth={1.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
