import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/utils/format';
import type { Category } from '@/types';

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadCategories(); }, []);

  async function loadCategories() {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCategories((data as Category[]) ?? []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category? Products in it will remain but lose their category.')) return;
    await supabase.from('categories').delete().eq('id', id);
    loadCategories();
  }

  async function handleReorder(cat: Category, direction: 'up' | 'down') {
    const sorted = [...categories];
    const idx = sorted.findIndex((c) => c.id === cat.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx], b = sorted[swapIdx];
    await Promise.all([
      supabase.from('categories').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('categories').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    loadCategories();
  }

  async function toggleActive(cat: Category) {
    await supabase.from('categories').update({ is_active: !cat.is_active }).eq('id', cat.id);
    loadCategories();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif text-gray-900">Categories</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-700 transition-colors">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? <p className="text-sm text-gray-500">Loading...</p> : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {categories.map((cat, i) => (
            <div key={cat.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                {cat.image_url && <img src={cat.image_url} alt="" className="w-10 h-10 object-cover" />}
                <div>
                  <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-500">/{cat.slug}</p>
                </div>
                <button onClick={() => toggleActive(cat)} className={`text-xs px-2 py-1 ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {cat.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleReorder(cat, 'up')} disabled={i === 0} className="text-gray-400 hover:text-gray-900 disabled:opacity-30"><ArrowUp size={16} /></button>
                <button onClick={() => handleReorder(cat, 'down')} disabled={i === categories.length - 1} className="text-gray-400 hover:text-gray-900 disabled:opacity-30"><ArrowDown size={16} /></button>
                <button onClick={() => { setEditing(cat); setShowForm(true); }} className="text-gray-400 hover:text-gray-900"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(cat.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <CategoryForm category={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); loadCategories(); }} />
      )}
    </div>
  );
}

function CategoryForm({ category, onClose, onSaved }: { category: Category | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    description: category?.description ?? '',
    image_url: category?.image_url ?? '',
    is_active: category?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || null,
      image_url: form.image_url || null,
      is_active: form.is_active,
    };
    let result;
    if (category) {
      result = await supabase.from('categories').update(payload).eq('id', category.id);
    } else {
      result = await supabase.from('categories').insert(payload);
    }
    if (result.error) { setError(result.error.message); setSaving(false); return; }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-medium text-gray-900 mb-6">{category ? 'Edit Category' : 'New Category'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900" />
          <input type="text" placeholder="Slug (auto)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900" />
          <input type="text" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900" />
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
