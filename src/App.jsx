import { Routes, Route } from "react-router-dom";

// User pages
import Home from "./pages/user/Home";
import Products from "./pages/user/products";
import ProductDetails from "./pages/user/productDetails";
import Cart from "./components/cart";
import Wishlist from "./components/wishlist";
import MyAccount from "./pages/user/myAccount";
import Orders from "./components/orders";

// Auth pages
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ProtectedRoute from "./components/protectedRoute";
import AuthProtectedRoute from "./components/authprotectedroute";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { loadWishlist } from "./features/wishlist/wishlistSlice";
import { getUserById } from "./services/userApi";
import { loadCart } from "./features/cart/cartSlice";
import { setUser } from "./features/auth/authSlice";

import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  const dispatch = useDispatch();

  // Used to wait until authentication is restored
  const [authLoading, setAuthLoading] = useState(true);

  // Restore logged-in user after refresh
  useEffect(() => {
    const restoreUser = async () => {
      const userId = localStorage.getItem("userId");

      // No logged-in user
      if (!userId) {
        setAuthLoading(false);
        return;
      }

      try {
        // Get user from db.json
        const userData = await getUserById(userId);

        // Restore authenticated user
        dispatch(
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            address: userData.address || null,
          })
        );

        // Restore cart
        dispatch(loadCart(userData.cart || []));

        // Restore wishlist
        dispatch(loadWishlist(userData.wishlist || []));
      } catch (error) {
        console.error("Failed to restore user:", error);

        // User no longer exists
        localStorage.removeItem("userId");
      } finally {
        // Authentication check completed
        setAuthLoading(false);
      }
    };

    restoreUser();
  }, [dispatch]);

  // AOS initialization
  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: true,
    });
  }, []);

  // Wait until authentication is restored
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9f5]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#173D20] border-t-transparent"></div>

          <p className="text-sm text-gray-600">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ================= USER ROUTES ================= */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/products"
        element={<Products />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />

      {/* ================= PROTECTED ROUTES ================= */}

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/myAccount"
        element={
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>
        }
      />

      {/* Orders should also be protected */}
      <Route
        path="/myAccount/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      {/* ================= AUTH ROUTES ================= */}

      <Route
        path="/login"
        element={
          <AuthProtectedRoute>
            <Login />
          </AuthProtectedRoute>
        }
      />

      <Route
        path="/register"
        element={
          <AuthProtectedRoute>
            <Register />
          </AuthProtectedRoute>
        }
      />

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <h1 className="p-10 text-2xl">
            404 - Page Not Found
          </h1>
        }
      />
    </Routes>
  );
}

export default App;