import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchCollectionBySlug, fetchCollectionProducts } from '@/services/collections';
import { ProductCard } from '@/components/products/ProductCard';
import type { Collection, Product } from '@/types';

export function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    if (!slug) return;
    (async () => {
      const col = await fetchCollectionBySlug(slug);
      if (!col) {
        setError(true);
        setLoading(false);
        return;
      }
      setCollection(col);
      const prods = await fetchCollectionProducts(col.id);
      setProducts(prods);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-28 min-h-screen bg-soft-white">
        <div className="container-lux py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-background w-1/2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="aspect-[3/4] bg-background" />
                  <div className="h-4 bg-background mt-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="pt-28 min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-3xl text-primary mb-4">Collection not found</p>
          <Link to="/collections" className="label-sm text-primary link-underline">VIEW ALL COLLECTIONS</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-32 pb-20 min-h-screen bg-soft-white">
      <div className="container-lux">
        {/* Hero */}
        {collection.image_url && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-background mb-12"
          >
            <img src={collection.image_url} alt={collection.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-serif text-4xl md:text-6xl text-foreground mb-4"
              >
                {collection.name}
              </motion.h1>
              {collection.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-foreground/80 text-sm md:text-base max-w-lg leading-relaxed"
                >
                  {collection.description}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}

        {!collection.image_url && (
          <div className="mb-12 text-center">
            <h1 className="font-serif text-4xl md:text-6xl text-primary mb-4">{collection.name}</h1>
            {collection.description && (
              <p className="text-muted text-sm max-w-lg mx-auto leading-relaxed">{collection.description}</p>
            )}
          </div>
        )}

        {/* Products */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted">No products in this collection yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
