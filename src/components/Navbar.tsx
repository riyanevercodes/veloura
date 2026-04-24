import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { clientConfig } from '../config/client.config';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isAdminPath = location.pathname.startsWith('/admin');
  const storefrontLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'My Orders', path: '/orders' },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Orders', path: '/admin/orders' },
  ];

  const activeLinks = isAdminPath ? adminLinks : storefrontLinks;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to={isAdminPath ? "/admin/dashboard" : "/"} className="group flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white transition-transform group-hover:rotate-12">
                <span className="text-lg font-bold">{clientConfig.storeName[0]}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-gray-900 leading-none">
                  {clientConfig.storeName}
                </span>
                {isAdminPath && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Seller Portal
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {activeLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-bold transition-colors hover:text-black ${
                  location.pathname === link.path ? 'text-black' : 'text-gray-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            {!isAdminPath && (
              <Link to="/cart" className="relative p-2 text-gray-700 transition-colors hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white shadow-lg">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {isAdminPath && user && (
              <div className="flex items-center gap-4">
                <span className="hidden text-xs font-bold text-gray-400 lg:inline-block">{user.email}</span>
                <button
                  onClick={logout}
                  className="rounded-xl border border-gray-100 bg-white px-4 py-2 text-xs font-bold shadow-sm transition-all hover:bg-gray-50 active:scale-95"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 md:hidden"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="animate-fade-in absolute inset-x-0 top-20 z-50 bg-white p-6 shadow-2xl md:hidden">
          <div className="flex flex-col space-y-6">
            {activeLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-gray-900"
                >
                  {link.name}
                </Link>
              ))}
            {isAdminPath && user && (
              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="w-full rounded-2xl bg-black py-4 text-sm font-bold text-white"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
