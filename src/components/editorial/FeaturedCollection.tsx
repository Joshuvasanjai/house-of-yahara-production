import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { fetchCollections, fetchCollectionProducts } from '@/services/collections';
import type { Collection, Product } from '@/types';
import { getPrimaryImage } from '@/services/products';
import { formatPrice } from '@/utils/format';

export function FeaturedCollection() {
  const { settings } = useSiteSettings();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const cols = await fetchCollections();
      setCollections(cols);
      const colId = settings.homepage.featuredCollectionId || cols[0]?.id;
      if (colId) {
        const prods = await fetchCollectionProducts(colId);
        setProducts(prods.slice(0, 3));
      }
      setLoading(false);
    })();
  }, [settings.homepage.featuredCollectionId]);

  const featured = collections.find((c) => c.id === settings.homepage.featuredCollectionId) || collections[0];

  if (loading || !featured) return null;

  return (
    <section className="py-24 md:py-32 bg-soft-white">
      <div className="container-lux">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="label-sm text-muted mb-2">{settings.homepage.featuredCollectionTitle}</p>
            <h2 className="font-serif text-4xl md:text-5xl text-primary">{featured.name}</h2>
          </div>
          <Link
            to={`/collection/${featured.slug}`}
            className="hidden md:flex items-center gap-2 label-sm text-primary link-underline"
          >
            VIEW ALL <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Large image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="md:row-span-2"
          >
            <Link to={`/collection/${featured.slug}`} className="block group">
              <div className="relative aspect-[3/4] md:aspect-auto md:h-full overflow-hidden bg-background">
                {featured.image_url && (
                  <img
                    src={featured.image_url}
                    alt={featured.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
              </div>
            </Link>
          </motion.div>

          {/* Description + products */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <p className="text-muted text-sm leading-relaxed mb-6">{featured.description}</p>
            <Link to={`/collection/${featured.slug}`} className="label-sm text-primary link-underline w-fit">
              EXPLORE COLLECTION
            </Link>
          </motion.div>

          {/* Product images */}
          {products.slice(0, 2).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
            >
              <Link to={`/product/${product.slug}`} className="block group">
                <div className="relative aspect-[3/4] overflow-hidden bg-background">
                  <img
                    src={getPrimaryImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="font-serif text-lg">{product.name}</h3>
                  <p className="text-sm text-muted">{formatPrice(product.price)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="md:hidden mt-8 text-center">
          <Link to={`/collection/${featured.slug}`} className="label-sm text-primary link-underline">
            VIEW ALL
          </Link>
        </div>
      </div>
    </section>
  );
}
