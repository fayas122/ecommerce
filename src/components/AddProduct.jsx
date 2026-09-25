import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";

import { createProduct } from "../services/productApi";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    stock: "",
    rating: "",
    description: "",
    image: "",
  });

  const [images, setImages] = useState([]);

  const createProductMutation = useMutation({
    mutationFn: createProduct,

    onSuccess: () => {
      alert("Product added successfully");
      navigate("/admin/products");
    },

    onError: () => {
      alert("Failed to add product");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageAdd = () => {
    if (!formData.image.trim()) return;

    setImages((prev) => [...prev, formData.image]);

    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter product name");
      return;
    }

    if (!formData.category) {
      alert("Please select a category");
      return;
    }

    if (!formData.price) {
      alert("Please enter product price");
      return;
    }

    if (!formData.stock) {
      alert("Please enter stock quantity");
      return;
    }

    if (images.length === 0) {
      alert("Please add at least one product image");
      return;
    }

    const productData = {
      title: formData.title,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      rating: Number(formData.rating) || 0,
      description: formData.description,
      image: images[0],
      images: images,
    };

    createProductMutation.mutate(productData);
  };

  return (
    <div className="min-h-screen bg-[#f8f5ee] p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-3 flex items-center gap-2 text-sm text-stone-600 transition hover:text-[#244228]"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="text-3xl font-semibold text-[#173d20]">
            Add Product
          </h1>

          <p className="mt-1 text-sm text-stone-500">
            Add a new bamboo product to your store.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-5xl"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Information */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <h2 className="mb-5 text-lg font-semibold text-[#173d20]">
                Product Information
              </h2>

              {/* Product Name */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Product Name
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: Handcrafted Bamboo Vase"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-[#315c35]"
                />
              </div>

              {/* Category */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#315c35]"
                >
                  <option value="">Select category</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Decor">Decor</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              {/* Price + Stock */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="1800"
                    min="0"
                    className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#315c35]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="20"
                    min="0"
                    className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#315c35]"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Rating
                </label>

                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="4.5"
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#315c35]"
                />
              </div>

              {/* Description */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Write a description about the product..."
                  className="w-full resize-none rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#315c35]"
                />
              </div>
            </div>

            {/* Images */}
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <h2 className="mb-5 text-lg font-semibold text-[#173d20]">
                Product Images
              </h2>

              <div className="flex gap-3">
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Paste image URL"
                  className="flex-1 rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#315c35]"
                />

                <button
                  type="button"
                  onClick={handleImageAdd}
                  className="flex items-center gap-2 rounded-lg bg-[#244228] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1b331f]"
                >
                  <Plus size={17} />
                  Add
                </button>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-lg border border-stone-200"
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="aspect-square w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-500 shadow"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {images.length === 0 && (
                <div className="mt-5 flex flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 py-12 text-center">
                  <Upload
                    size={32}
                    className="mb-3 text-stone-400"
                  />

                  <p className="text-sm font-medium text-stone-600">
                    No images added
                  </p>

                  <p className="mt-1 text-xs text-stone-400">
                    Add an image URL above
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Product Preview */}
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-semibold text-[#173d20]">
                Preview
              </h2>

              <div className="overflow-hidden rounded-lg bg-stone-100">
                {images.length > 0 ? (
                  <img
                    src={images[0]}
                    alt="Product preview"
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center text-sm text-stone-400">
                    Product image
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p className="text-lg font-semibold text-[#173d20]">
                  {formData.title || "Product Name"}
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  {formData.category || "Category"}
                </p>

                <p className="mt-3 text-lg font-semibold text-[#244228]">
                  ₹{formData.price || "0"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <button
                type="submit"
                disabled={createProductMutation.isPending}
                className="w-full rounded-lg bg-[#244228] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1b331f] disabled:cursor-not-allowed disabled:bg-stone-400"
              >
                {createProductMutation.isPending
                  ? "Adding Product..."
                  : "Add Product"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mt-3 w-full rounded-lg border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;