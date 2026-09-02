import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// =========================
// GET ORDERS FOR A USER
// =========================

export const getOrdersByUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);

  return response.data.orders || [];
};

// =========================
// GET ALL ORDERS
// =========================

export const getOrders = async () => {
  const response = await api.get("/users");

  // Get orders from every user
  const allOrders = response.data.flatMap(
    (user) =>
      (user.orders || []).map((order) => ({
        ...order,
        userId: user.id,
      }))
  );

  return allOrders;
};

// =========================
// GET SINGLE ORDER
// =========================

export const getOrderById = async (userId, orderId) => {
  const response = await api.get(`/users/${userId}`);

  const orders = response.data.orders || [];

  const order = orders.find(
    (order) => order.id === orderId
  );

  return order;
};

// =========================
// CREATE ORDER
// =========================

export const createOrder = async ({
  userId,
  orderData,
}) => {
  // Get the user
  const response = await api.get(`/users/${userId}`);

  const user = response.data;

  // Create new order
  const newOrder = {
    id: `order-${Date.now()}`,
    ...orderData,
  };

  // Add new order to existing orders
  const updatedOrders = [
    ...(user.orders || []),
    newOrder,
  ];

  // Update user's orders
  await api.patch(`/users/${userId}`, {
    orders: updatedOrders,
  });

  return newOrder;
};
