import { supabase } from './supabase'
import { PRODUCTS } from '../data/products'

const CONVERSION_RATE = 83.4

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  const rawData = error || !data || data.length === 0 ? PRODUCTS : data
  
  // Convert prices to INR
  return rawData.map(p => ({
    ...p,
    price: Math.round(p.price * CONVERSION_RATE)
  }))
}

export async function getProductById(productId) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  let product = data
  if (error || !data) {
    product = PRODUCTS.find((p) => p.id === productId) || null
  }

  if (!product) return null

  // Convert price to INR
  return {
    ...product,
    price: Math.round(product.price * CONVERSION_RATE)
  }
}