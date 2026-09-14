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
import { setUser } from "./features/auth/authSlice";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:3000",
});


function App() {
  const dispatch = useDispatch();


  

 useEffect(() => {
  const restoreUser = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      return;
    }

    try {
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

      // Restore cart from db.json
      dispatch(loadCart(userData.cart || []));

      // Restore wishlist from db.json
      dispatch(loadWishlist(userData.wishlist || []));

    } catch (error) {
      console.error("Failed to restore user:", error);

      // If user doesn't exist anymore
      localStorage.removeItem("userId");
    }
  };

  restoreUser();
}, [dispatch]);


  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: true,
    });
  }, []);

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
    </>
  );
}

export default App;
