export interface Product {
  id: string;
  store_id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  in_stock: boolean;
  created_by?: string;
  created_at?: string;
}

export interface Order {
  id: string;
  store_id: string;
  customer_name: string;
  phone: string;
  address: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  whatsapp_sent: boolean;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_title: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

export interface User {
  id: string;
  email: string;
  store_id?: string;
  created_at: string;
}
