import { supabase } from '@/lib/supabase';

export async function submitContact(params: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from('contact_submissions').insert({
    name: params.name,
    email: params.email,
    phone: params.phone ?? null,
    subject: params.subject ?? null,
    message: params.message,
  });
  return { error: error?.message ?? null };
}

export async function subscribeNewsletter(email: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email }, { onConflict: 'email' });
  return { error: error?.message ?? null };
}

export async function fetchContactSubmissions() {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateContactSubmissionStatus(id: string, status: string) {
  const { error } = await supabase
    .from('contact_submissions')
    .update({ status })
    .eq('id', id);
  return { error: error?.message ?? null };
}
