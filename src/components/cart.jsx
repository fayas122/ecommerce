import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast  from "react-hot-toast"

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../features/cart/cartSlice";

import { createOrder } from "../services/orderApi";
import { updateUserCart } from "../services/userApi";
import AddressForm from "../components/AddressForm";

function Cart() {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savedUser, setSavedUser] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =========================
  // REDUX DATA
  // =========================

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const user = useSelector(
    (state) => state.auth.user
  );

  // Use updated user after address is saved
  const currentUser = savedUser || user;

  // =========================
  // CART CALCULATIONS
  // =========================

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  // =========================
  // REMOVE CART ITEM
  // =========================

  const handleRemove = async (productId) => {
    if (!currentUser?.id) {
      return;
    }

    try {
      const updatedCart = cartItems.filter(
        (item) => item.id !== productId
      );

      dispatch(removeFromCart(productId));

      await updateUserCart(
        currentUser.id,
        updatedCart
      );
    } catch (error) {
      console.error(
        "Failed to remove cart item:",
        error
      );
    }
  };

  // =========================
  // INCREASE QUANTITY
  // =========================

  const handleIncrease = async (productId) => {
    if (!currentUser?.id) {
      return;
    }

    try {
      const updatedCart = cartItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );

      dispatch(increaseQuantity(productId));

      await updateUserCart(
        currentUser.id,
        updatedCart
      );
    } catch (error) {
      console.error(
        "Failed to increase quantity:",
        error
      );
    }
  };

  // =========================
  // DECREASE QUANTITY
  // =========================

  const handleDecrease = async (productId) => {
    if (!currentUser?.id) {
      return;
    }

    const currentItem = cartItems.find(
      (item) => item.id === productId
    );

    if (
      !currentItem ||
      currentItem.quantity <= 1
    ) {
      return;
    }

    try {
      const updatedCart = cartItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      );

      dispatch(decreaseQuantity(productId));

      await updateUserCart(
        currentUser.id,
        updatedCart
      );
    } catch (error) {
      console.error(
        "Failed to decrease quantity:",
        error
      );
    }
  };

  // =========================
  // CREATE ORDER
  // =========================

  const orderMutation = useMutation({
    mutationFn: createOrder,

    onSuccess: async () => {
      try {
        // Clear Redux cart
        dispatch(clearCart());

        // Clear cart in db.json
        await updateUserCart(
          currentUser.id,
          []
        );

        // Go back to cart
        navigate("/cart");
      } catch (error) {
        console.error(
          "Failed to clear cart:",
          error
        );
      }
    },

    onError: (error) => {
      console.error(
        "Order creation failed:",
        error
      );
    },
  });

  // =========================
  // PLACE ORDER
  // =========================

  const placeOrder = (userData = currentUser) => {
    if (!userData?.id) {
      return;
    }

    const orderData = {
      customer: {
        name: userData.name,
        email: userData.email,
      },

      // Save address inside the order
      address: userData.address,

      items: cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),

      subtotal,
      shipping,
      totalAmount: total,
      status: "Processing",
      createdAt: new Date().toISOString(),
    };

    // IMPORTANT:
    // createOrder now receives userId + orderData
    // so the order will be stored inside:
    // users -> user -> orders: []
    orderMutation.mutate({
      userId: userData.id,
      orderData,
    });
  };

  // =========================
  // PROCEED BUTTON
  // =========================

  const handleProceed = () => {
    // User not logged in
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Cart empty
    if (cartItems.length === 0) {
      return;
    }

    // No address saved
    if (!currentUser.address?.fullName) {
      setShowAddressForm(true);
      return;
    }

    // Address already exists
    placeOrder(currentUser);
   
  };

  // =========================
  // ADDRESS FORM
  // =========================

  if (showAddressForm) {
    return (
      <AddressForm
        user={currentUser}
        onSaved={(updatedUser) => {
          // Store updated user locally
          setSavedUser(updatedUser);

          // Hide address form
          setShowAddressForm(false);

          // Continue placing the order
          placeOrder(updatedUser);
        }}
      />
    );
  }

  // =========================
  // EMPTY CART
  // =========================

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf8f2] px-5 py-12">
        <div className="flex items-center gap-2 mb-10 text-[11px] font-sans text-[#8b8c7d]">

          <Link
            to="/"
            className="hover:text-[#17351f] transition"
          >
            Home
          </Link>

          <span>/</span>

          <span className="text-[#17351f]">
            Cart
          </span>

        </div>

        <div className="mx-auto max-w-5xl text-center">

          <h1 className="font-serif text-3xl text-[#171914]">
            Your Cart
          </h1>

          <div className="mt-12 rounded-md border border-[#e5e0d6] bg-white px-6 py-16">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f0eee7] text-2xl">
              🛒
            </div>

            <h2 className="mt-5 font-serif text-2xl text-[#20231d]">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-[#777a72]">
              Looks like you haven't added anything yet.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex h-10 items-center rounded bg-[#173318] px-7 text-sm font-medium text-white transition hover:bg-[#274d2c]"
            >
              Continue Shopping
            </Link>

          </div>
        </div>
      </main>
    );
  }

  // =========================
  // CART
  // =========================

  return (
    <main className="min-h-screen bg-[#faf8f2] text-[#20231d]">

      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 lg:px-6">

        {/* Breadcrumb */}

        <div className="flex items-center gap-2 mb-6 text-[11px] text-[#8b8c7d]">

          <Link
            to="/"
            className="hover:text-[#17351f] transition"
          >
            Home
          </Link>

          <span>/</span>

          <span className="text-[#17351f]">
            Cart
          </span>

        </div>

        {/* Heading */}

        <div className="flex items-end justify-between">

          <h1 className="font-serif text-[27px] leading-none text-[#171914]">
            Your Cart
          </h1>

          <span className="text-[10px] text-[#777a72]">
            {totalItems}{" "}
            {totalItems === 1 ? "item" : "items"}
          </span>

        </div>

        {/* =========================
            CART TABLE
        ========================== */}

        <section className="mt-5">

          {/* Table Header */}

          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_32px] items-center border-b border-[#e3ded3] px-1 pb-3 text-[9px] font-semibold text-[#292d26] sm:grid">

            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span></span>

          </div>

          {/* Cart Items */}

          <div>

            {cartItems.map((item) => {

              const itemTotal =
                Number(item.price) * item.quantity;

              return (
                <div
                  key={item.id}
                  className="relative grid grid-cols-1 gap-3 border-b border-[#e3ded3] py-4 sm:grid-cols-[2fr_1fr_1fr_1fr_32px] sm:items-center sm:gap-0"
                >

                  {/* PRODUCT */}

                  <div className="flex items-center gap-3">

                    <Link
                      to={`/products/${item.id}`}
                      className="h-[55px] w-[55px] shrink-0 overflow-hidden rounded bg-[#eee8dc]"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    <div className="min-w-0 pr-8">

                      <Link
                        to={`/products/${item.id}`}
                        className="block truncate text-[10px] font-semibold text-[#292d26] transition hover:text-[#173318]"
                      >
                        {item.title}
                      </Link>

                      {/* Mobile Price */}

                      <p className="mt-1 text-[10px] text-[#777a72] sm:hidden">
                        ₹
                        {Number(item.price).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>
                  </div>

                  {/* PRICE */}

                  <div className="hidden text-[10px] font-medium sm:block">
                    ₹
                    {Number(item.price).toLocaleString(
                      "en-IN"
                    )}
                  </div>

                  {/* QUANTITY */}

                  <div className="flex items-center sm:block">

                    <div className="flex h-7 w-[58px] items-center rounded border border-[#e1dcd2] bg-white">

                      <button
                        type="button"
                        onClick={() =>
                          handleDecrease(item.id)
                        }
                        disabled={item.quantity === 1}
                        className="flex h-full w-[19px] items-center justify-center text-[11px] text-[#555950] transition hover:bg-[#f3f0e8] disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Decrease quantity of ${item.title}`}
                      >
                        −
                      </button>

                      <span className="flex h-full w-[20px] items-center justify-center border-x border-[#e1dcd2] text-[9px]">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleIncrease(item.id)
                        }
                        className="flex h-full w-[19px] items-center justify-center text-[11px] text-[#555950] transition hover:bg-[#f3f0e8]"
                        aria-label={`Increase quantity of ${item.title}`}
                      >
                        +
                      </button>

                    </div>
                  </div>

                  {/* TOTAL */}

                  <div className="hidden text-[10px] font-semibold sm:block">
                    ₹
                    {itemTotal.toLocaleString("en-IN")}
                  </div>

                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(item.id)
                    }
                    className="absolute right-1 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-[#f1eee6] text-[10px] text-[#686c64] transition hover:bg-[#e8e3d8] sm:static"
                    aria-label={`Remove ${item.title}`}
                  >
                    ×
                  </button>

                  {/* MOBILE TOTAL */}

                  <div className="flex items-center justify-between sm:hidden">

                    <span className="text-[9px] text-[#777a72]">
                      Item Total
                    </span>

                    <span className="text-[10px] font-semibold">
                      ₹
                      {itemTotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>
        </section>

        {/* =========================
            LOWER CART AREA
        ========================== */}

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_310px]">

          {/* COUPON */}

          <div className="flex items-start">

            <div className="flex h-9 overflow-hidden rounded border border-[#ddd8cd] bg-white">

              <input
                type="text"
                placeholder="Have a coupon?"
                className="w-[120px] bg-transparent px-3 text-[9px] outline-none placeholder:text-[#777a72] sm:w-[145px]"
              />

              <button
                type="button"
                className="border-l border-[#ddd8cd] px-3 text-[9px] font-medium text-[#555950] transition hover:bg-[#f3f0e8]"
              >
                Apply Coupon
              </button>

            </div>
          </div>

          {/* ORDER SUMMARY */}

          <div className="rounded border border-[#e4dfd5] bg-white p-4">

            <div className="space-y-3 text-[10px]">

              <div className="flex items-center justify-between">

                <span className="text-[#555950]">
                  Subtotal
                </span>

                <span className="font-medium">
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-[#555950]">
                  Delivery
                </span>

                <span className="font-medium">
                  {shipping === 0
                    ? "FREE"
                    : `₹${shipping.toLocaleString(
                        "en-IN"
                      )}`}
                </span>

              </div>

              <div className="h-px bg-[#e7e2d8]" />

              <div className="flex items-center justify-between">

                <span className="font-semibold">
                  Total
                </span>

                <span className="text-[16px] font-semibold">
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            </div>

            {/* PROCEED BUTTON */}

            <button
              type="button"
              onClick={handleProceed}
              disabled={orderMutation.isPending}
              className="mt-4 flex h-10 w-full items-center justify-center rounded bg-[#173318] text-[10px] font-medium text-white transition hover:bg-[#274d2c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {orderMutation.isPending
                ? "Processing Order..."
                : "Proceed"}
            </button>

            {/* Error */}

            {orderMutation.isError && (
              <p className="mt-3 text-center text-[9px] text-red-500">
                Failed to place order. Please try again.
              </p>
            )}

          </div>
        </div>
      </div>

      {/* BENEFITS BAR */}

      <section className="mt-2 border-t border-[#e3ded3] bg-[#f3f1e9]">

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 py-6 sm:grid-cols-3 sm:px-8 lg:px-6">

          {/* Free Shipping */}

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[#3d5541]">

              <svg
                viewBox="0 0 32 32"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              >
                <path d="M3 9h16v13H3z" />
                <path d="M19 14h5l5 5v3H19z" />
                <circle cx="9" cy="24" r="2.5" />
                <circle cx="25" cy="24" r="2.5" />
                <path d="M24 14v5h5" />
              </svg>

            </div>

            <div>

              <h3 className="text-[10px] font-semibold">
                Free Shipping
              </h3>

              <p className="mt-1 text-[8px] text-[#777a72]">
                On all orders above ₹999
              </p>

            </div>

          </div>

          {/* Easy Returns */}

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[#3d5541]">

              <svg
                viewBox="0 0 32 32"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              >
                <path d="M8 11a10 10 0 0 1 17 2" />
                <path d="M25 7v6h-6" />
                <path d="M24 21a10 10 0 0 1-17-2" />
                <path d="M7 25v-6h6" />
              </svg>

            </div>

            <div>

              <h3 className="text-[10px] font-semibold">
                Easy Returns
              </h3>

              <p className="mt-1 text-[8px] text-[#777a72]">
                Within 7 days of delivery
              </p>

            </div>

          </div>

          {/* Secure Payment */}

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[#3d5541]">

              <svg
                viewBox="0 0 32 32"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              >
                <path d="M7 12h18v14H7z" />
                <path d="M11 12V9a5 5 0 0 1 10 0v3" />
                <circle cx="16" cy="19" r="2" />
              </svg>

            </div>

            <div>

              <h3 className="text-[10px] font-semibold">
                Secure Payment
              </h3>

              <p className="mt-1 text-[8px] text-[#777a72]">
                100% secure payments
              </p>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Cart;
