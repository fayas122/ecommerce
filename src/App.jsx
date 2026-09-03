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

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadWishlist } from "./features/wishlist/wishlistSlice";
import { getUserById } from "./services/userApi";
import { loadCart } from "./features/cart/cartSlice";
import { Toaster } from "react-hot-toast"

function App() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const loadUserCart = async () => {
      if (!user?.id) return;

      try {
        const userData = await getUserById(user.id);

        dispatch(loadCart(userData.cart || []));
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    };

    loadUserCart();
  }, [user?.id, dispatch]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) {
        return;
      }

      try {
        const userData = await getUserById(user.id);

        dispatch(loadCart(userData.cart || []));
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    };

    fetchCart();
  }, [user?.id, dispatch]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) return;

      try {
        const userData = await getUserById(user.id);

        dispatch(loadWishlist(userData.wishlist || []));
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    };

    fetchWishlist();
  }, [user?.id, dispatch]);

  return (
    <>
        <Routes>

      {/* User Routes */}
      <Route path="/" element={<Home />} />

      <Route path="/products" element={<Products />} />

      <Route path="/products/:id" element={<ProductDetails />} />

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

      {/* My Account */}
      <Route
        path="/myAccount"
        element={
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>
        }
      />
      <Route path="/myAccount/orders" element={<Orders />} />

      {/* Auth Routes */}
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

      {/* 404 */}
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>

    <toaster position="top-right" />
    </>
    
  );
}

export default App;
