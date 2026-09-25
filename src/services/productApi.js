import axios from "axios";

const API_URL = "http://localhost:3000/products";


// =====================================
// GET ACTIVE PRODUCTS
// =====================================

export const getProducts = async () => {
  const response = await axios.get(API_URL);

  return response.data.filter(
    (product) => product.deleted !== true
  );
};


// =====================================
// GET PRODUCT BY ID
// =====================================

export const getProductById = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}`
  );

  return response.data;
};


// =====================================
// GET DELETED PRODUCTS
// =====================================

export const getDeletedProducts = async () => {
  const response = await axios.get(API_URL);

  return response.data.filter(
    (product) => product.deleted === true
  );
};


// =====================================
// ADD PRODUCT
// =====================================

export const addProduct = async (product) => {
  const response = await axios.post(API_URL, {
    ...product,
    deleted: false,
  });

  return response.data;
};


// =====================================
// UPDATE PRODUCT
// =====================================

export const updateProduct = async (id, product) => {
  const response = await axios.patch(
    `${API_URL}/${id}`,
    product
  );

  return response.data;
};


// =====================================
// SOFT DELETE PRODUCT
// =====================================

export const deleteProduct = async (id) => {
  const response = await axios.patch(
    `${API_URL}/${id}`,
    {
      deleted: true,
    }
  );

  return response.data;
};


// =====================================
// RESTORE PRODUCT
// =====================================

export const restoreProduct = async (id) => {
  const response = await axios.patch(
    `${API_URL}/${id}`,
    {
      deleted: false,
    }
  );

  return response.data;
};