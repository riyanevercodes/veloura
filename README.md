Veloura Essentials

Started as a college assignment. Got a bit carried away.


What it is

A functioning e-commerce store where you can browse products, add to cart, checkout, and track your orders. There is also a separate admin panel to manage products and orders.


Stack
| Layer          | Tech |

| Frontend       | React 19, TypeScript, Tailwind CSS 
| Backend and DB | Supabase (Postgres + Auth) 
| Build          | Vite 
| Deploy         | Vercel 

Run it locally

```bash
git clone https://github.com/riyanevercodes/veloura.git
cd veloura
npm install
```

Add a `.env` file with your own Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev
```

Without the `.env` it falls back to local seed data automatically.
