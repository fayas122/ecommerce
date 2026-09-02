import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getProducts } from "../../services/productApi";
import ProductCard from "../../components/productCard";

function Products() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // =========================
  // CATEGORIES
  // =========================

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const getCategoryCount = (categoryName) => {
    if (categoryName === "All") {
      return products.length;
    }

    return products.filter((product) => product.category === categoryName)
      .length;
  };

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      const productPrice = Number(product.price);

      const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sort === "low") {
        return Number(a.price) - Number(b.price);
      }

      if (sort === "high") {
        return Number(b.price) - Number(a.price);
      }

      if (sort === "name") {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  // =========================
  // CATEGORY CHANGE
  // =========================

  const handleCategoryChange = (item) => {
    setCategory(item);
    setCurrentPage(1);
  };

  // =========================
  // RATING CHANGE
  // =========================

  const handleRatingChange = (rating) => {
    if (selectedRating === rating) {
      setSelectedRating(0);
    } else {
      setSelectedRating(rating);
    }

    setCurrentPage(1);
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f7f3]">
        {/* Loading Breadcrumb */}

        <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 lg:px-6">
          <div className="mb-6 flex items-center gap-2 text-[11px] text-[#8b8c7d]">
            <Link to="/" className="transition hover:text-[#17351f]">
              Home
            </Link>

            <span>/</span>

            <span className="text-[#17351f]">Shop</span>
          </div>
        </div>

        {/* Loading Layout */}

        <div className="flex min-h-screen">
          <aside className="w-[220px] border-r border-stone-200 bg-[#faf9f5] p-6">
            <h1 className="font-serif text-2xl">Shop</h1>
          </aside>

          <main className="flex-1 p-8">
            <p className="text-stone-500">Loading products...</p>

            <div className="mt-8 grid grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-lg bg-stone-200"
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f7f3]">
        <h1 className="text-xl text-stone-700">Failed to load products</h1>
      </div>
    );
  }

  // =========================
  // PRODUCTS PAGE
  // =========================

  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      {/* =========================
          FIXED LEFT SIDEBAR
      ========================== */}

      <aside className="fixed left-0 top-0 h-screen w-[220px] overflow-y-auto border-r border-stone-200 bg-[#faf9f5]">
        {/* Title */}

        <div className="px-6 pb-7 pt-5">
          <h1 className="font-serif text-2xl font-medium text-[#2f352b]">
            Shop
          </h1>
        </div>

        <div className="px-5">
          <h2 className="mb-5 text-sm font-semibold text-stone-700">Filters</h2>

          {/* =========================
              CATEGORIES
          ========================== */}

          <div className="border-b border-stone-200 pb-5">
            <button
              type="button"
              className="mb-4 flex w-full items-center justify-between"
            >
              <span className="text-xs font-semibold text-stone-600">
                Categories
              </span>

              <ChevronDown size={13} />
            </button>

            <div className="space-y-3">
              {categories.map((item) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-center justify-between text-xs text-stone-600"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={category === item}
                      onChange={() => handleCategoryChange(item)}
                      className="h-3 w-3 accent-[#61734f]"
                    />

                    <span>{item}</span>
                  </div>

                  <span className="text-stone-400">
                    ({getCategoryCount(item)})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* =========================
              PRICE RANGE
          ========================== */}

          <div className="border-b border-stone-200 py-5">
            <h3 className="mb-4 text-xs font-semibold text-stone-600">
              Price Range
            </h3>

            {/* Starting Price */}

            <div className="mb-4">
              <label className="mb-2 block text-[10px] text-stone-500">
                Starting Price
              </label>

              <div>
                <span className="text-xs text-stone-500">₹</span>

                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={minPrice}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (value <= maxPrice) {
                      setMinPrice(value);
                      setCurrentPage(1);
                    }
                  }}
                  className="w-full accent-[#244228]"
                />
              </div>
            </div>

            {/* Maximum Price */}

            <div className="mb-3">
              <label className="mb-2 block text-[10px] text-stone-500">
                Maximum Price
              </label>

              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  if (value >= minPrice) {
                    setMaxPrice(value);
                    setCurrentPage(1);
                  }
                }}
                className="w-full accent-[#244228]"
              />
            </div>

            {/* Price Values */}

            <div className="flex justify-between text-[10px] text-stone-600">
              <span>₹{minPrice.toLocaleString("en-IN")}</span>

              <span>₹{maxPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* =========================
          RIGHT PRODUCTS SECTION
      ========================== */}

      <main className="ml-[220px] min-h-screen bg-[#f8f7f3] px-6 py-5">
        {/* =========================
            BREADCRUMB
        ========================== */}

        <div className="mb-5 flex items-center gap-2 text-[11px] text-[#8b8c7d]">
          <Link to="/" className="transition hover:text-[#17351f]">
            Home
          </Link>

          <span>/</span>

          <span className="text-[#17351f]">Shop</span>
        </div>

        {/* =========================
            SEARCH AND SORT
        ========================== */}

        <div className="flex items-center justify-between gap-5">
          {/* Search */}

          <div className="relative w-full max-w-[320px]">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 w-full rounded-md border border-stone-300 bg-[#faf9f5] pl-9 pr-4 text-xs text-stone-700 outline-none"
            />
          </div>

          {/* Sort */}

          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[10px] text-stone-500">Sort by:</span>

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 rounded-md border border-stone-300 bg-[#faf9f5] px-3 text-[10px] text-stone-700 outline-none"
            >
              <option value="default">Most Popular</option>

              <option value="low">Low to High</option>

              <option value="high">High to Low</option>

              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* =========================
            PRODUCT COUNT
        ========================== */}

        <p className="mb-5 mt-5 text-xs font-medium text-stone-600">
          {filteredProducts.length} Products Found
        </p>

        {/* =========================
            PRODUCT CARDS
        ========================== */}

        {currentProducts.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-lg font-medium text-stone-700">
              No products found
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                dispatch={dispatch}
              />
            ))}
          </div>
        )}

        {/* =========================
            PAGINATION
        ========================== */}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {/* Previous */}

            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-300 disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>

            {/* Page Numbers */}

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  type="button"
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded-md text-xs ${
                    currentPage === page
                      ? "bg-[#244228] text-white"
                      : "border border-stone-300 text-stone-600"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next */}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-300 disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
<ProductCard/>


export default Products;
