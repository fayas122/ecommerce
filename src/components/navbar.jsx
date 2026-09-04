import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingCart, Heart, User, Menu, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");


  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const wishlistCount = wishlistItems.length;


  return (
    <header
      className="absolute top-0 left-0 z-50 w-full text-white"
      style={{
        backgroundImage: `linear-gradient(
          to right,
          rgba(54, 45, 34, 0.78),
          rgba(54, 45, 34, 0.25),
          rgba(20, 30, 15, 0.55)
        )`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <nav className="mx-auto flex h-[62px] max-w-[1400px] items-center px-7 lg:px-10">
        {/* ================= LOGO ================= */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          {/* Bamboo Logo */}
          <div className="relative flex h-9 w-6 items-center justify-center">
            <svg
              width="25"
              height="38"
              viewBox="0 0 25 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 37V5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M15 37V1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M20 37V10"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M9 12C5 10 3 7 2 4"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M15 9C19 7 21 4 22 1"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M9 21C5 19 3 17 1 14"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M15 18C19 16 21 14 23 11"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M9 28C6 27 4 25 2 22"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <span className="font-serif text-[19px] tracking-[1.5px] text-white">
            WESTEROS
          </span>
        </Link>

        {/* ================= DESKTOP NAVIGATION ================= */}
        <div className="mx-auto hidden items-center gap-8 lg:flex">
          <Link
            to="/"
            className="text-[12px] font-medium text-white transition-all duration-300 hover:text-[#d9c8a8]"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-[12px] font-medium text-white transition-all duration-300 hover:text-[#d9c8a8]"
          >
            Shop
          </Link>

          <a
            href="#categories"
            className="text-[12px] font-medium text-white transition-all duration-300 hover:text-[#d9c8a8]"
          >
            Categories
          </a>


        </div>

        {/* ================= DESKTOP ACTIONS ================= */}
        <div className="hidden items-center gap-[17px] lg:flex">
          

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="group relative flex items-center justify-center"
          >
            <Heart
              size={22}
              strokeWidth={1.5}
              className="text-white transition-transform duration-300 group-hover:scale-110"
            />

            {wishlistCount > 0 && (
              <span className="absolute -right-[8px] -top-[9px] flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-white px-1 text-[9px] font-semibold text-[#3f3a32]">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="group relative flex items-center justify-center"
          >
            <ShoppingCart
              size={23}
              strokeWidth={1.5}
              className="text-white transition-transform duration-300 group-hover:scale-110"
            />

            {cartCount > 0 && (
              <span className="absolute -right-[9px] -top-[10px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-white px-1 text-[9px] font-semibold text-[#3f3a32]">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          <Link
            to="/myAccount"
            className="group flex items-center justify-center"
          >
            {!isAuthenticated ? (
              <button className="text-white transition-transform duration-300 group-hover:scale-110">
                Login
              </button>
            ) : (
              <User
                size={22}
                strokeWidth={1.5}
                className="text-white transition-transform duration-300 group-hover:scale-110"
              />
            )}
          </Link>
        </div>

        {/* ================= MOBILE ACTIONS ================= */}
        <div className="ml-auto flex items-center gap-4 lg:hidden">
          <Link
            to="/cart"
            className="relative flex items-center justify-center"
          >
            <ShoppingCart size={22} strokeWidth={1.5} className="text-white" />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold text-[#3f3a32]">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center text-white"
          >
            {isMenuOpen ? (
              <X size={25} strokeWidth={1.5} />
            ) : (
              <Menu size={25} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {isMenuOpen && (
        <div className="border-t border-white/20 bg-[#40372d]/95 px-7 py-6 backdrop-blur-md lg:hidden">
          <div className="flex flex-col">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-white/10 py-4 text-sm text-white"
            >
              Home
            </Link>

            <Link
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-white/10 py-4 text-sm text-white"
            >
              Shop
            </Link>


            <div className="mt-5 flex items-center gap-6">
              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-white"
              >
                <Search size={19} strokeWidth={1.5} />
                <span className="text-sm">Search</span>
              </Link>

              <Link
                to="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-white"
              >
                <Heart size={19} strokeWidth={1.5} />
                <span className="text-sm">Wishlist</span>
              </Link>

              <Link
                to="/myAccount"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-white"
              >
                <User size={19} strokeWidth={1.5} />
                <span className="text-sm">Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
