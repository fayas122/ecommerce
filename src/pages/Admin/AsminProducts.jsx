import React, { useState } from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  X,
  Save,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
  RotateCcw,
} from "lucide-react";

import {
  getProducts,
  getDeletedProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
} from "../../services/productApi";


// =====================================================
// ADMIN PRODUCTS
// =====================================================

function AdminProducts() {
  const queryClient = useQueryClient();

  // =========================================
  // STATES
  // =========================================

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [showDeleted, setShowDeleted] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [deleteProductId, setDeleteProductId] =
    useState(null);


  // =========================================
  // GET ACTIVE PRODUCTS
  // =========================================

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });


  // =========================================
  // GET DELETED PRODUCTS
  // =========================================

  const {
    data: deletedProducts = [],
    isLoading: isDeletedLoading,
  } = useQuery({
    queryKey: ["deleted-products"],
    queryFn: getDeletedProducts,
  });


  // =========================================
  // ADD PRODUCT
  // =========================================

  const addMutation = useMutation({
    mutationFn: addProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["deleted-products"],
      });

      closeModal();
    },

    onError: (error) => {
      console.error(
        "Failed to add product:",
        error
      );
    },
  });


  // =========================================
  // UPDATE PRODUCT
  // =========================================

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      updateProduct(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["deleted-products"],
      });

      closeModal();
    },

    onError: (error) => {
      console.error(
        "Failed to update product:",
        error
      );
    },
  });


  // =========================================
  // SOFT DELETE PRODUCT
  // =========================================

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["deleted-products"],
      });

      setDeleteProductId(null);
    },

    onError: (error) => {
      console.error(
        "Failed to delete product:",
        error
      );
    },
  });


  // =========================================
  // RESTORE PRODUCT
  // =========================================

  const restoreMutation = useMutation({
    mutationFn: restoreProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["deleted-products"],
      });
    },

    onError: (error) => {
      console.error(
        "Failed to restore product:",
        error
      );
    },
  });


  // =========================================
  // CATEGORIES
  // =========================================

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];


  // =========================================
  // CURRENT PRODUCTS
  // =========================================

  const currentProducts = showDeleted
    ? deletedProducts
    : products;


  // =========================================
  // FILTER PRODUCTS
  // =========================================

  const filteredProducts =
    currentProducts.filter((product) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        product.title
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });


  // =========================================
  // OPEN ADD
  // =========================================

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };


  // =========================================
  // OPEN EDIT
  // =========================================

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };


  // =========================================
  // CLOSE MODAL
  // =========================================

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };


  // =========================================
  // SAVE PRODUCT
  // =========================================

  const handleSaveProduct = (formData) => {
    // EDIT
    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id,
        data: formData,
      });

      return;
    }

    // ADD
    addMutation.mutate(formData);
  };


  // =========================================
  // DELETE
  // =========================================

  const handleDelete = () => {
    if (!deleteProductId) return;

    deleteMutation.mutate(deleteProductId);
  };


  // =========================================
  // RESTORE
  // =========================================

  const handleRestore = (productId) => {
    restoreMutation.mutate(productId);
  };


  // =========================================
  // CHANGE PRODUCT VIEW
  // =========================================

  const handleViewChange = () => {
    setShowDeleted((prev) => !prev);

    // Reset category filter when switching
    setCategoryFilter("All");

    // Reset search
    setSearch("");
  };


  // =========================================
  // LOADING
  // =========================================

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ee]">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <RefreshCw
            size={17}
            className="animate-spin"
          />

          Loading products...
        </div>
      </div>
    );
  }


  // =========================================
  // ERROR
  // =========================================

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ee] px-5">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">

            <AlertCircle
              size={26}
              className="text-red-500"
            />

          </div>


          <h2 className="mt-4 text-lg font-semibold text-[#173d20]">
            Failed to load products
          </h2>


          <p className="mt-2 text-sm text-stone-500">
            Something went wrong while loading
            products.
          </p>


          <button
            onClick={() => refetch()}
            className="mt-5 rounded-lg bg-[#173d20] px-5 py-2.5 text-sm font-medium text-white"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f8f5ee] px-5 py-7 md:px-8">

      <div className="mx-auto max-w-7xl">


        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


          {/* TITLE */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#244228] text-white">

              <Package size={21} />

            </div>


            <div>

              <h1 className="text-2xl font-semibold text-[#173d20]">
                {showDeleted
                  ? "Deleted Products"
                  : "Products"}
              </h1>


              <p className="text-sm text-stone-500">
                {showDeleted
                  ? "Restore products removed from your store"
                  : "Manage your store products"}
              </p>

            </div>

          </div>


          {/* BUTTONS */}

          <div className="flex flex-wrap gap-3">

            {/* DELETED / ACTIVE */}

            <button
              onClick={handleViewChange}
              className="flex items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
            >

              <RotateCcw size={17} />

              {showDeleted
                ? "Active Products"
                : `Deleted Products (${deletedProducts.length})`}

            </button>


            {/* ADD PRODUCT */}

            {!showDeleted && (
              <button
                onClick={handleAddProduct}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#173d20] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#244228]"
              >

                <Plus size={17} />

                Add Product

              </button>
            )}

          </div>

        </div>


        {/* ================================= */}
        {/* SEARCH + FILTER */}
        {/* ================================= */}

        <div className="mb-5 rounded-xl border border-stone-200 bg-white p-4">


          <div className="flex flex-col gap-3 md:flex-row">


            {/* SEARCH */}

            <div className="relative flex-1">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />


              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder={
                  showDeleted
                    ? "Search deleted products..."
                    : "Search products..."
                }
                className="w-full rounded-lg border border-stone-200 bg-[#faf9f5] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#315c35]"
              />

            </div>


            {/* CATEGORY */}

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
              className="rounded-lg border border-stone-200 bg-[#faf9f5] px-4 py-2.5 text-sm text-stone-600 outline-none focus:border-[#315c35] md:w-52"
            >

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}

            </select>

          </div>


          {/* COUNT */}

          <p className="mt-3 text-xs text-stone-500">

            Showing{" "}

            <span className="font-medium text-stone-700">
              {filteredProducts.length}
            </span>{" "}

            of{" "}

            <span className="font-medium text-stone-700">
              {currentProducts.length}
            </span>{" "}

            {showDeleted
              ? "deleted products"
              : "products"}

          </p>

        </div>


        {/* ================================= */}
        {/* PRODUCT LIST */}
        {/* ================================= */}

        {isDeletedLoading && showDeleted ? (

          <div className="rounded-xl border border-stone-200 bg-white px-5 py-16 text-center">

            <div className="flex items-center justify-center gap-2 text-sm text-stone-500">

              <RefreshCw
                size={17}
                className="animate-spin"
              />

              Loading deleted products...

            </div>

          </div>

        ) : filteredProducts.length === 0 ? (

          /* ================================= */
          /* EMPTY */
          /* ================================= */

          <div className="rounded-xl border border-stone-200 bg-white px-5 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">

              {showDeleted ? (
                <RotateCcw
                  size={26}
                  className="text-stone-400"
                />
              ) : (
                <Package
                  size={26}
                  className="text-stone-400"
                />
              )}

            </div>


            <h2 className="mt-4 text-lg font-semibold text-[#173d20]">

              {showDeleted
                ? "No deleted products"
                : "No products found"}

            </h2>


            <p className="mt-2 text-sm text-stone-500">

              {showDeleted
                ? "Deleted products will appear here."
                : "Try changing your search or category."}

            </p>

          </div>

        ) : (

          /* ================================= */
          /* PRODUCT TABLE */
          /* ================================= */

          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">


            {/* TABLE HEADER */}

            <div className="hidden border-b border-stone-200 bg-[#faf9f5] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid lg:grid-cols-[2.5fr_1.2fr_1fr_1fr_1fr_1.2fr] lg:items-center lg:gap-4">

              <span>
                Product
              </span>

              <span>
                Category
              </span>

              <span>
                Price
              </span>

              <span>
                Stock
              </span>

              <span>
                Status
              </span>

              <span className="text-right">
                Actions
              </span>

            </div>


            {/* PRODUCTS */}

            <div>

              {filteredProducts.map(
                (product) => (

                  <AdminProductRow
                    key={product.id}
                    product={product}
                    onEdit={
                      handleEditProduct
                    }
                    onDelete={() =>
                      setDeleteProductId(
                        product.id
                      )
                    }
                    onRestore={
                      handleRestore
                    }
                    isDeleted={
                      showDeleted
                    }
                  />

                )
              )}

            </div>

          </div>

        )}

      </div>


      {/* ================================= */}
      {/* ADD / EDIT MODAL */}
      {/* ================================= */}

      {showModal && (

        <ProductModal
          product={editingProduct}
          onClose={closeModal}
          onSave={handleSaveProduct}
          isSaving={
            addMutation.isPending ||
            updateMutation.isPending
          }
        />

      )}


      {/* ================================= */}
      {/* DELETE MODAL */}
      {/* ================================= */}

      {deleteProductId && (

        <DeleteModal
          onClose={() =>
            setDeleteProductId(null)
          }
          onConfirm={handleDelete}
          isDeleting={
            deleteMutation.isPending
          }
        />

      )}

    </div>
  );
}


// =====================================================
// PRODUCT ROW
// =====================================================

function AdminProductRow({
  product,
  onEdit,
  onDelete,
  onRestore,
  isDeleted,
}) {

  const stock =
    Number(product.stock || 0);

  const isOutOfStock =
    stock === 0;


  return (
    <div className="border-b border-stone-200 px-5 py-4 last:border-b-0">


      {/* ================================= */}
      {/* DESKTOP */}
      {/* ================================= */}

      <div className="hidden lg:grid lg:grid-cols-[2.5fr_1.2fr_1fr_1fr_1fr_1.2fr] lg:items-center lg:gap-4">


        {/* PRODUCT */}

        <div className="flex min-w-0 items-center gap-3">

          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">

            {product.image ? (

              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
              />

            ) : (

              <div className="flex h-full w-full items-center justify-center">

                <Package
                  size={20}
                  className="text-stone-400"
                />

              </div>

            )}

          </div>


          <div className="min-w-0">

            <h3 className="truncate text-sm font-semibold text-[#173d20]">
              {product.title}
            </h3>

            <p className="mt-1 text-xs text-stone-400">
              ID: #{product.id}
            </p>

          </div>

        </div>


        {/* CATEGORY */}

        <div>

          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-600">
            {product.category || "N/A"}
          </span>

        </div>


        {/* PRICE */}

        <div className="text-sm font-semibold text-[#173d20]">

          ₹
          {Number(
            product.price || 0
          ).toLocaleString("en-IN")}

        </div>


        {/* STOCK */}

        <div>

          <p
            className={`text-sm font-semibold ${
              isOutOfStock
                ? "text-red-600"
                : stock <= 5
                ? "text-orange-600"
                : "text-[#315c35]"
            }`}
          >
            {stock}
          </p>

          <p className="text-[10px] text-stone-400">
            units
          </p>

        </div>


        {/* STATUS */}

        <div>

          {isDeleted ? (

            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
              Deleted
            </span>

          ) : (

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                isOutOfStock
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {isOutOfStock
                ? "Out of Stock"
                : "Available"}
            </span>

          )}

        </div>


        {/* ACTIONS */}

        <div className="flex justify-end gap-2">

          {isDeleted ? (

            <button
              onClick={() =>
                onRestore(product.id)
              }
              disabled={
                false
              }
              className="flex h-9 items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 text-green-700 transition hover:bg-green-100"
              title="Restore product"
            >

              <RotateCcw
                size={15}
              />

              Restore

            </button>

          ) : (

            <>

              <button
                onClick={() =>
                  onEdit(product)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-[#315c35] hover:bg-[#edf3ed] hover:text-[#315c35]"
                title="Edit product"
              >

                <Pencil size={15} />

              </button>


              <button
                onClick={() =>
                  onDelete(product.id)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                title="Delete product"
              >

                <Trash2 size={15} />

              </button>

            </>

          )}

        </div>

      </div>


      {/* ================================= */}
      {/* MOBILE / TABLET */}
      {/* ================================= */}

      <div className="lg:hidden">

        <div className="flex gap-4">


          {/* IMAGE */}

          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-100">

            {product.image ? (

              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
              />

            ) : (

              <div className="flex h-full w-full items-center justify-center">

                <Package
                  size={22}
                  className="text-stone-400"
                />

              </div>

            )}

          </div>


          <div className="min-w-0 flex-1">


            {/* TITLE + ACTIONS */}

            <div className="flex items-start justify-between gap-3">


              <div className="min-w-0">

                <h3 className="truncate text-sm font-semibold text-[#173d20]">
                  {product.title}
                </h3>

                <p className="mt-1 text-xs text-stone-400">
                  #{product.id}
                </p>

              </div>


              {/* ACTIONS */}

              <div className="flex shrink-0 gap-1">

                {isDeleted ? (

                  <button
                    onClick={() =>
                      onRestore(product.id)
                    }
                    className="flex h-8 items-center justify-center gap-1 rounded-lg border border-green-200 bg-green-50 px-2 text-green-700"
                  >

                    <RotateCcw size={14} />

                    <span className="text-xs">
                      Restore
                    </span>

                  </button>

                ) : (

                  <>

                    <button
                      onClick={() =>
                        onEdit(product)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500"
                      title="Edit product"
                    >

                      <Pencil size={14} />

                    </button>


                    <button
                      onClick={() =>
                        onDelete(product.id)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-red-500"
                      title="Delete product"
                    >

                      <Trash2 size={14} />

                    </button>

                  </>

                )}

              </div>

            </div>


            {/* DETAILS */}

            <div className="mt-3 flex flex-wrap items-center gap-2">


              <span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] text-stone-600">
                {product.category || "N/A"}
              </span>


              <span className="text-sm font-semibold text-[#173d20]">

                ₹
                {Number(
                  product.price || 0
                ).toLocaleString("en-IN")}

              </span>


              <span
                className={`text-xs font-medium ${
                  isOutOfStock
                    ? "text-red-600"
                    : stock <= 5
                    ? "text-orange-600"
                    : "text-[#315c35]"
                }`}
              >
                Stock: {stock}
              </span>


              {isDeleted && (

                <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-medium text-red-600">
                  Deleted
                </span>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


// =====================================================
// ADD / EDIT MODAL
// =====================================================

function ProductModal({
  product,
  onClose,
  onSave,
  isSaving,
}) {

  const [form, setForm] = useState({
    title: product?.title || "",
    category: product?.category || "",
    price: product?.price ?? "",
    stock: product?.stock ?? 0,
    image: product?.image || "",
    description: product?.description || "",
    rating: product?.rating ?? 0,
    reviews: product?.reviews ?? 0,
  });


  const [error, setError] =
    useState("");


  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = (e) => {

    e.preventDefault();

    setError("");


    // PRODUCT NAME

    if (!form.title.trim()) {

      setError(
        "Product name is required."
      );

      return;
    }


    // CATEGORY

    if (!form.category.trim()) {

      setError(
        "Category is required."
      );

      return;
    }


    // PRICE

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {

      setError(
        "Please enter a valid price."
      );

      return;
    }


    // STOCK

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {

      setError(
        "Please enter a valid stock quantity."
      );

      return;
    }


    // PRODUCT DATA

    const productData = {

      title:
        form.title.trim(),

      category:
        form.category.trim(),

      price:
        Number(form.price),

      stock:
        Number(form.stock),

      image:
        form.image.trim(),

      description:
        form.description.trim(),

      rating:
        Number(form.rating || 0),

      reviews:
        Number(form.reviews || 0),

    };


    onSave(productData);

  };


  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">


      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">


        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white px-5 py-4">


          <div>

            <h2 className="text-lg font-semibold text-[#173d20]">

              {product
                ? "Edit Product"
                : "Add New Product"}

            </h2>


            <p className="mt-1 text-xs text-stone-500">

              {product
                ? "Update product information and stock."
                : "Add a new product to your store."}

            </p>

          </div>


          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-100 disabled:opacity-50"
          >

            <X size={19} />

          </button>

        </div>


        {/* ================================= */}
        {/* FORM */}
        {/* ================================= */}

        <form
          onSubmit={handleSubmit}
          className="p-5"
        >


          {/* ERROR */}

          {error && (

            <div className="mb-5 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">

              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0"
              />

              {error}

            </div>

          )}


          {/* PRODUCT NAME */}

          <div className="mb-4">

            <label className="mb-2 block text-xs font-medium text-stone-600">
              Product Name
            </label>


            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Example: Handcrafted Bamboo Vase"
              className="w-full rounded-lg border border-stone-200 bg-[#faf9f5] px-4 py-2.5 text-sm outline-none focus:border-[#315c35]"
            />

          </div>


          {/* CATEGORY + PRICE */}

          <div className="grid gap-4 sm:grid-cols-2">


            {/* CATEGORY */}

            <div>

              <label className="mb-2 block text-xs font-medium text-stone-600">
                Category
              </label>


              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Example: Home & Decor"
                className="w-full rounded-lg border border-stone-200 bg-[#faf9f5] px-4 py-2.5 text-sm outline-none focus:border-[#315c35]"
              />

            </div>


            {/* PRICE */}

            <div>

              <label className="mb-2 block text-xs font-medium text-stone-600">
                Price
              </label>


              <input
                type="number"
                name="price"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="1800"
                className="w-full rounded-lg border border-stone-200 bg-[#faf9f5] px-4 py-2.5 text-sm outline-none focus:border-[#315c35]"
              />

            </div>

          </div>


          {/* STOCK */}

          <div className="mt-4">

            <label className="mb-2 block text-xs font-medium text-stone-600">
              Available Stock
            </label>


            <input
              type="number"
              name="stock"
              min="0"
              value={form.stock}
              onChange={handleChange}
              placeholder="25"
              className="w-full rounded-lg border border-stone-200 bg-[#faf9f5] px-4 py-2.5 text-sm outline-none focus:border-[#315c35]"
            />


            <p className="mt-1.5 text-[11px] text-stone-400">
              Enter the number of units currently
              available.
            </p>

          </div>


          {/* IMAGE */}

          <div className="mt-4">

            <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-stone-600">

              <ImageIcon size={14} />

              Image URL

            </label>


            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/product.jpg"
              className="w-full rounded-lg border border-stone-200 bg-[#faf9f5] px-4 py-2.5 text-sm outline-none focus:border-[#315c35]"
            />

          </div>


          {/* IMAGE PREVIEW */}

          {form.image && (

            <div className="mt-3 h-32 w-32 overflow-hidden rounded-lg bg-stone-100">

              <img
                src={form.image}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />

            </div>

          )}


          {/* DESCRIPTION */}

          <div className="mt-4">

            <label className="mb-2 block text-xs font-medium text-stone-600">
              Description
            </label>


            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter product description..."
              className="w-full resize-none rounded-lg border border-stone-200 bg-[#faf9f5] px-4 py-2.5 text-sm outline-none focus:border-[#315c35]"
            />

          </div>


          {/* BUTTONS */}

          <div className="mt-6 flex justify-end gap-3 border-t border-stone-200 pt-5">


            {/* CANCEL */}

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50 disabled:opacity-50"
            >
              Cancel
            </button>


            {/* SAVE */}

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-[#173d20] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#244228] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {isSaving ? (

                <>

                  <RefreshCw
                    size={16}
                    className="animate-spin"
                  />

                  Saving...

                </>

              ) : (

                <>

                  {product ? (
                    <Save size={16} />
                  ) : (
                    <Plus size={16} />
                  )}


                  {product
                    ? "Save Changes"
                    : "Add Product"}

                </>

              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


// =====================================================
// DELETE MODAL
// =====================================================

function DeleteModal({
  onClose,
  onConfirm,
  isDeleting,
}) {

  return (

    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">


      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">


        {/* ICON */}

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">

          <Trash2
            size={20}
            className="text-red-500"
          />

        </div>


        {/* TITLE */}

        <h2 className="mt-4 text-lg font-semibold text-[#173d20]">
          Delete Product?
        </h2>


        {/* MESSAGE */}

        <p className="mt-2 text-sm leading-6 text-stone-500">

          This product will be moved to deleted
          products. You can restore it later.

        </p>


        {/* BUTTONS */}

        <div className="mt-6 flex justify-end gap-3">


          {/* CANCEL */}

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 disabled:opacity-50"
          >
            Cancel
          </button>


          {/* DELETE */}

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >

            {isDeleting ? (

              <>

                <RefreshCw
                  size={15}
                  className="animate-spin"
                />

                Deleting...

              </>

            ) : (

              <>

                <Trash2 size={15} />

                Delete   

              </>

            )}

          </button>

        </div>

      </div>

    </div>
  );
}


export default AdminProducts;