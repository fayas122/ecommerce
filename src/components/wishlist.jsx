import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {toast} from "react-hot-toast";
import {
  removeFromWishlist,
  clearWishlist,
} from "../features/wishlist/wishlistSlice";

import {
  updateUserWishlist,
} from "../services/userApi";

function Wishlist() {
  const dispatch = useDispatch();

  // =========================
  // AUTH USER
  // =========================

  const user = useSelector(
    (state) => state.auth.user
  );

  // =========================
  // WISHLIST
  // =========================

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );


  // =========================
  // REMOVE WISHLIST ITEM
  // =========================

  const handleRemove = async (productId) => {
    if (!user?.id) {
      return;
    }

    try {

      // Create updated wishlist
      const updatedWishlist =
        wishlistItems.filter(
          (item) => item.id !== productId
        );

      // Update Redux
      dispatch(
        removeFromWishlist(productId)
      );

      // Update db.json
      await updateUserWishlist(
        user.id,
        updatedWishlist
      );

    } catch (error) {

      console.error(
        "Failed to remove wishlist item:",
        error
      );

    }
    toast.success("Product removed from wishlist")
  };


  // =========================
  // CLEAR WISHLIST
  // =========================

  const handleClearWishlist = async () => {
    if (!user?.id) {
      return;
    }

    try {

      // Update Redux
      dispatch(clearWishlist());

      // Update db.json
      await updateUserWishlist(
        user.id,
        []
      );

    } catch (error) {

      console.error(
        "Failed to clear wishlist:",
        error
      );

    }
    toast.success("wishlist cleared successfully")
  };


  // =========================
  // EMPTY WISHLIST
  // =========================

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f5ed] flex items-center justify-center px-6">

        <div className="text-center max-w-md">

          <div className="mx-auto mb-6 w-20 h-20 rounded-full border border-[#d7d2c4] flex items-center justify-center text-[#17351f] text-4xl">
            ♡
          </div>

          <h2 className="text-3xl md:text-4xl font-normal text-[#17351f] font-serif">
            Your Wishlist is Empty
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#77796e] font-sans">
            Save your favorite bamboo products here and come back whenever
            you're ready.
          </p>

          <Link
            to="/products"
            className="inline-block mt-7 bg-[#17351f] hover:bg-[#284d30] text-white px-7 py-3 text-xs font-medium transition"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f8f5ed] text-[#17351f] px-5 md:px-8 lg:px-[6%] py-8">

      {/* =========================
          BREADCRUMB
      ========================== */}

      <div className="flex items-center gap-2 mb-10 text-[11px] font-sans text-[#8b8c7d]">

        <Link
          to="/"
          className="hover:text-[#17351f] transition"
        >
          Home
        </Link>

        <span>/</span>

        <span className="text-[#17351f]">
          Wishlist
        </span>

      </div>


      {/* =========================
          HEADER
      ========================== */}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[#ddd8ca] pb-7 mb-8">

        <div>

          <p className="mb-2 text-[10px] tracking-[2px] font-semibold font-sans text-[#6b795f]">
            MY COLLECTION
          </p>

          <h1 className="text-4xl md:text-5xl font-normal font-serif text-[#17351f]">
            My Wishlist
          </h1>

          <p className="mt-3 text-sm font-sans text-[#77796e]">
            Your favorite pieces, saved for later.
          </p>

        </div>


        {/* =========================
            CLEAR WISHLIST
        ========================== */}

        <button
          type="button"
          onClick={handleClearWishlist}
          className="border border-[#c9c5b8] px-5 py-3 text-xs font-sans text-[#17351f] hover:bg-[#17351f] hover:text-white hover:border-[#17351f] transition"
        >
          Clear Wishlist
        </button>

      </div>


      {/* =========================
          WISHLIST PRODUCTS
      ========================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">

        {wishlistItems.map((item) => (

          <div
            key={item.id}
            className="group bg-[#fffdf8] border border-[#e3dfd3] overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >

            {/* =========================
                PRODUCT IMAGE
            ========================== */}

            <div className="relative aspect-square overflow-hidden bg-[#eee9dd]">

              <Link to={`/products/${item.id}`}>

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

              </Link>


              {/* SAVED BADGE */}

              <span className="absolute top-3 left-3 bg-[#17351f] text-white px-2 py-1 text-[9px] tracking-[1px] font-sans">
                SAVED
              </span>


              {/* =========================
                  REMOVE HEART
              ========================== */}

              <button
                type="button"
                onClick={() =>
                  handleRemove(item.id)
                }
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#fffdf8]/95 flex items-center justify-center text-[#17351f] text-xl hover:bg-[#17351f] hover:text-white transition"
                aria-label={`Remove ${item.title} from wishlist`}
              >
                ♡
              </button>

            </div>


            {/* =========================
                PRODUCT INFORMATION
            ========================== */}

            <div className="p-4">

              {/* COLLECTION */}

              <Link
                to={`/products/${item.id}`}
                className="block"
              >

                <p className="mb-2 text-[9px] tracking-[1.5px] font-semibold font-sans text-[#8a8b7e]">
                  BAMBOO COLLECTION
                </p>


                {/* PRODUCT TITLE */}

                <h3 className="text-lg font-normal font-serif text-[#182f20] hover:text-[#315c35] transition">
                  {item.title}
                </h3>

              </Link>


              {/* PRICE + REMOVE */}

              <div className="flex items-end justify-between mt-4">

                <Link
                  to={`/products/${item.id}`}
                  className="block"
                >

                  <p className="text-base font-semibold font-sans text-[#172f1d]">
                    ₹
                    {Number(item.price).toLocaleString(
                      "en-IN"
                    )}
                  </p>


                  {/* RATING */}

                  <div className="flex items-center gap-1 mt-1">

                    <span className="text-[#d99517] text-[11px] tracking-[1px]">
                      ★★★★★
                    </span>

                    <span className="text-[9px] text-[#88887e] font-sans">
                      (128)
                    </span>

                  </div>

                </Link>


                {/* REMOVE BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    handleRemove(item.id)
                  }
                  className="border border-[#cfcabd] px-3 py-2 text-[10px] font-sans text-[#17351f] hover:bg-[#17351f] hover:text-white hover:border-[#17351f] transition"
                >
                  Remove
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* =========================
          NATURE BANNER
      ========================== */}

      <div className="bg-[#17351f] text-[#f8f5ed] px-7 md:px-11 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-7">

        {/* Banner Content */}

        <div className="flex items-center gap-5">

          <div className="w-14 h-14 shrink-0 rounded-full border border-white/40 flex items-center justify-center text-2xl">
            ♧
          </div>

          <div>

            <h3 className="text-2xl font-normal font-serif">
              Made with Nature
            </h3>

            <p className="mt-1 text-xs text-[#d7dfd2] font-sans">
              Thoughtfully crafted bamboo products for a better and greener
              tomorrow.
            </p>

          </div>

        </div>


        {/* EXPLORE BUTTON */}

        <Link
          to="/products"
          className="border border-[#e6eadf] px-6 py-3 text-[11px] font-sans hover:bg-white hover:text-[#17351f] transition"
        >
          Explore Collection
        </Link>

      </div>

    </div>
  );
}

export default Wishlist;