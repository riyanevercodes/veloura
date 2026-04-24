import { clientConfig } from '../config/client.config';

export function formatPrice(price: number | string): string {
  const amount = typeof price === 'string' ? parseFloat(price) : price;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: clientConfig.currency === '₹' ? 'INR' : clientConfig.currency, // Intl needs 3-letter code
    maximumFractionDigits: 0,
  }).format(amount || 0);
}
