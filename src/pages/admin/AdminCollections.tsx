import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/utils/format';
import type { Collection, Product } from '@/types';

export function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadCollections();
    supabase.from('products').select('*').order('name').then(({ data }) => setProducts((data as Product[]) ?? []));
  }, []);

  async function loadCollections() {
    setLoading(true);
    const { data } = await supabase.from('collections').select('*').order('sort_order');
    setCollections((data as Collection[]) ?? []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this collection?')) return;
    await supabase.from('collections').delete().eq('id', id);
    loadCollections();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif text-gray-900">Collections</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-700">
          <Plus size={16} /> Add Collection
        </button>
      </div>

      {loading ? <p className="text-sm text-gray-500">Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collections.map((col) => (
            <div key={col.id} className="bg-white border border-gray-200 p-4 flex gap-4">
              {col.image_url && <img src={col.image_url} alt="" className="w-20 h-24 object-cover" />}
              <div className="flex-1">
                <p className="font-medium text-gray-900">{col.name}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{col.description}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { setEditing(col); setShowForm(true); }} className="text-gray-400 hover:text-gray-900"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(col.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <CollectionForm
          collection={editing}
          products={products}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); loadCollections(); }}
        />
      )}
    </div>
  );
}

function CollectionForm({ collection, products, onClose, onSaved }: {
  collection: Collection | null;
  products: Product[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: collection?.name ?? '',
    slug: collection?.slug ?? '',
    description: collection?.description ?? '',
    image_url: collection?.image_url ?? '',
    secondary_image_url: collection?.secondary_image_url ?? '',
    is_active: collection?.is_active ?? true,
  });
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (collection) {
      supabase.from('collection_items').select('product_id').eq('collection_id', collection.id).then(({ data }) => {
        setSelectedProductIds((data ?? []).map((d) => d.product_id));
      });
    }
  }, [collection]);

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || null,
      image_url: form.image_url || null,
      secondary_image_url: form.secondary_image_url || null,
      is_active: form.is_active,
    };

    let collectionId = collection?.id;
    if (collection) {
      const { error: updError } = await supabase.from('collections').update(payload).eq('id', collection.id);
      if (updError) { setError(updError.message); setSaving(false); return; }
    } else {
      const { data, error: insError } = await supabase.from('collections').insert(payload).select('id').single();
      if (insError) { setError(insError.message); setSaving(false); return; }
      collectionId = data.id;
    }

    if (collectionId) {
      await supabase.from('collection_items').delete().eq('collection_id', collectionId);
      if (selectedProductIds.length > 0) {
        await supabase.from('collection_items').insert(
          selectedProductIds.map((pid, i) => ({ collection_id: collectionId, product_id: pid, sort_order: i }))
        );
      }
    }

    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-medium text-gray-900 mb-6">{collection ? 'Edit Collection' : 'New Collection'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900" />
          <input type="text" placeholder="Slug (auto)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900" />
          <input type="text" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900" />
          <input type="text" placeholder="Secondary Image URL" value={form.secondary_image_url} onChange={(e) => setForm({ ...form, secondary_image_url: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900" />
          <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Products</p>
            <div className="max-h-48 overflow-y-auto border border-gray-200 p-2 space-y-1">
              {products.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm py-1">
                  <input type="checkbox" checked={selectedProductIds.includes(p.id)} onChange={() => toggleProduct(p.id)} />
                  {p.name}
                </label>
              ))}
            </div>
          </div>

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
