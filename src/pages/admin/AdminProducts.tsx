import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice, slugify } from '@/utils/format';
import type { Product, Category } from '@/types';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadProducts();
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => setCategories((data as Category[]) ?? []));
  }, []);

  async function loadProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });
    if (error) { console.error(error); setLoading(false); return; }
    setProducts((data as Product[]) ?? []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await supabase.from('products').delete().eq('id', id);
    loadProducts();
  }

  async function handleToggleHidden(product: Product) {
    await supabase.from('products').update({ hidden: !product.hidden }).eq('id', product.id);
    loadProducts();
  }

  async function handleToggleFeatured(product: Product) {
    await supabase.from('products').update({ featured: !product.featured }).eq('id', product.id);
    loadProducts();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif text-gray-900">Products</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-500">No products yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{p.category?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-gray-600">{p.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleToggleHidden(p)} className="text-gray-400 hover:text-gray-900" title={p.hidden ? 'Show' : 'Hide'}>
                        {p.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button onClick={() => handleToggleFeatured(p)} className={p.featured ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'} title="Featured">
                        <Star size={16} fill={p.featured ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditing(p); setShowForm(true); }} className="text-gray-400 hover:text-gray-900">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editing}
          categories={categories}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); loadProducts(); }}
        />
      )}
    </div>
  );
}

function ProductForm({ product, categories, onClose, onSaved }: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    short_description: product?.short_description ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0,
    compare_at_price: product?.compare_at_price ?? '',
    category_id: product?.category_id ?? '',
    stock: product?.stock ?? 0,
    sku: product?.sku ?? '',
    featured: product?.featured ?? false,
    hidden: product?.hidden ?? false,
    materials: product?.materials ?? '',
    dimensions: product?.dimensions ?? '',
    care_instructions: product?.care_instructions ?? '',
  });
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<{ id?: string; image_url: string; alt_text: string }[]>(
    product?.product_images?.map((img) => ({ id: img.id, image_url: img.image_url, alt_text: img.alt_text ?? '' })) ?? []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const slug = form.slug || slugify(form.name);
    const payload = {
      name: form.name,
      slug,
      short_description: form.short_description || null,
      description: form.description || null,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      category_id: form.category_id || null,
      stock: Number(form.stock),
      sku: form.sku || null,
      featured: form.featured,
      hidden: form.hidden,
      materials: form.materials || null,
      dimensions: form.dimensions || null,
      care_instructions: form.care_instructions || null,
    };

    let productId = product?.id;

    if (product) {
      const { error: updError } = await supabase.from('products').update(payload).eq('id', product.id);
      if (updError) { setError(updError.message); setSaving(false); return; }
    } else {
      const { data, error: insError } = await supabase.from('products').insert(payload).select('id').single();
      if (insError) { setError(insError.message); setSaving(false); return; }
      productId = data.id;
    }

    // Update images
    if (productId) {
      // Delete removed images
      const existingIds = images.filter((img) => img.id).map((img) => img.id);
      if (product?.product_images && product.product_images.length > 0) {
        const removed = product.product_images.filter((img) => !existingIds.includes(img.id));
        for (const img of removed) {
          await supabase.from('product_images').delete().eq('id', img.id);
        }
      }
      // Insert new images
      const newImages = images.filter((img) => !img.id && img.image_url);
      if (newImages.length > 0) {
        await supabase.from('product_images').insert(
          newImages.map((img, i) => ({
            product_id: productId,
            image_url: img.image_url,
            alt_text: img.alt_text || null,
            sort_order: i,
          }))
        );
      }
    }

    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-medium text-gray-900 mb-6">{product ? 'Edit Product' : 'New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name"><input required type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClass} /></Field>
            <Field label="Slug (optional)"><input type="text" value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="auto-generated" className={inputClass} /></Field>
          </div>
          <Field label="Short Description"><input type="text" value={form.short_description} onChange={(e) => update('short_description', e.target.value)} className={inputClass} /></Field>
          <Field label="Description"><textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} className={inputClass} /></Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Price (₹)"><input required type="number" value={form.price} onChange={(e) => update('price', e.target.value)} className={inputClass} /></Field>
            <Field label="Compare At (₹)"><input type="number" value={form.compare_at_price} onChange={(e) => update('compare_at_price', e.target.value)} className={inputClass} /></Field>
            <Field label="Stock"><input required type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} className={inputClass} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select value={form.category_id} onChange={(e) => update('category_id', e.target.value)} className={inputClass}>
                <option value="">None</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="SKU"><input type="text" value={form.sku} onChange={(e) => update('sku', e.target.value)} className={inputClass} /></Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Materials"><input type="text" value={form.materials} onChange={(e) => update('materials', e.target.value)} className={inputClass} /></Field>
            <Field label="Dimensions"><input type="text" value={form.dimensions} onChange={(e) => update('dimensions', e.target.value)} className={inputClass} /></Field>
            <Field label="Care Instructions"><input type="text" value={form.care_instructions} onChange={(e) => update('care_instructions', e.target.value)} className={inputClass} /></Field>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.hidden} onChange={(e) => update('hidden', e.target.checked)} /> Hidden
            </label>
          </div>

          {/* Images */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Images</p>
            <div className="space-y-2">
              {images.map((img, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={img.image_url} onChange={(e) => {
                    const next = [...images]; next[i] = { ...next[i], image_url: e.target.value }; setImages(next);
                  }} placeholder="Image URL" className={inputClass} />
                  <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-600 px-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Add image URL" className={inputClass} />
                <button type="button" onClick={() => { if (imageUrl) { setImages([...images, { image_url: imageUrl, alt_text: '' }]); setImageUrl(''); } }} className="bg-gray-100 px-3 text-sm">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={saving} className="bg-gray-900 text-white px-6 py-2 text-sm hover:bg-gray-700 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass = 'w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      {children}
    </div>
  );
}
