import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Check } from 'lucide-react';
import { fetchProducts, fetchCategories } from '@/services/products';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product, Category } from '@/types';
import { cn } from '@/utils/format';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get('search') ?? '';
  const categorySlug = searchParams.get('category') ?? '';
  const featured = searchParams.get('featured') === 'true';
  const sort = (searchParams.get('sort') as SortOption) ?? 'newest';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const inStockOnly = searchParams.get('inStock') === 'true';

  const activeCategoryId = useMemo(
    () => categories.find((c) => c.slug === categorySlug)?.id ?? '',
    [categories, categorySlug]
  );

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts({
      categoryId: activeCategoryId || undefined,
      search: search || undefined,
      featured: featured || undefined,
      sortBy: sort,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStockOnly: inStockOnly || undefined,
    })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategoryId, search, featured, sort, minPrice, maxPrice, inStockOnly]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const hasActiveFilters = categorySlug || featured || minPrice || maxPrice || inStockOnly || search;

  return (
    <div className="pt-28 md:pt-32 pb-20 min-h-screen bg-soft-white">
      <div className="container-lux">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="label-sm text-muted mb-4"
          >
            {search ? `Results for "${search}"` : 'THE COLLECTION'}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl text-primary"
          >
            {categorySlug ? categories.find((c) => c.slug === categorySlug)?.name ?? 'Shop' : 'Shop All'}
          </motion.h1>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/20">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 label-sm text-primary"
          >
            <SlidersHorizontal size={16} strokeWidth={1.5} />
            FILTERS
          </button>
          <div className="flex items-center gap-4">
            <span className="label-sm text-muted hidden sm:inline">
              {loading ? 'Loading...' : `${products.length} ITEMS`}
            </span>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="label-sm bg-transparent text-primary border-none outline-none cursor-pointer"
            >
              <option value="newest">NEWEST</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
              <option value="name">A — Z</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filter sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '260px', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden flex-shrink-0"
              >
                <div className="w-[260px] space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="label-sm text-primary">CATEGORIES</h3>
                      {hasActiveFilters && (
                        <button
                          onClick={() => setSearchParams(new URLSearchParams())}
                          className="text-xs text-muted hover:text-primary transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <ul className="space-y-2">
                      <li>
                        <button
                          onClick={() => updateParam('category', null)}
                          className={cn(
                            'text-sm transition-colors',
                            !categorySlug ? 'text-primary font-medium' : 'text-muted hover:text-primary'
                          )}
                        >
                          All Products
                        </button>
                      </li>
                      {categories.map((cat) => (
                        <li key={cat.id}>
                          <button
                            onClick={() => updateParam('category', cat.slug)}
                            className={cn(
                              'text-sm transition-colors',
                              categorySlug === cat.slug ? 'text-primary font-medium' : 'text-muted hover:text-primary'
                            )}
                          >
                            {cat.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="label-sm text-primary mb-4">PRICE</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                        <input
                          type="radio"
                          name="price"
                          checked={!minPrice && !maxPrice}
                          onChange={() => { updateParam('minPrice', null); updateParam('maxPrice', null); }}
                        />
                        Any Price
                      </label>
                      {[
                        { label: 'Under ₹25,000', min: '', max: '25000' },
                        { label: '₹25,000 — ₹75,000', min: '25000', max: '75000' },
                        { label: '₹75,000 — ₹150,000', min: '75000', max: '150000' },
                        { label: 'Over ₹150,000', min: '150000', max: '' },
                      ].map((range) => (
                        <label key={range.label} className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                          <input
                            type="radio"
                            name="price"
                            checked={minPrice === range.min && maxPrice === range.max}
                            onChange={() => { updateParam('minPrice', range.min || null); updateParam('maxPrice', range.max || null); }}
                          />
                          {range.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="label-sm text-primary mb-4">AVAILABILITY</h3>
                    <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : null)}
                      />
                      In Stock Only
                    </label>
                  </div>

                  <div>
                    <h3 className="label-sm text-primary mb-4">FEATURED</h3>
                    <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => updateParam('featured', e.target.checked ? 'true' : null)}
                      />
                      Featured Only
                    </label>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-background" />
                    <div className="h-4 bg-background mt-4 w-2/3" />
                    <div className="h-3 bg-background mt-2 w-1/3" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-2xl text-primary mb-2">No products found</p>
                <p className="text-sm text-muted">Try adjusting your filters or search terms.</p>
                {hasActiveFilters && (
                  <button
                    onClick={() => setSearchParams(new URLSearchParams())}
                    className="mt-6 label-sm text-primary link-underline"
                  >
                    CLEAR ALL FILTERS
                  </button>
                )}
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {products.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
