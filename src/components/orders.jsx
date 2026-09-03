import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Package, ArrowLeft } from "lucide-react";

import { getOrdersByUser } from "../services/orderApi";

const Orders = () => {
  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => getOrdersByUser(user.id),
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f5] px-8 py-10">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#faf9f5] px-8 py-10">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-red-500">
            Failed to load orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#faf9f5]">
      <div className="mx-auto max-w-[1200px] px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/myAccount"
            className="mb-5 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-700"
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

        {/* No Orders */}
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
              className="mt-6 inline-block rounded-lg bg-green-700 px-6 py-3 text-white hover:bg-green-800"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-[#e8e5dc] bg-white p-6"
              >
                {/* Order Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <h2 className="mt-1 font-semibold text-gray-900">
                      #{order.id}
                    </h2>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Order Date
                    </p>

                    <p className="mt-1 text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Total
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  {/* Status */}
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

                {/* Products */}
                <div className="mt-5 space-y-4">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4"
                    >
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-20 w-20 rounded-xl object-cover"
                      />

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      {/* Price */}
                      <p className="font-semibold text-gray-900">
                        ₹{item.price * item.quantity}
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