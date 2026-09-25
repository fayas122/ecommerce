import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// ================= GET USERS =================

export const getUsers = async () => {
  const response = await api.get("/users");

  return response.data;
};

// ================= UPDATE USER =================

export const updateUser = async (userId, data) => {
  const response = await api.patch(
    `/users/${userId}`,
    data
  );

  return response.data;
};

// ================= GET USER BY ID =================

export const getUserById = async (userId) => {
  const response = await api.get(
    `/users/${userId}`
  );

  return response.data;
};

// ================= UPDATE CART =================

export const updateUserCart = async (userId, cart) => {
  const response = await api.patch(
    `/users/${userId}`,
    {
      cart: cart,
    }
  );

  return response.data;
};

// ================= UPDATE WISHLIST =================

export const updateUserWishlist = async (
  userId,
  wishlist
) => {
  const response = await api.patch(
    `/users/${userId}`,
    {
      wishlist: wishlist,
    }
  );

  return response.data;
};

// ================= UPDATE ORDERS =================

export const updateUserOrders = async (
  userId,
  orders
) => {
  const response = await api.patch(
    `/users/${userId}`,
    {
      orders: orders,
    }
  );

  return response.data;
};

// ================= UPDATE ADDRESS =================

export const updateUserAddress = async (
  id,
  address
) => {
  const response = await api.patch(
    `/users/${id}`,
    {
      address: address,
    }
  );

  return response.data;
};