import { BrowserRouter, Route, Routes } from "react-router-dom";
import { clientConfig } from "./config/client.config";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Admin Pages
import AdminLogin from "./admin/pages/Login";
import AdminDashboard from "./admin/pages/Dashboard";
import AdminProducts from "./admin/pages/Products";
import AdminOrders from "./admin/pages/Orders";
import AdminProductForm from "./admin/pages/ProductForm";

export default function AppMain() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex min-h-screen flex-col bg-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Storefront Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/*"
                  element={
                    <RequireAuth>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="products/new" element={<AdminProductForm />} />
                        <Route path="products/:id/edit" element={<AdminProductForm />} />
                        <Route path="orders" element={<AdminOrders />} />
                        {/* Add more admin routes here */}
                      </Routes>
                    </RequireAuth>
                  }
                />
              </Routes>
            </main>
            <footer className="border-t border-gray-50 py-12 text-center flex flex-col items-center justify-center space-y-2">
              <p className="text-sm text-gray-400">{clientConfig.footerText}</p>
              <p className="text-xs text-gray-400">
                Built by <a href="https://portfolio-kappa-lyart-69.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-medium text-gray-500 hover:text-gray-900 transition-colors">Riya</a>
              </p>
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
