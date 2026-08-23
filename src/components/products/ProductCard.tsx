import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { getPrimaryImage, getSecondaryImage } from '@/services/products';
import { formatPrice, cn } from '@/utils/format';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useState } from 'react';

type ProductCardProps = {
  product: Product;
  className?: string;
  index?: number;
};

export function ProductCard({ product, className, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const primaryImage = getPrimaryImage(product);
  const secondaryImage = getSecondaryImage(product);
  const wishlisted = isWishlisted(product.id);
  const [hovering, setHovering] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void toggleWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      className={cn('group', className)}
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div
          className="relative aspect-[3/4] overflow-hidden bg-background"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {primaryImage && (
            <img
              src={primaryImage}
              alt={product.name}
              loading="lazy"
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-all duration-700',
                hovering && secondaryImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100 group-hover:scale-105'
              )}
            />
          )}
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={product.name}
              loading="lazy"
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-all duration-700',
                hovering ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              )}
            />
          )}

          {/* Overlay actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleWishlist}
              className={cn(
                'w-9 h-9 flex items-center justify-center bg-soft-white/80 backdrop-blur-sm transition-all hover:bg-soft-white',
                wishlisted ? 'text-red-600' : 'text-primary'
              )}
              aria-label="Add to wishlist"
            >
              <Heart size={16} strokeWidth={1.5} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-soft-white/90 backdrop-blur-sm py-3 text-xs uppercase tracking-wide-sm text-primary hover:bg-soft-white transition-colors"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              Add to Cart
            </button>
            <button
              className="w-12 flex items-center justify-center bg-soft-white/90 backdrop-blur-sm text-primary hover:bg-soft-white transition-colors"
              aria-label="Quick view"
            >
              <Eye size={16} strokeWidth={1.5} />
            </button>
          </div>

          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="absolute top-3 left-3 bg-primary text-foreground text-xs px-2 py-1 tracking-wide-sm">
              SALE
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-3 left-3 bg-foreground/80 text-primary text-xs px-2 py-1 tracking-wide-sm">
              SOLD OUT
            </span>
          )}
        </div>

        <div className="mt-4 text-center md:text-left">
          {product.category && (
            <p className="label-sm text-muted mb-1">{product.category.name}</p>
          )}
          <h3 className="font-serif text-lg leading-tight">{product.name}</h3>
          <div className="flex items-center gap-2 justify-center md:justify-start mt-1">
            <span className="text-sm">{formatPrice(product.price)}</span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-xs text-muted line-through">{formatPrice(product.compare_at_price)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
