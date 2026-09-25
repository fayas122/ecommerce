import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// =========================
// LOGIN
// =========================

export const loginUser = async (userData) => {
  const response = await api.get(
    `/users?email=${encodeURIComponent(
      userData.email
    )}&password=${encodeURIComponent(
      userData.password
    )}`
  );

  if (response.data.length === 0) {
    throw new Error("Invalid email or password");
  }

  return response.data[0];
};

// =========================
// REGISTER
// =========================

export const registerUser = async (userData) => {
  const existingUser = await api.get(
    `/users?email=${encodeURIComponent(userData.email)}`
  );

  if (existingUser.data.length > 0) {
    throw new Error("Email already registered");
  }

  const response = await api.post("/users", {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: "user",
    wishlist: [],
    cart: [],
    orders: [],
  });

  return response.data;
};

// =========================
// GET USER
// =========================

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);

  return response.data;
};