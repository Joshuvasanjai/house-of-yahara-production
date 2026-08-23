import { supabase } from '@/lib/supabase';
import type { Collection, CollectionItem, Product } from '@/types';

export async function fetchCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data || []) as unknown as Collection[];
}

export async function fetchCollectionBySlug(slug: string): Promise<Collection | null> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as Collection | null;
}

export async function fetchCollectionProducts(collectionId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('collection_items')
    .select('product:products(*, category:categories(*), product_images(*))')
    .eq('collection_id', collectionId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data || [])
    .filter((item) => item.product)
    .map((item) => item.product as unknown as Product);
}
