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

  const allOrders = response.data.flatMap(
    (user) =>
      (user.orders || []).map((order) => ({
        ...order,
        userId: user.id,
      }))
  );

  return allOrders;
};


export const updateOrder = async (userId, orderId, status, deliveryMessage) => {
  const userResponse = await api.get(`/users/${userId}`);

  const user = userResponse.data;

  const updatedOrders = user.orders.map((order) =>
    String(order.id) === String(orderId)
      ? {
          ...order,
          status,
          deliveryMessage,
        }
      : order
  );

  const response = await api.patch(`/users/${userId}`, {
    orders: updatedOrders,
  });

  return response.data;
};

export const getOrderById = async (
  userId,
  orderId
) => {
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
  // Get user
  const response = await api.get(`/users/${userId}`);

  const user = response.data;

  // Create new order
  const newOrder = {
    id: `order-${Date.now()}`,
    ...orderData,
  };

  // Add order
  const updatedOrders = [
    ...(user.orders || []),
    newOrder,
  ];

  // Save orders
  await api.patch(`/users/${userId}`, {
    orders: updatedOrders,
  });

  return newOrder;
};