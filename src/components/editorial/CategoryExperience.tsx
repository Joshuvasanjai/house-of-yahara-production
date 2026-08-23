import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { fetchCategories } from '@/services/products';
import type { Category } from '@/types';

export function CategoryExperience() {
  const { settings } = useSiteSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || categories.length === 0) return null;

  const active = categories[activeIndex];

  return (
    <section className="relative h-screen min-h-[500px] overflow-hidden bg-primary">
      {/* Background that changes with category */}
      {categories.map((cat, i) => (
        <div
          key={cat.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {cat.image_url && (
            <img
              src={cat.image_url}
              alt={cat.name}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          )}
        </div>
      ))}
      <div className="absolute inset-0 bg-primary/50" />

      <div className="relative z-10 h-full flex flex-col justify-center container-lux">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="label-sm text-foreground/60 mb-8"
        >
          {settings.homepage.categoryTitle}
        </motion.p>

        {/* Desktop: hover-based category list */}
        <div className="hidden md:block">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group inline-block py-2"
              >
                <span
                  className={`font-serif text-5xl lg:text-7xl transition-all duration-500 ${
                    i === activeIndex
                      ? 'text-foreground'
                      : 'text-foreground/30 hover:text-foreground/60'
                  }`}
                >
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile: touch-friendly category list */}
        <div className="md:hidden">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              onClick={() => setActiveIndex(i)}
              className="block py-3"
            >
              <span
                className={`font-serif text-3xl ${
                  i === activeIndex ? 'text-foreground' : 'text-foreground/50'
                }`}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Active category description */}
        <motion.div
          key={active?.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-16 right-6 md:right-16 max-w-xs text-right"
        >
          <p className="text-foreground/70 text-sm leading-relaxed">{active?.description}</p>
        </motion.div>
      </div>
    </section>
  );
}
