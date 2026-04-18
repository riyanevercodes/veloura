import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch {
      // Logout errors are non-fatal for UI.
    }
  }

  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight text-gray-900"
          >
            Veloura
          </Link>
          <nav className="hidden items-center gap-4 sm:flex">
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900 transition-colors duration-200"
              }
            >
              Shop
            </NavLink>
            <Link
              to="/cart"
              state={{ from: location.pathname }}
              className="rounded-md border border-transparent px-2 py-1 text-sm text-gray-600 transition duration-200 hover:bg-[#f5f5f5] hover:text-gray-900"
            >
              Cart{cartCount ? ` (${cartCount})` : ""}
            </Link>
            <NavLink
            to="/orders"
            className={({ isActive }) =>
            isActive
              ? "text-gray-900"
              : "text-gray-600 hover:text-gray-900 transition-colors duration-200"
            }
            >
              Orders
            </NavLink>
          </nav>
        </div>
        

        <div className="flex items-center gap-3">
          {!loading && user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-gray-600 md:inline">
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm text-gray-900 transition-colors duration-200 hover:bg-[#f5f5f5]"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm text-gray-900 transition-colors duration-200 hover:bg-[#f5f5f5]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-black px-3 py-1.5 text-sm text-white transition-colors duration-200 hover:bg-black/90"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
