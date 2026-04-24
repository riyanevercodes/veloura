import { supabase } from '../lib/supabase';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return PRODUCTS;
  }
  
  return data as Product[];
}

export async function getProductById(productId: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !data) {
    return PRODUCTS.find((p) => p.id === productId) || null;
  }

  return data as Product;
}