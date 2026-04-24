import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../utils/formatPrice';
import { Product } from '../../types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  }

  async function toggleStock(id: string, currentStock: boolean) {
    const { error } = await supabase
      .from('products')
      .update({ in_stock: !currentStock })
      .eq('id', id);

    if (!error) {
      setProducts(products.map(p => p.id === id ? { ...p, in_stock: !currentStock } : p));
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (!error) {
      setProducts(products.filter(p => p.id !== id));
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your store inventory</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800"
        >
          Add Product
        </Link>
      </header>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-500">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-500">No products found. Add your first product!</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="group hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image_url || '/placeholder-product.png'}
                          alt=""
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                        <span className="font-semibold text-gray-900">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStock(product.id, product.in_stock)}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                          product.in_stock 
                            ? 'bg-green-50 text-green-600' 
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          title="Edit Product"
                          aria-label="Edit Product"
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          title="Delete Product"
                          aria-label="Delete Product"
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
