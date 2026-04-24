import { Product } from '../types';

/**
 * DEMO FALLBACK PRODUCTS
 * ----------------------
 * This array is only used as a fallback when Supabase returns no products
 * (e.g. during development or before a client's products are uploaded).
 *
 * To add real products:
 *   → Log in to the Seller Portal at /admin/login
 *   → Go to Products → Add New Product
 *
 * Leave this array EMPTY for production deployments.
 */
export const PRODUCTS: Product[] = [];
