import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/utils/format';
import type { Policy } from '@/types';

export function AdminPolicies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Policy | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadPolicies(); }, []);

  async function loadPolicies() {
    setLoading(true);
    const { data } = await supabase.from('policies').select('*').order('sort_order');
    setPolicies((data as Policy[]) ?? []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this policy?')) return;
    await supabase.from('policies').delete().eq('id', id);
    loadPolicies();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif text-gray-900">Policies</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-700">
          <Plus size={16} /> Add Policy
        </button>
      </div>

      {loading ? <p className="text-sm text-gray-500">Loading...</p> : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {policies.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{p.title}</p>
                <p className="text-xs text-gray-500">/{p.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setEditing(p); setShowForm(true); }} className="text-gray-400 hover:text-gray-900"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PolicyForm policy={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); loadPolicies(); }} />
      )}
    </div>
  );
}

function PolicyForm({ policy, onClose, onSaved }: { policy: Policy | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: policy?.title ?? '',
    slug: policy?.slug ?? '',
    content: policy?.content ?? '',
    is_active: policy?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { title: form.title, slug: form.slug || slugify(form.title), content: form.content, is_active: form.is_active };
    let result;
    if (policy) { result = await supabase.from('policies').update(payload).eq('id', policy.id); }
    else { result = await supabase.from('policies').insert(payload); }
    if (result.error) { setError(result.error.message); setSaving(false); return; }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-medium text-gray-900 mb-6">{policy ? 'Edit Policy' : 'New Policy'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900" />
          <input type="text" placeholder="Slug (auto)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900" />
          <textarea required placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900" />
          <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="bg-gray-900 text-white px-6 py-2 text-sm hover:bg-gray-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm text-gray-600">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
