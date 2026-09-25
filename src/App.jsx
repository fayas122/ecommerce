import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import AOS from "aos";
import "aos/dist/aos.css";

// ==========================================
// USER PAGES
// ==========================================

import Home from "./pages/user/Home";
import Products from "./pages/user/products";
import ProductDetails from "./pages/user/productDetails";

import Cart from "./components/cart";
import Wishlist from "./components/wishlist";
import Orders from "./components/orders";

import MyAccount from "./pages/user/myAccount";

// ==========================================
// AUTH
// ==========================================

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

// ==========================================
// PROTECTED ROUTES
// ==========================================

import ProtectedRoute from "./components/protectedRoute";
import AuthProtectedRoute from "./components/authprotectedroute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import UserProtectedRoute from "./components/Userprotectedroute";

// ==========================================
// LAYOUTS
// ==========================================

import UserLayout from "./Layouts/UserLayout";
import AdminLayout from "./Layouts/AdminLayout";

// ==========================================
// ADMIN PAGES
// ==========================================

import Dashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/Admin/Orders"
import AdminProducts from "./pages/Admin/AsminProducts";
import Users from "./pages/Admin/Users";

// ==========================================
// REDUX
// ==========================================

import {
  loadWishlist,
} from "./features/wishlist/wishlistSlice";

import {
  loadCart,
} from "./features/cart/cartSlice";

import {
  setUser,
} from "./features/auth/authSlice";

import {
  setAdmin,
} from "./features/auth/adminAuthSlice";

// ==========================================
// API
// ==========================================

import {
  getUserById,
} from "./services/userApi";

function App() {
  const dispatch = useDispatch();

  const [authLoading, setAuthLoading] = useState(true);

  // ==========================================
  // RESTORE AUTHENTICATION
  // ==========================================

  useEffect(() => {
    const restoreAuthentication = async () => {

      // ========================================
      // RESTORE NORMAL USER
      // ========================================

      const userId =
        localStorage.getItem("userId");

      if (userId) {
        try {
          const userData =
            await getUserById(userId);

          // Don't allow admin inside normal auth
          if (userData.role !== "admin") {

            dispatch(
              setUser({
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role:
                  userData.role || "user",
                address:
                  userData.address || null,
              })
            );

            dispatch(
              loadCart(
                userData.cart || []
              )
            );

            dispatch(
              loadWishlist(
                userData.wishlist || []
              )
            );

          } else {

            localStorage.removeItem(
              "userId"
            );

          }

        } catch (error) {

          console.error(
            "Failed to restore user:",
            error
          );

          localStorage.removeItem(
            "userId"
          );
        }
      }

      // ========================================
      // RESTORE ADMIN
      // ========================================

      const adminId =
        localStorage.getItem("adminId");

      if (adminId) {

        try {

          const adminData =
            await getUserById(adminId);

          if (
            adminData.role === "admin"
          ) {

            dispatch(
              setAdmin({
                id: adminData.id,
                name: adminData.name,
                email: adminData.email,
                role: adminData.role,
              })
            );

          } else {

            localStorage.removeItem(
              "adminId"
            );

          }

        } catch (error) {

          console.error(
            "Failed to restore admin:",
            error
          );

          localStorage.removeItem(
            "adminId"
          );
        }
      }

      // ========================================
      // FINISHED
      // ========================================

      setAuthLoading(false);
    };

    restoreAuthentication();

  }, [dispatch]);

  // ==========================================
  // AOS
  // ==========================================

  useEffect(() => {

    AOS.init({
      duration: 2000,
      once: true,
    });

  }, []);

  // ==========================================
  // AUTH LOADING
  // ==========================================

  if (authLoading) {

    return (
      <div className="min-h-screen bg-[#f8f5ee] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-[#173D20]/20 border-t-[#173D20] rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-[#173D20] font-medium">
            Loading...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // ROUTES
  // ==========================================

  return (

    <Routes>

      {/* ======================================
          USER ROUTES
      ====================================== */}

      <Route element={
        <UserProtectedRoute>
          <UserLayout />
        </UserProtectedRoute>
        }>

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

        {/* CART */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* WISHLIST */}

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        {/* ACCOUNT */}

        <Route
          path="/myAccount"
          element={
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          }
        />

        {/* ORDERS */}

        <Route
          path="/myAccount/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

      </Route>


      {/* ======================================
          LOGIN
      ====================================== */}

      <Route
        path="/login"
        element={
          <AuthProtectedRoute>
            <Login />
          </AuthProtectedRoute>
        }
      />


      {/* ======================================
          REGISTER
      ====================================== */}

      <Route
        path="/register"
        element={
          <AuthProtectedRoute>
            <Register />
          </AuthProtectedRoute>
        }
      />
 

      {/* ======================================
          ADMIN ROUTES
      ====================================== */}

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >

        {/* /admin */}

        <Route
          index
          element={<Dashboard />}
        />

        <Route
          path="adminorders"
          element={<AdminOrders />}
        />


        <Route
          path="products"
          element={<AdminProducts />}
        />

        <Route
          path="users"
          element={<Users />}
        />

      </Route>


      {/* ======================================
          404
      ====================================== */}

      <Route
        path="*"
        element={

          <div className="min-h-screen bg-[#f8f5ee] flex items-center justify-center px-6">

            <div className="text-center">

              <h1 className="text-7xl font-bold text-[#173D20]">
                404
              </h1>

              <h2 className="text-2xl font-semibold text-gray-800 mt-4">
                Page Not Found
              </h2>

              <p className="text-gray-500 mt-2">
                The page you are looking for does not exist.
              </p>

              <a
                href="/"
                className="inline-block mt-6 px-6 py-3 bg-[#173D20] text-white rounded-lg hover:bg-[#214B29] transition"
              >
                Back to Home
              </a>

            </div>

          </div>

        }
      />

    </Routes>
  );
}

export default App;