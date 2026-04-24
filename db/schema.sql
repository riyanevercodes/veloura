-- SCHEMA FOR VELOURA E-COMMERCE PHASE 1

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Stores Table (Reserved for Phase 3 Multi-tenancy)
create table if not exists stores (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- 3. Products Table
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid not null, -- Can default to a fixed UUID in Phase 1
  title text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  category text,
  in_stock boolean default true,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- 4. Orders Table
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid not null,
  customer_name text not null,
  phone text not null,
  address text not null,
  total_amount numeric(10,2) not null,
  status text default 'pending', -- pending | confirmed | shipped | delivered | cancelled
  whatsapp_sent boolean default false,
  created_at timestamptz default now()
);

-- 5. Order Items Table
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_title text not null,
  product_price numeric(10,2) not null,
  quantity integer not null check (quantity >= 1),
  subtotal numeric(10,2) not null,
  created_at timestamptz default now()
);

-- 6. Storage Bucket for Images
-- Note: You must create the 'images' bucket manually in Supabase Dashboard and set it to Public.

-- 7. Basic RLS (Row Level Security)
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public Policies (Read-only for Products, Insert-only for Orders)
create policy "Allow public read-only access to products" on products
  for select using (true);

create policy "Allow public insert-only access to orders" on orders
  for insert with check (true);

create policy "Allow public insert-only access to order_items" on order_items
  for insert with check (true);

-- Admin Policies (Full access for authenticated users)
create policy "Allow admin full access to products" on products
  for all to authenticated using (true) with check (true);

create policy "Allow admin full access to orders" on orders
  for all to authenticated using (true) with check (true);

create policy "Allow admin full access to order_items" on order_items
  for all to authenticated using (true) with check (true);
