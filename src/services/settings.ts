import { supabase } from '@/lib/supabase';
import type { SiteSettings, Policy } from '@/types';

export async function fetchSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from('website_settings')
    .select('settings')
    .eq('id', 1)
    .maybeSingle();

  if (error) throw error;
  return data?.settings as SiteSettings | null;
}

export async function saveSettings(settings: SiteSettings): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('website_settings')
    .upsert({ id: 1, settings: settings as unknown as Record<string, unknown> });

  return { error: error?.message ?? null };
}

export async function fetchPolicies(): Promise<Policy[]> {
  const { data, error } = await supabase
    .from('policies')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data || []) as unknown as Policy[];
}

export async function fetchPolicyBySlug(slug: string): Promise<Policy | null> {
  const { data, error } = await supabase
    .from('policies')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as Policy | null;
}
