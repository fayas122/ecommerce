import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { clearCart } from "../../features/cart/cartSlice";
import { clearWishlist } from "../../features/wishlist/wishlistSlice";

import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  MapPin,
  User,
  LogOut,
  Package,
  ArrowRight,
  Leaf,
} from "lucide-react";

import { logout } from "../../features/auth/authSlice";
import { getOrdersByUser } from "../../services/orderApi";

function MyAccount() {
  const dispatch = useDispatch();

  // ================= REDUX DATA =================

  const user = useSelector((state) => state.auth.user);

  const cartItems = useSelector((state) => state.cart.items || []);

  const wishlistItems = useSelector((state) => state.wishlist.items || []);

  // ================= ORDERS =================

  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => getOrdersByUser(user.id),
    enabled: !!user?.id,
  });

  // ================= LOGOUT =================

  const handleLogout = () => {
  dispatch(clearCart());
  dispatch(clearWishlist());
  dispatch(logout());
};

  // ================= REAL COUNTS =================

  const totalOrders = orders.length;
  const totalCartItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );
  const totalWishlistItems = wishlistItems.length;

  // ================= RECENT ORDERS =================

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  return (
    <section className="min-h-screen bg-[#faf9f5]">
      <main className="mx-auto w-full max-w-[1500px] px-6 py-8 md:px-10 lg:px-14">
        <div className="flex items-center gap-2 mb-10 text-[11px] font-sans text-[#8b8c7d]">

          <Link
            to="/"
            className="hover:text-[#17351f] transition"
          >
            Home
          </Link>

          <span>/</span>

          <span className="text-[#17351f]">
            MyAccount
          </span>

        </div>
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 30 30" className="h-9 w-9" fill="none">
                <path
                  d="M8 26V5M14 26V2M20 26V7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                <path
                  d="M8 9L4 5M8 14L3 11M14 7L19 3M14 12L20 9M20 12L25 8M20 17L26 14"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>

              <span className="font-serif text-[20px] font-medium tracking-[2px] text-[#37422d]">
                WESTEROS
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-semibold text-[#242820]">
              My Account
            </h1>

            <p className="mt-1 text-sm text-[#73786d]">
              Welcome back
              {user?.name ? `, ${user.name}` : ""}. Here's an overview of your
              account.
            </p>
          </div>


        </div>

        {/* ================================================= */}
        {/* STAT CARDS */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* ================= ORDERS ================= */}

          <div className="rounded-2xl border border-[#e7e5dc] bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#73786d]">Total Orders</p>

                <h2 className="mt-2 text-3xl font-semibold text-[#242820]">
                  {ordersLoading ? "..." : totalOrders}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf2e7] text-[#39752e]">
                <ShoppingBag size={22} strokeWidth={1.6} />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#6d7566]">
              Your completed and active orders
            </p>
          </div>

          {/* ================= CART ================= */}

          <div className="rounded-2xl border border-[#e7e5dc] bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#73786d]">Cart Items</p>

                <h2 className="mt-2 text-3xl font-semibold text-[#242820]">
                  {totalCartItems}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf2e7] text-[#39752e]">
                <ShoppingCart size={22} strokeWidth={1.6} />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#6d7566]">
              Products currently in your cart
            </p>
          </div>

          {/* ================= WISHLIST ================= */}

          <div className="rounded-2xl border border-[#e7e5dc] bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#73786d]">Wishlist</p>

                <h2 className="mt-2 text-3xl font-semibold text-[#242820]">
                  {totalWishlistItems}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf2e7] text-[#39752e]">
                <Heart size={22} strokeWidth={1.6} />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#6d7566]">
              Your saved favourite products
            </p>
          </div>

          {/* Logout */}

          <div className="flex justify-center max-h-[50px]">
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2.5 rounded-full border border-[#dfe3d8] bg-white px-5 py-2.5 text-sm font-medium text-[#37422d] shadow-sm transition-all duration-300 hover:border-[#c9d5bf] hover:bg-[#f3f6ef] hover:shadow-md"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#edf2e7] transition-all duration-300 group-hover:bg-[#dfe9d6]">
                <LogOut
                  size={16}
                  strokeWidth={1.8}
                  className="text-[#39752e] transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </span>

              <span>Logout</span>
            </button>
          </div>





        </div>

        {/* ================================================= */}
        {/* DASHBOARD CONTENT */}
        {/* ================================================= */}

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ================================================= */}
          {/* RECENT ORDERS */}
          {/* ================================================= */}

          <div className="rounded-2xl border border-[#e7e5dc] bg-white p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#242820]">
                  Recent Orders
                </h2>

                <p className="mt-1 text-sm text-[#777c72]">
                  Your latest purchases
                </p>
              </div>

              <Link
                to="/myAccount/orders"
                className="flex items-center gap-2 text-green-700 hover:text-green-800"
              >
                View all
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Loading */}

            {ordersLoading && (
              <div className="py-12 text-center text-sm text-[#777c72]">
                Loading your orders...
              </div>
            )}

            {/* Error */}

            {ordersError && (
              <div className="py-12 text-center text-sm text-red-500">
                Failed to load your orders.
              </div>
            )}

            {/* No orders */}

            {!ordersLoading && !ordersError && recentOrders.length === 0 && (
              <div className="py-12 text-center">
                <Package
                  size={40}
                  strokeWidth={1.3}
                  className="mx-auto text-[#a0a69a]"
                />

                <p className="mt-3 text-sm font-medium text-[#4c5248]">
                  No orders yet
                </p>

                <p className="mt-1 text-xs text-[#858b81]">
                  Your recent orders will appear here.
                </p>
              </div>
            )}

            {/* Orders */}

            {!ordersLoading && !ordersError && recentOrders.length > 0 && (
              <div className="mt-6 space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-xl bg-[#f7f8f3] p-4"
                  >
                    {/* Left */}

                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8eedf] text-[#39752e]">
                        <Package size={21} strokeWidth={1.6} />
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-[#292d26]">
                          #{order.id}
                        </h3>

                        <p className="mt-1 text-xs text-[#7b8076]">
                          {order.items?.length || 0} item
                          {order.items?.length === 1 ? "" : "s"}
                          {order.createdAt &&
                            ` · ${new Date(
                              order.createdAt,
                            ).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>

                    {/* Right */}

                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#292d26]">
                        ₹
                        {Number(order.totalAmount || 0).toLocaleString("en-IN")}
                      </p>

                      <span
                        className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] font-medium ${order.status === "Delivered"
                            ? "bg-[#e5f0df] text-[#39752e]"
                            : order.status === "Cancelled"
                              ? "bg-[#f8e4e4] text-[#a33b3b]"
                              : "bg-[#fff1d9] text-[#9a6a19]"
                          }`}
                      >
                        {order.status || "Processing"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================================================= */}
          {/* ACCOUNT OVERVIEW */}
          {/* ================================================= */}

          <div className="rounded-2xl border border-[#e7e5dc] bg-white p-6">
            <h2 className="text-lg font-semibold text-[#242820]">
              Account Overview
            </h2>

            <p className="mt-1 text-sm text-[#777c72]">
              Your account information
            </p>

            <div className="mt-6 space-y-4">
              {/* User */}

              <div className="flex items-center gap-3 rounded-xl bg-[#f7f8f3] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8eedf] text-[#39752e]">
                  <User size={20} strokeWidth={1.6} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-[#858b81]">Name</p>

                  <p className="truncate text-sm font-medium text-[#292d26]">
                    {user?.name || "Not available"}
                  </p>
                </div>
              </div>

              {/* Email */}

              <div className="rounded-xl bg-[#f7f8f3] p-4">
                <p className="text-xs text-[#858b81]">Email</p>

                <p className="mt-1 truncate text-sm font-medium text-[#292d26]">
                  {user?.email || "Not available"}
                </p>
              </div>

              {/* Address */}

              {user?.address && (
                <div className="mt-4 rounded-xl bg-[#f7f8f3] p-4">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={20}
                      strokeWidth={1.6}
                      className="mt-0.5 shrink-0 text-[#39752e]"
                    />

                    <div>
                      <p className="text-xs text-[#858b81]">
                        Saved Address
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#292d26]">
                        {user.address.fullName}
                      </p>

                      <p className="mt-1 text-sm text-[#666d60]">
                        {user.address.addressLine}
                      </p>

                      <p className="text-sm text-[#666d60]">
                        {user.address.city}, {user.address.state}
                      </p>

                      <p className="text-sm text-[#666d60]">
                        PIN: {user.address.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* SUSTAINABILITY */}
        {/* ================================================= */}

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#dfe6d6] bg-[#f0f3e6] px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e1ead9]">
            <Leaf size={20} strokeWidth={1.5} className="text-[#39752e]" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#326126]">
              Go Green, Live Sustainable
            </h3>

            <p className="mt-0.5 text-xs text-[#666d60]">
              Thank you for supporting eco-friendly bamboo living.
            </p>
          </div>
        </div>
      </main>
    </section>
  );
}

export default MyAccount;
