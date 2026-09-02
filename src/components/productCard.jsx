import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingCart } from "lucide-react";

import { addToCart } from "../features/cart/cartSlice";

import {
  addToWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";

import {
  updateUserWishlist,
} from "../services/userApi";

import {
  updateUserCart,
} from "../services/userApi";

function ProductCard({ product }) {

  // ================= AUTH =================

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  // ================= CART =================

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  // ================= WISHLIST =================

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ================= WISHLIST STATUS =================

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  // ================= CARD CLICK =================

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  // ================= ADD TO CART =================

  const handleAddToCart = async (e) => {
  e.stopPropagation();

  if (!isAuthenticated) {
    navigate("/login");
    return;
  }

  if (!user?.id) {
    alert("User information not found");
    return;
  }

  try {
    const existingItem = cartItems.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    // First save to db.json
    await updateUserCart(user.id, updatedCart);

    // Then update Redux
    dispatch(
      addToCart(product)
    );

    alert("Product added to cart");
  } catch (error) {
    console.error("Cart update failed:", error);

    alert("Failed to update cart");
  }
};

  // ================= WISHLIST =================

  const handleWishlist = async (e) => {
    e.stopPropagation();

    // User not logged in
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Make sure user exists
    if (!user?.id) {
      alert("User information not found");
      return;
    }

    try {
      let updatedWishlist;

      // ==========================================
      // REMOVE FROM WISHLIST
      // ==========================================

      if (isWishlisted) {

        updatedWishlist = wishlistItems.filter(
          (item) => item.id !== product.id
        );

        // Update Redux
        dispatch(
          removeFromWishlist(product.id)
        );

        // Update db.json
        await updateUserWishlist(
          user.id,
          updatedWishlist
        );

        alert("Product removed from wishlist");
      }

      // ==========================================
      // ADD TO WISHLIST
      // ==========================================

      else {

        updatedWishlist = [
          ...wishlistItems,
          product,
        ];

        // Update Redux
        dispatch(
          addToWishlist(product)
        );

        // Update db.json
        await updateUserWishlist(
          user.id,
          updatedWishlist
        );

        alert("Product added to wishlist");
      }

    } catch (error) {

      console.error(
        "Wishlist update failed:",
        error
      );

      alert(
        "Failed to update wishlist"
      );
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        group cursor-pointer
        overflow-hidden rounded-md
        bg-[#f8f5ee]
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >

      {/* ================= PRODUCT IMAGE ================= */}

      <div className="relative aspect-square overflow-hidden bg-[#e9e2d5]">

        <img
          src={product.image}
          alt={product.title}
          className="
            h-full w-full object-cover
            transition-transform duration-500
            group-hover:scale-105
          "
        />

        {/* Image Overlay */}

        <div
          className="
            pointer-events-none
            absolute inset-0
            bg-black/0
            transition-all duration-300
            group-hover:bg-black/5
          "
        />

        {/* ================= WISHLIST ================= */}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className="
            absolute right-2 top-2 z-10
            flex h-8 w-8
            items-center justify-center
            rounded-full
            bg-black/5
            text-white
            backdrop-blur-[2px]
            transition-all duration-300
            hover:bg-black/20
          "
        >

          <Heart
            size={19}
            strokeWidth={1.6}
            fill={
              isWishlisted
                ? "white"
                : "none"
            }
            className="
              transition-transform
              duration-300
              hover:scale-110
            "
          />

        </button>

      </div>

      {/* ================= PRODUCT DETAILS ================= */}

      <div className="px-3 py-3">

        {/* Product Title */}

        <h2
          className="
            truncate
            text-[12px]
            font-semibold
            text-[#222]
            transition-colors
            hover:text-[#315c3b]
          "
        >
          {product.title}
        </h2>

        {/* ================= RATING ================= */}

        <div className="mt-2 flex items-center gap-1">

          <div
            className="
              flex
              text-[11px]
              leading-none
              text-[#e5a51c]
            "
          >
            ★★★★★
          </div>

          <span className="text-[9px] text-[#777]">
            ({product.reviews || 128})
          </span>

        </div>

        {/* ================= PRICE ================= */}

        <p className="mt-1 text-sm font-semibold text-[#333]">
          ₹
          {Number(product.price).toLocaleString(
            "en-IN"
          )}
        </p>

        {/* ================= ADD TO CART ================= */}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="
            mt-3
            flex w-full
            items-center justify-center
            gap-2
            rounded-[3px]
            bg-[#244c31]
            py-2
            text-[10px]
            font-medium
            text-white
            transition-all duration-300
            hover:bg-[#193b25]
            disabled:cursor-not-allowed
            disabled:bg-gray-400
          "
        >

          <ShoppingCart
            size={13}
            strokeWidth={1.5}
          />

          {product.stock === 0
            ? "Out of Stock"
            : "Add to Cart"}

        </button>

      </div>

    </div>
  );
}

export default ProductCard;