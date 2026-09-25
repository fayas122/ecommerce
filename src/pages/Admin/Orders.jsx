import React, { useMemo, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ShoppingBag,
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  CalendarDays,
  IndianRupee,
  MessageSquare,
  Save,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import {
  getOrders,
  updateOrder,
} from "../../services/orderApi";

function AdminOrders() {
  const queryClient = useQueryClient();

  // =========================
  // STATES
  // =========================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);

  // =========================
  // GET ALL ORDERS
  // =========================

  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getOrders,
  });

  // =========================
  // UPDATE ORDER
  // =========================

  const updateMutation = useMutation({
    mutationFn: ({ userId, orderId, status, deliveryMessage }) =>
      updateOrder(
        userId,
        orderId,
        status,
        deliveryMessage
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });
    },
  });

  // =========================
  // FILTER ORDERS
  // =========================

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchText = search.toLowerCase().trim();

      const orderId = String(order.id || "").toLowerCase();

      const customerName =
        typeof order.customer === "object"
          ? order.customer?.name || ""
          : order.customer || "";

      const customerEmail =
        typeof order.customer === "object"
          ? order.customer?.email || ""
          : order.email || "";

      const matchesSearch =
        orderId.includes(searchText) ||
        customerName.toLowerCase().includes(searchText) ||
        customerEmail.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        (order.status || "Processing") === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // =========================
  // ORDER COUNTS
  // =========================

  const orderCounts = useMemo(() => {
    return {
      all: orders.length,

      processing: orders.filter(
        (order) =>
          (order.status || "Processing") ===
          "Processing"
      ).length,

      shipped: orders.filter(
        (order) => order.status === "Shipped"
      ).length,

      outForDelivery: orders.filter(
        (order) =>
          order.status === "Out for Delivery"
      ).length,

      delivered: orders.filter(
        (order) => order.status === "Delivered"
      ).length,

      cancelled: orders.filter(
        (order) =>
          order.status === "Cancelled"
      ).length,
    };
  }, [orders]);

  // =========================
  // UPDATE HANDLER
  // =========================

  const handleUpdateOrder = async (
    userId,
    orderId,
    status,
    deliveryMessage
  ) => {
    try {
      await updateMutation.mutateAsync({
        userId,
        orderId,
        status,
        deliveryMessage,
      });

      setExpandedOrder(null);
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ee]">
        <div className="flex items-center gap-3 text-sm text-stone-500">
          <RefreshCw
            size={18}
            className="animate-spin"
          />

          Loading orders...
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f5ee] px-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertCircle
            size={30}
            className="text-red-500"
          />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-[#173d20]">
          Failed to load orders
        </h2>

        <p className="mt-2 text-sm text-stone-500">
          Something went wrong while loading orders.
        </p>

        <button
          onClick={() => refetch()}
          className="mt-5 flex items-center gap-2 rounded-lg bg-[#173d20] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#244228]"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ee] px-4 py-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#244228] text-white">
              <Package size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-[#173d20]">
                Orders
              </h1>

              <p className="text-sm text-stone-500">
                Manage and track customer orders
              </p>
            </div>
          </div>

          <div className="text-sm text-stone-500">
            <span className="font-semibold text-[#173d20]">
              {orders.length}
            </span>{" "}
            total orders
          </div>
        </div>

        {/* ================================= */}
        {/* ORDER SUMMARY */}
        {/* ================================= */}

        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <SummaryCard
            title="All"
            count={orderCounts.all}
            icon={<Package size={17} />}
            active={statusFilter === "All"}
            onClick={() => setStatusFilter("All")}
          />

          <SummaryCard
            title="Processing"
            count={orderCounts.processing}
            icon={<Clock size={17} />}
            active={statusFilter === "Processing"}
            onClick={() =>
              setStatusFilter("Processing")
            }
          />

          <SummaryCard
            title="Shipped"
            count={orderCounts.shipped}
            icon={<Truck size={17} />}
            active={statusFilter === "Shipped"}
            onClick={() =>
              setStatusFilter("Shipped")
            }
          />

          <SummaryCard
            title="Out for Delivery"
            count={orderCounts.outForDelivery}
            icon={<Truck size={17} />}
            active={
              statusFilter === "Out for Delivery"
            }
            onClick={() =>
              setStatusFilter("Out for Delivery")
            }
          />

          <SummaryCard
            title="Delivered"
            count={orderCounts.delivered}
            icon={<CheckCircle size={17} />}
            active={statusFilter === "Delivered"}
            onClick={() =>
              setStatusFilter("Delivered")
            }
          />
        </div>

        {/* ================================= */}
        {/* SEARCH + FILTER */}
        {/* ================================= */}

        <div className="mb-6 rounded-xl border border-stone-200 bg-white p-4">

          <div className="flex flex-col gap-3 md:flex-row">

            {/* Search */}

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by order ID, customer name or email..."
                className="w-full rounded-lg border border-stone-200 bg-[#faf9f5] py-2.5 pl-10 pr-4 text-sm text-stone-700 outline-none transition focus:border-[#315c35] focus:ring-1 focus:ring-[#315c35]"
              />
            </div>

            {/* Status Filter */}


          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
            <span>
              Showing{" "}
              <span className="font-medium text-stone-700">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-stone-700">
                {orders.length}
              </span>{" "}
              orders
            </span>

            {(search || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="text-[#315c35] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ================================= */}
        {/* EMPTY */}
        {/* ================================= */}

        {filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-stone-200 bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
              <ShoppingBag
                size={28}
                className="text-stone-400"
              />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#173d20]">
              No orders found
            </h2>

            <p className="mt-2 text-sm text-stone-500">
              Try changing your search or filter.
            </p>
          </div>
        ) : (

          /* ================================= */
          /* ORDER LIST */
          /* ================================= */

          <div className="space-y-4">

            {filteredOrders.map((order) => (
              <AdminOrderCard
                key={order.id}
                order={order}
                expanded={
                  expandedOrder === order.id
                }
                onToggle={() =>
                  setExpandedOrder(
                    expandedOrder === order.id
                      ? null
                      : order.id
                  )
                }
                onUpdate={handleUpdateOrder}
                isUpdating={
                  updateMutation.isPending
                }
              />
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================= */
/* SUMMARY CARD */
/* ================================================= */

function SummaryCard({
  title,
  count,
  icon,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${active
        ? "border-[#315c35] bg-[#edf3ed]"
        : "border-stone-200 bg-white hover:border-[#315c35]"
        }`}
    >
      <div className="flex items-center justify-between">

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${active
            ? "bg-[#244228] text-white"
            : "bg-stone-100 text-stone-500"
            }`}
        >
          {icon}
        </div>

        <span className="text-lg font-semibold text-[#173d20]">
          {count}
        </span>
      </div>

      <p className="mt-3 text-xs text-stone-500">
        {title}
      </p>
    </button>
  );
}

/* ================================================= */
/* ORDER CARD */
/* ================================================= */

function AdminOrderCard({
  order,
  expanded,
  onToggle,
  onUpdate,
  isUpdating,
}) {
  const customer =
    typeof order.customer === "object"
      ? order.customer
      : {
        name:
          order.customer ||
          order.customerName ||
          "Unknown Customer",

        email:
          order.email ||
          order.customerEmail ||
          "",
      };

  const [status, setStatus] = useState(
    order.status || "Processing"
  );

  const [deliveryMessage, setDeliveryMessage] =
    useState(order.deliveryMessage || "");

  const statusInfo = getStatusInfo(status);

  const createdDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    )
    : "Unknown date";

  const itemCount =
    order.items?.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    ) || 0;

  const handleSave = () => {
    onUpdate(
      order.userId,
      order.id,
      status,
      deliveryMessage
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">

      {/* ================================= */}
      {/* MAIN ORDER ROW */}
      {/* ================================= */}

      <div className="p-5">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Order */}

          <div className="flex min-w-0 items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#edf3ed] text-[#315c35]">
              <Package size={20} />
            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="font-semibold text-[#173d20]">
                  #{order.id}
                </h2>

                <StatusBadge
                  status={status}
                  statusInfo={statusInfo}
                />
              </div>

              <p className="mt-1 text-xs text-stone-500">
                Placed on {createdDate}
              </p>
            </div>
          </div>

          {/* Customer */}

          <div className="min-w-0 lg:w-56">

            <div className="flex items-center gap-2">
              <User
                size={15}
                className="shrink-0 text-stone-400"
              />

              <p className="truncate text-sm font-medium text-stone-700">
                {customer.name}
              </p>
            </div>

            {customer.email && (
              <div className="mt-1 flex items-center gap-2">

                <Mail
                  size={14}
                  className="shrink-0 text-stone-400"
                />

                <p className="truncate text-xs text-stone-500">
                  {customer.email}
                </p>

              </div>
            )}
          </div>

          {/* Items */}

          <div>
            <p className="text-xs text-stone-400">
              Items
            </p>

            <p className="mt-1 text-sm font-medium text-stone-700">
              {itemCount}{" "}
              {itemCount === 1
                ? "item"
                : "items"}
            </p>
          </div>

          {/* Total */}

          <div>
            <p className="text-xs text-stone-400">
              Total
            </p>

            <p className="mt-1 flex items-center text-sm font-semibold text-[#173d20]">
              ₹
              {Number(
                order.totalAmount ||
                order.total ||
                0
              ).toLocaleString("en-IN")}
            </p>
          </div>

          {/* View */}

          <button
            onClick={onToggle}
            className="flex items-center justify-center gap-2 rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition hover:border-[#315c35] hover:text-[#315c35]"
          >
            {expanded
              ? "Hide Details"
              : "View Details"}

            {expanded ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>
      </div>

      {/* ================================= */}
      {/* EXPANDED DETAILS */}
      {/* ================================= */}

      {expanded && (
        <div className="border-t border-stone-200 bg-[#faf9f5]">

          {/* Products */}

          <div className="p-5">

            <h3 className="mb-4 text-sm font-semibold text-[#173d20]">
              Ordered Products
            </h3>

            <div className="space-y-3">

              {order.items?.map(
                (item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-3"
                  >

                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">

                      <h4 className="line-clamp-1 text-sm font-medium text-[#173d20]">
                        {item.title}
                      </h4>

                      <p className="mt-1 text-xs text-stone-500">
                        Quantity:{" "}
                        {item.quantity}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-sm font-semibold text-[#173d20]">
                        ₹
                        {(
                          Number(item.price) *
                          Number(
                            item.quantity
                          )
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <p className="mt-1 text-xs text-stone-400">
                        ₹
                        {Number(
                          item.price
                        ).toLocaleString(
                          "en-IN"
                        )}{" "}
                        each
                      </p>

                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* ================================= */}
          {/* CUSTOMER INFO */}
          {/* ================================= */}

          <div className="border-t border-stone-200 p-5">

            <h3 className="mb-4 text-sm font-semibold text-[#173d20]">
              Customer Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

              <InfoBox
                icon={<User size={16} />}
                label="Customer"
                value={customer.name}
              />

              <InfoBox
                icon={<Mail size={16} />}
                label="Email"
                value={
                  customer.email ||
                  "Not available"
                }
              />

              <InfoBox
                icon={<CalendarDays size={16} />}
                label="Order Date"
                value={createdDate}
              />

              <InfoBox
                icon={<IndianRupee size={16} />}
                label="Order Total"
                value={`₹${Number(
                  order.totalAmount ||
                  order.total ||
                  0
                ).toLocaleString("en-IN")}`}
              />

            </div>
          </div>

          {/* ================================= */}
          {/* ORDER MANAGEMENT */}
          {/* ================================= */}

          <div className="border-t border-stone-200 p-5">

            <div className="mb-5">
              <h3 className="text-sm font-semibold text-[#173d20]">
                Manage Order
              </h3>

              <p className="mt-1 text-xs text-stone-500">
                Update the order status and send a
                message to the customer if needed.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">

              {/* STATUS */}

              <div>

                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Order Status
                </label>

                <div className="relative">

                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value)
                    }
                    className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-4 py-3 pr-10 text-sm text-stone-700 outline-none transition focus:border-[#315c35] focus:ring-1 focus:ring-[#315c35]"
                  >
                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Out for Delivery">
                      Out for Delivery
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>


                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                </div>

              </div>

              {/* MESSAGE */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-stone-500">
                  <MessageSquare size={14} />
                  Delivery Message
                </label>

                <textarea
                  value={deliveryMessage}
                  onChange={(e) =>
                    setDeliveryMessage(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Example: Delivery delayed due to heavy rain. Your order will arrive tomorrow."
                  className="w-full resize-none rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-[#315c35] focus:ring-1 focus:ring-[#315c35]"
                />

              </div>
            </div>

            {/* Existing message */}

            {order.deliveryMessage && (
              <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">

                <div className="flex gap-3">

                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-yellow-600"
                  />

                  <div>
                    <p className="text-xs font-semibold text-yellow-800">
                      Current customer message
                    </p>

                    <p className="mt-1 text-sm text-yellow-700">
                      {order.deliveryMessage}
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* SAVE */}

            <div className="mt-5 flex justify-end">

              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2 rounded-lg bg-[#173d20] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#244228] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />

                    Save Changes
                  </>
                )}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================= */
/* INFO BOX */
/* ================================================= */

function InfoBox({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf3ed] text-[#315c35]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-stone-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-medium text-stone-700">
          {value}
        </p>
      </div>

    </div>
  );
}

/* ================================================= */
/* STATUS BADGE */
/* ================================================= */

function StatusBadge({
  status,
  statusInfo,
}) {
  return (
    <div
      className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusInfo.className}`}
    >
      {statusInfo.icon}
      {status}
    </div>
  );
}

/* ================================================= */
/* STATUS INFO */
/* ================================================= */

function getStatusInfo(status) {
  switch (status?.toLowerCase()) {
    case "processing":
      return {
        icon: <Clock size={13} />,
        className:
          "bg-yellow-50 text-yellow-700",
      };

    case "shipped":
      return {
        icon: <Truck size={13} />,
        className:
          "bg-blue-50 text-blue-700",
      };

    case "out for delivery":
      return {
        icon: <Truck size={13} />,
        className:
          "bg-purple-50 text-purple-700",
      };

    case "delivered":
      return {
        icon: <CheckCircle size={13} />,
        className:
          "bg-green-50 text-green-700",
      };

    case "cancelled":
    case "canceled":
      return {
        icon: <XCircle size={13} />,
        className:
          "bg-red-50 text-red-700",
      };

    default:
      return {
        icon: <Package size={13} />,
        className:
          "bg-stone-100 text-stone-600",
      };
  }
}

export default AdminOrders;