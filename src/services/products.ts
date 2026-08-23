import { supabase } from '@/lib/supabase';
import type { Product, Category, ProductImage } from '@/types';

export async function fetchProducts(filters?: {
  categoryId?: string;
  search?: string;
  featured?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'newest';
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, category:categories(*), product_images(*)')
    .eq('hidden', false);

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`);
  }

  if (filters?.featured) {
    query = query.eq('featured', true);
  }

  if (filters?.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters?.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }

  if (filters?.inStockOnly) {
    query = query.gt('stock', 0);
  }

  switch (filters?.sortBy) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    default:
      query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as unknown as Product[];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), product_images(*)')
    .eq('slug', slug)
    .eq('hidden', false)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as Product | null;
}

export async function fetchFeaturedProducts(limit = 6): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), product_images(*)')
    .eq('hidden', false)
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data || []) as unknown as Product[];
}

export async function fetchRelatedProducts(categoryId: string, excludeId: string, limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), product_images(*)')
    .eq('hidden', false)
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data || []) as unknown as Product[];
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data || []) as unknown as Category[];
}

export function getPrimaryImage(product: Product): string {
  if (product.product_images && product.product_images.length > 0) {
    const sorted = [...product.product_images].sort((a, b) => a.sort_order - b.sort_order);
    return sorted[0].image_url;
  }
  return '';
}

export function getSecondaryImage(product: Product): string | null {
  if (product.product_images && product.product_images.length > 1) {
    const sorted = [...product.product_images].sort((a, b) => a.sort_order - b.sort_order);
    return sorted[1].image_url;
  }
  return null;
}

export type { ProductImage };
