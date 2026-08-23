import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fetchCollections } from '@/services/collections';
import type { Collection } from '@/types';

export function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections()
      .then(setCollections)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-28 md:pt-32 pb-20 min-h-screen bg-soft-white">
      <div className="container-lux">
        <div className="mb-12 md:mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="label-sm text-muted mb-4"
          >
            CURATED EDIT
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl text-primary"
          >
            Collections
          </motion.h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-background" />
                <div className="h-6 bg-background mt-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {collections.map((col, i) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                <Link to={`/collection/${col.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-background">
                    {col.image_url && (
                      <img
                        src={col.image_url}
                        alt={col.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <h2 className="font-serif text-2xl md:text-3xl text-primary">{col.name}</h2>
                      <p className="text-sm text-muted mt-2 max-w-sm leading-relaxed">{col.description}</p>
                    </div>
                    <ArrowRight size={20} strokeWidth={1.5} className="text-primary flex-shrink-0 mb-2 group-hover:translate-x-2 transition-transform duration-400" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
