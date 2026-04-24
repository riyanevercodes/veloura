import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { clientConfig } from '../../config/client.config';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    image_url: '',
    in_stock: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  async function fetchProduct() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      setForm({
        title: data.title,
        price: data.price.toString(),
        category: data.category || '',
        description: data.description || '',
        image_url: data.image_url || '',
        in_stock: data.in_stock,
      });
    }
    setFetching(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const productData = {
      store_id: clientConfig.defaultStoreId,
      title: form.title,
      price: parseFloat(form.price),
      category: form.category,
      description: form.description,
      image_url: form.image_url,
      in_stock: form.in_stock,
    };

    try {
      if (isEdit) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);
        if (error) throw error;
      }
      navigate('/admin/products');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save product.');
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <div className="py-20 text-center text-gray-500">Loading product data...</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        <p className="mt-1 text-sm text-gray-500">Enter the details of your product below</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Product Title</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:bg-white focus:outline-none"
                placeholder="e.g. Classic White Tee"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Price (INR)</label>
              <input
                required
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:bg-white focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:bg-white focus:outline-none"
                placeholder="e.g. Clothing"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Image URL</label>
              <input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:bg-white focus:outline-none"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:bg-white focus:outline-none"
                placeholder="Describe your product..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.in_stock}
                  onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                  className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm font-semibold text-gray-900">Mark as In Stock</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-2xl bg-black py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98]"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="rounded-2xl border border-gray-200 bg-white px-8 py-4 text-sm font-bold text-gray-900 transition-all hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
