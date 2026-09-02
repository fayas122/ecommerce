import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:3000",
});


export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);

  return response.data;
};

export const updateUserCart = async (userId, cart) => {
  const response = await api.patch(`/users/${userId}`, {
    cart: cart,
  });

  return response.data;
};

export const updateUserWishlist = async (userId, wishlist) => {
  const response = await api.patch(`/users/${userId}`, {
    wishlist: wishlist,
  });

  return response.data;
};

export const updateUserOrders = async (userId, orders) => {
  const response = await api.patch(`/users/${userId}`, {
    orders: orders,
  });

  return response.data;
};

export const updateUserAddress = async (id, address) => {
  const response = await api.patch(`/users/${id}`, {
    address,
  });

  return response.data;
};