import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../services/orderApi";
import { getProducts } from "../../services/productApi";
import { getUsers } from "../../services/userApi";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function Dashboard() {
  // ================= PRODUCTS =================

  const {
    data: products = [],
    isLoading: productsLoading,
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getProducts,
  });

  // ================= ORDERS =================

  const {
    data: orders = [],
    isLoading: ordersLoading,
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getOrders,
  });

  // ================= USERS =================

  const {
    data: users = [],
    isLoading: usersLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // ================= DELIVERED ORDERS =================

  const deliveredOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "delivered"
  );

  // ================= ANNUAL REVENUE =================

  const annualIncome = deliveredOrders.reduce(
    (total, order) => {
      return (
        total +
        Number(
          order.totalAmount ||
            order.total ||
            0
        )
      );
    },
    0
  );

  // ================= MONTHLY INCOME =================

  const monthlyIncome = [
    {
      month: "Jan",
      income: 0,
    },
    {
      month: "Feb",
      income: 0,
    },
    {
      month: "Mar",
      income: 0,
    },
    {
      month: "Apr",
      income: 0,
    },
    {
      month: "May",
      income: 0,
    },
    {
      month: "Jun",
      income: 0,
    },
    {
      month: "Jul",
      income: 0,
    },
    {
      month: "Aug",
      income: 0,
    },
    {
      month: "Sep",
      income: 0,
    },
    {
      month: "Oct",
      income: 0,
    },
    {
      month: "Nov",
      income: 0,
    },
    {
      month: "Dec",
      income: 0,
    },
  ];

  // ================= ADD DELIVERED ORDER INCOME =================

  deliveredOrders.forEach((order) => {
    if (!order.createdAt) return;

    const orderDate = new Date(order.createdAt);

    if (Number.isNaN(orderDate.getTime())) {
      return;
    }

    // Only current year
    const currentYear = new Date().getFullYear();

    if (orderDate.getFullYear() !== currentYear) {
      return;
    }

    const monthIndex = orderDate.getMonth();

    monthlyIncome[monthIndex].income += Number(
      order.totalAmount ||
        order.total ||
        0
    );
  });

  // ================= TOTAL USERS =================

  const totalUsers = users.filter(
    (user) => user.role !== "admin"
  ).length;

  // ================= FORMAT CURRENCY =================

  const formatCurrency = (value) => {
    return `₹${Number(value).toLocaleString(
      "en-IN"
    )}`;
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3] p-6">

      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#2f352b]">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-stone-500">
          Overview of your store performance
        </p>
      </div>

      {/* ================= STATISTICS ================= */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        {/* ================= ANNUAL REVENUE ================= */}

        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-500">
            Annual Revenue
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-[#173D20]">
            {formatCurrency(annualIncome)}
          </h2>

          <p className="mt-2 text-xs text-stone-400">
            Revenue from delivered orders
          </p>
        </div>

        {/* ================= TOTAL PRODUCTS ================= */}

        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-500">
            Total Products
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-[#173D20]">
            {productsLoading
              ? "..."
              : products.length}
          </h2>

          <p className="mt-2 text-xs text-stone-400">
            Products available in store
          </p>
        </div>

        {/* ================= TOTAL ORDERS ================= */}

        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-500">
            Total Orders
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-[#173D20]">
            {ordersLoading
              ? "..."
              : orders.length}
          </h2>

          <p className="mt-2 text-xs text-stone-400">
            Orders placed by customers
          </p>
        </div>

        {/* ================= TOTAL USERS ================= */}

        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-500">
            Total Users
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-[#173D20]">
            {usersLoading
              ? "..."
              : totalUsers}
          </h2>

          <p className="mt-2 text-xs text-stone-400">
            Registered customers
          </p>
        </div>

      </div>

      {/* ================= INCOME GRAPH ================= */}

      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6">

        {/* ================= GRAPH HEADER ================= */}

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-stone-800">
              Income Overview
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Monthly revenue from delivered orders
            </p>
          </div>

          <div className="text-right">

            <p className="text-xs text-stone-400">
              This Year
            </p>

            <p className="text-lg font-semibold text-[#173D20]">
              {formatCurrency(annualIncome)}
            </p>

          </div>

        </div>

        {/* ================= GRAPH ================= */}

        <div className="h-[400px] w-full">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <AreaChart
              data={monthlyIncome}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 0,
              }}
            >

              <defs>

                <linearGradient
                  id="incomeGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="#315c35"
                    stopOpacity={0.3}
                  />

                  <stop
                    offset="100%"
                    stopColor="#315c35"
                    stopOpacity={0.02}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e7e5e0"
              />

              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 12,
                  fill: "#78716c",
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fontSize: 12,
                  fill: "#78716c",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  `₹${value / 1000}k`
                }
              />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(
                    value
                  ).toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
                contentStyle={{
                  borderRadius: "8px",
                  border:
                    "1px solid #e7e5e0",
                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />

              <Area
                type="monotone"
                dataKey="income"
                stroke="#315c35"
                strokeWidth={2}
                fill="url(#incomeGradient)"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;