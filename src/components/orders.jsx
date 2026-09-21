import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Package, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";

import { getOrdersByUser } from "../services/orderApi";
import Navbar from "./navbar";

const Orders = () => {
  const user = useSelector((state) => state.auth.user);

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => getOrdersByUser(user.id),
    enabled: !!user?.id,
  });

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f5]">

        {/* FIXED NAVBAR */}
        <div className="fixed left-0 right-0 top-0 z-50">
          <Navbar />
        </div>

        <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-[100px]">
          <p className="text-gray-500">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <div className="min-h-screen bg-[#faf9f5]">

        {/* FIXED NAVBAR */}
        <div className="fixed left-0 right-0 top-0 z-50">
          <Navbar />
        </div>

        <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-[100px]">
          <p className="text-red-500">
            Failed to load orders.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ORDERS PAGE
  // =========================

  return (
    <section className="min-h-screen bg-[#faf9f5]">

      {/* =========================
          FIXED NAVBAR
      ========================== */}

      <div className="fixed left-0 right-0 top-0 z-50">
        <Navbar />
      </div>

      {/* =========================
          PAGE CONTENT
      ========================== */}

      <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-[100px]">

        {/* =========================
            HEADER
        ========================== */}

        <div className="mb-8">

          <Link
            to="/myAccount"
            className="mb-5 inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-green-700"
          >
            <ArrowLeft size={18} />
            Back to My Account
          </Link>

          <h1 className="text-3xl font-semibold text-[#252a24]">
            My Orders
          </h1>

          <p className="mt-2 text-gray-500">
            View all your orders and their current status.
          </p>

        </div>

        {/* =========================
            NO ORDERS
        ========================== */}

        {orders.length === 0 ? (

          <div className="rounded-2xl border border-[#e8e5dc] bg-white p-12 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#edf3e8]">

              <Package
                size={30}
                className="text-green-700"
              />

            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-500">
              You haven't placed any orders yet.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-lg bg-green-700 px-6 py-3 text-white transition hover:bg-green-800"
            >
              Start Shopping
            </Link>

          </div>

        ) : (

          /* =========================
             ORDERS LIST
          ========================== */

          <div className="space-y-5">

            {orders.map((order) => (

              <div
                key={order.id}
                className="rounded-2xl border border-[#e8e5dc] bg-white p-6"
              >

                {/* =========================
                    ORDER HEADER
                ========================== */}

                <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">

                  {/* ORDER ID */}

                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <h2 className="mt-1 font-semibold text-gray-900">
                      #{order.id}
                    </h2>
                  </div>

                  {/* ORDER DATE */}

                  <div>
                    <p className="text-sm text-gray-500">
                      Order Date
                    </p>

                    <p className="mt-1 text-gray-800">
                      {new Date(
                        order.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  {/* TOTAL */}

                  <div>
                    <p className="text-sm text-gray-500">
                      Total
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  {/* STATUS */}

                  <span
                    className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {order.status}
                  </span>

                </div>

                {/* =========================
                    PRODUCTS
                ========================== */}

                <div className="mt-5 space-y-4">

                  {order.items?.map((item, index) => (

                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center gap-4"
                    >

                      {/* PRODUCT IMAGE */}

                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-20 w-20 rounded-xl object-cover"
                      />

                      {/* PRODUCT DETAILS */}

                      <div className="flex-1">

                        <h3 className="font-medium text-gray-900">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                      </div>

                      {/* PRICE */}

                      <p className="font-semibold text-gray-900">
                        ₹
                        {(
                          Number(item.price) *
                          Number(item.quantity)
                        ).toLocaleString("en-IN")}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </section>
  );
};

export default Orders;