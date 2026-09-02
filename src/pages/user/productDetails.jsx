import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import {
  Heart,
  Maximize2,
  Leaf,
  Hand,
  ShieldCheck,
  ShoppingCart,
  RefreshCw,
  Minus,
  Plus,
} from "lucide-react";

import { getProductById } from "../../services/productApi";
import { addToCart } from "../../features/cart/cartSlice";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  // Loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfbf8]">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  // Error
  if (isError || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfbf8]">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Product not found
        </h2>

        <Link
          to="/products"
          className="rounded-lg bg-[#234d20] px-6 py-3 text-white"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  // Product image
  const image =
    product.images?.length > 0
      ? product.images[0]
      : product.image;

  // Product price
  const price = Number(product.price || 0);

  const originalPrice = Number(
    product.originalPrice || product.oldPrice || price
  );

  // Discount
  const discount =
    product.discount ||
    (originalPrice > price
      ? Math.round(
          ((originalPrice - price) / originalPrice) * 100
        )
      : 0);

  // Reviews
  const reviews = product.reviews || 128;

  // Add product to cart
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity,
      })
    );
  };

  // Buy product now
  const handleBuyNow = () => {
    dispatch(
      addToCart({
        ...product,
        quantity,
      })
    );

    navigate("/cart");
  };

  // Increase quantity
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  return (
    <section className="min-h-screen bg-white px-5 py-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1400px]">

        {/* ================= BREADCRUMB ================= */}

        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">

          <Link
            to="/"
            className="text-gray-800 transition hover:text-[#234d20]"
          >
            Home
          </Link>

          <span>›</span>

          <Link
            to="/products"
            className="text-gray-800 transition hover:text-[#234d20]"
          >
            Furniture
          </Link>

          <span>›</span>

          <span className="text-gray-800">
            Chairs
          </span>

          <span>›</span>

          <span className="truncate text-gray-500">
            {product.name}
          </span>

        </div>

        {/* ================= MAIN PRODUCT AREA ================= */}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">

          {/* ================= LEFT SIDE ================= */}

          <div>

            {/* Product Image */}

            <div className="relative overflow-hidden rounded-xl bg-[#f1eee6]">

              <img
                src={image}
                alt={product.name}
                className="h-[420px] w-full object-cover sm:h-[500px] lg:h-[540px]"
              />

              {/* Sale */}

              {discount > 0 && (
                <div className="absolute left-4 top-4 rounded-md bg-[#23602a] px-4 py-1.5 text-sm font-medium text-white">
                  Sale
                </div>
              )}

              {/* Wishlist */}

              <button
                type="button"
                onClick={() => setLiked(!liked)}
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
              >
                <Heart
                  size={22}
                  strokeWidth={1.8}
                  className={
                    liked
                      ? "fill-red-500 text-red-500"
                      : "text-gray-700"
                  }
                />
              </button>

              {/* Fullscreen */}

              <button
                type="button"
                className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
              >
                <Maximize2 size={19} />
              </button>

            </div>

          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div className="flex flex-col">

            {/* Product Title */}

            <h1 className="font-serif text-3xl font-semibold leading-tight text-[#173a22] sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}

            <div className="mt-4 flex items-center gap-2">

              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className="text-[19px] text-[#f2a900]"
                  >
                    ★
                  </span>
                ))}
              </div>

              <span className="text-sm text-gray-700">
                ({reviews} reviews)
              </span>

            </div>

            {/* Price */}

            <div className="mt-4 flex flex-wrap items-center gap-4">

              <span className="text-3xl font-bold text-[#234d20]">
                ₹{price.toLocaleString("en-IN")}
              </span>

              {originalPrice > price && (
                <span className="text-lg text-gray-500 line-through">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
              )}

              {discount > 0 && (
                <span className="rounded-lg bg-[#e9eee8] px-3 py-1.5 text-sm font-semibold text-[#234d20]">
                  {discount}% OFF
                </span>
              )}

            </div>

            {/* Description */}

            <p className="mt-5 max-w-[600px] text-[15px] leading-6 text-gray-700">
              {product.description ||
                "Handcrafted with natural materials and a beautiful finish. Durable, comfortable and perfect for your living space or outdoor relaxation."}
            </p>

            {/* ================= FEATURES ================= */}

            <div className="mt-7 grid grid-cols-3 gap-4 border-b border-gray-200 pb-7">

              {/* Sustainable */}

              <div className="flex items-center gap-3">

                <Leaf
                  size={27}
                  strokeWidth={1.5}
                  className="shrink-0 text-[#234d20]"
                />

                <span className="text-sm leading-5 text-gray-800">
                  Sustainable
                  <br />
                  Material
                </span>

              </div>

              {/* Handmade */}

              <div className="flex items-center gap-3">

                <Hand
                  size={27}
                  strokeWidth={1.5}
                  className="shrink-0 text-[#234d20]"
                />

                <span className="text-sm leading-5 text-gray-800">
                  Handcrafted
                  <br />
                  with Care
                </span>

              </div>

              {/* Durable */}

              <div className="flex items-center gap-3">

                <ShieldCheck
                  size={27}
                  strokeWidth={1.5}
                  className="shrink-0 text-[#234d20]"
                />

                <span className="text-sm leading-5 text-gray-800">
                  Durable &
                  <br />
                  Long Lasting
                </span>

              </div>

            </div>

            {/* ================= STOCK ================= */}

            <div className="mt-5">

              <div className="flex items-center gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-[#286b32]" />

                <span className="text-sm font-medium text-[#234d20]">
                  In Stock
                </span>

              </div>

              <p className="mt-1 text-sm text-gray-700">
                Delivery by 24 May - 26 May
              </p>

            </div>

            {/* ================= QUANTITY ================= */}

            <div className="mt-7">

              <p className="mb-2 text-sm font-medium text-gray-700">
                Quantity
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* Quantity Box */}

                <div className="flex h-[48px] w-full items-center justify-between rounded-lg border border-gray-300 sm:w-[115px]">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="flex h-full w-10 items-center justify-center text-gray-600 transition hover:text-[#234d20]"
                  >
                    <Minus size={17} />
                  </button>

                  <span className="text-sm font-medium">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="flex h-full w-10 items-center justify-center text-gray-600 transition hover:text-[#234d20]"
                  >
                    <Plus size={17} />
                  </button>

                </div>

                {/* Add To Cart */}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex h-[48px] flex-1 items-center justify-center gap-3 rounded-lg bg-[#235421] px-6 font-medium text-white transition hover:bg-[#1b441a]"
                >
                  <ShoppingCart size={19} />

                  <span>
                    Add to Cart
                  </span>

                </button>

              </div>

            </div>

            {/* ================= BUY NOW ================= */}

            <button
              type="button"
              onClick={handleBuyNow}
              className="mt-3 h-[48px] w-full rounded-lg border border-[#234d20] bg-white font-medium text-[#234d20] transition hover:bg-[#f4f7f2]"
            >
              Buy Now
            </button>

            {/* ================= BOTTOM FEATURES ================= */}

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 text-sm text-gray-700">

              {/* Secure Payment */}

              <div className="flex items-center gap-3">

                <ShieldCheck
                  size={21}
                  strokeWidth={1.6}
                  className="text-[#234d20]"
                />

                <span>
                  Secure Payment
                </span>

              </div>

              <span className="hidden h-5 w-px bg-gray-300 sm:block" />

              {/* Returns */}

              <div className="flex items-center gap-3">

                <RefreshCw
                  size={20}
                  strokeWidth={1.6}
                  className="text-[#234d20]"
                />

                <span>
                  7-Day Returns
                </span>

              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;