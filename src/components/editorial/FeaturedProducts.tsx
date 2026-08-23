import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { fetchFeaturedProducts } from '@/services/products';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types';

export function FeaturedProducts() {
  const { settings } = useSiteSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts(8)
      .then((prods) => {
        setProducts(prods);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 md:py-32 bg-soft-white">
        <div className="container-lux text-center">
          <p className="label-sm text-muted">Loading...</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  const hero = products[0];
  const supporting = products.slice(1, 5);

  return (
    <section className="py-24 md:py-32 bg-soft-white">
      <div className="container-lux">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="label-sm text-muted mb-2">{settings.homepage.featuredProductsTitle}</p>
            <p className="text-muted text-sm max-w-md">{settings.homepage.featuredProductsSubtitle}</p>
          </div>
          <Link to="/shop" className="label-sm text-primary link-underline flex items-center gap-2 w-fit">
            VIEW ALL <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

        {/* Large featured + supporting grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="md:col-span-2 lg:row-span-2"
          >
            <Link to={`/product/${hero.slug}`} className="block group">
              <div className="relative aspect-[4/5] md:aspect-[3/4] lg:h-full overflow-hidden bg-background">
                <img
                  src={hero.product_images?.[0]?.image_url ?? ''}
                  alt={hero.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  {hero.category && <p className="label-sm text-muted mb-1">{hero.category.name}</p>}
                  <h3 className="font-serif text-2xl">{hero.name}</h3>
                  <p className="text-sm mt-1">₹{hero.price.toLocaleString('en-IN')}</p>
                </div>
                <span className="label-sm text-primary link-underline hidden md:block">DISCOVER</span>
              </div>
            </Link>
          </motion.div>

          {supporting.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
