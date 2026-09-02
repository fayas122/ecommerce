import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";

import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
} from "lucide-react";

import { loginUser } from "../../services/authApi";
import { setUser } from "../../features/auth/authSlice";

import { loadCart } from "../../features/cart/cartSlice";
import { loadWishlist } from "../../features/wishlist/wishlistSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // =========================
  // LOGIN MUTATION
  // =========================

  const loginMutation = useMutation({
    mutationFn: loginUser,

    onSuccess: (user) => {
      // =========================
      // SAVE USER
      // =========================

      dispatch(setUser(user));

      // =========================
      // LOAD USER CART
      // =========================

      const savedCart = localStorage.getItem(
        `cart_${user.id}`
      );

      const userCart = savedCart
        ? JSON.parse(savedCart)
        : [];

      dispatch(loadCart(userCart));

      // =========================
      // LOAD USER WISHLIST
      // =========================

      const savedWishlist = localStorage.getItem(
        `wishlist_${user.id}`
      );

      const userWishlist = savedWishlist
        ? JSON.parse(savedWishlist)
        : [];

      dispatch(loadWishlist(userWishlist));

      // =========================
      // GO HOME
      // =========================

      navigate("/");
    },

    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // FORM SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    loginMutation.mutate(formData);
  };

  return (
    <main className="h-screen w-full overflow-hidden bg-[#F8F5EE] text-[#20221E]">

      {/* LOGIN SECTION */}

      <section className="relative h-full w-full overflow-hidden">

        {/* Decorative background leaves */}

        <div className="pointer-events-none absolute left-[-40px] top-[15%] hidden text-[#315C35]/10 lg:block">
          <Leaf size={140} strokeWidth={0.7} />
        </div>

        <div className="pointer-events-none absolute bottom-[-50px] right-[-30px] hidden rotate-[-25deg] text-[#315C35]/10 lg:block">
          <Leaf size={160} strokeWidth={0.7} />
        </div>

        {/* MAIN CONTAINER */}

        <div className="mx-auto flex h-full w-full max-w-[1400px]">

          {/* ================= LEFT BRAND PANEL ================= */}

          <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:items-center">

            {/* Natural background */}

            <div className="absolute inset-0 bg-gradient-to-b from-[#E9E0CF] via-[#F3EEE4] to-[#D8CCB7]" />

            {/* Bamboo decoration */}

            <div className="absolute right-0 top-0 h-full w-52 overflow-hidden opacity-[0.16]">

              <div className="absolute right-8 top-[-80px] h-[780px] w-9 rounded-full bg-[#214B29]" />

              <div className="absolute right-20 top-[-50px] h-[730px] w-5 rounded-full bg-[#315C35]" />

              <div className="absolute right-32 top-[-100px] h-[800px] w-7 rounded-full bg-[#214B29]" />

              <div className="absolute right-44 top-[-40px] h-[740px] w-4 rounded-full bg-[#3E673E]" />

            </div>

            {/* Light decorative circles */}

            <div className="absolute bottom-[-120px] left-[-100px] h-80 w-80 rounded-full border border-[#315C35]/10" />

            <div className="absolute bottom-[-90px] left-[-70px] h-60 w-60 rounded-full border border-[#315C35]/10" />

            {/* LEFT CONTENT */}

            <div className="relative z-10 max-w-xl px-10 xl:px-16">

              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-[#55705A]">
                Welcome Back
              </p>

              <h2 className="font-serif text-[44px] leading-[1.02] text-[#20221E] xl:text-[56px]">

                Crafted by Nature.

                <span className="mt-1 block text-[#315C35]">
                  Made for You.
                </span>

              </h2>

              {/* Decorative line */}

              <div className="my-5 flex items-center gap-3">

                <span className="h-[1.5px] w-10 bg-[#315C35]" />

                <span className="text-[12px] text-[#315C35]">
                  ✦
                </span>

              </div>

              <p className="max-w-md text-sm leading-6 text-[#5E625B]">
                Welcome back to Bamboora. Sign in to continue exploring our
                handcrafted bamboo collection and discover pieces made with
                nature and care.
              </p>

              {/* Quote */}

              <div className="mt-6 border-l border-[#315C35] pl-4">

                <p className="font-serif text-base italic text-[#42483F]">
                  "Bring a little nature into your everyday life."
                </p>

              </div>

            </div>

          </div>

          {/* ================= RIGHT LOGIN AREA ================= */}

          <div className="relative flex w-full items-center justify-center px-5 py-4 sm:px-8 lg:w-1/2 lg:px-10 xl:px-14">

            {/* Back Home */}

            <Link
              to="/"
              className="group absolute right-5 top-4 flex items-center gap-2 text-[12px] text-[#315C35] transition hover:text-[#173D20]"
            >

              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>

              Back to Home

            </Link>

            <div className="w-full max-w-[400px]">

              {/* MOBILE HEADING */}

              <div className="mb-5 text-center lg:hidden">

                <p className="mb-2 text-[9px] uppercase tracking-[0.3em] text-[#6C806D]">
                  Welcome Back
                </p>

                <h1 className="font-serif text-3xl text-[#20221E]">
                  Bamboora
                </h1>

              </div>

              {/* HEADING */}

              <div className="mb-5 text-center">

                <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.3em] text-[#6C806D]">
                  Your Account
                </p>

                <h1 className="font-serif text-[34px] leading-tight text-[#20221E] sm:text-[40px]">
                  Welcome Back
                </h1>

                {/* Ornament */}

                <div className="mt-3 flex items-center justify-center gap-3">

                  <span className="h-px w-7 bg-[#B7C0B4]" />

                  <span className="text-[11px] text-[#315C35]">
                    ✦
                  </span>

                  <span className="h-px w-7 bg-[#B7C0B4]" />

                </div>

                <p className="mt-2 text-[12px] text-[#777A72]">
                  Sign in to your Bamboora account
                </p>

              </div>

              {/* ================= FORM CARD ================= */}

              <div className="rounded-2xl border border-[#E4DED2] bg-white p-5 shadow-[0_18px_55px_rgba(45,55,40,0.07)] sm:p-6">

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >

                  {/* EMAIL */}

                  <div>

                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-[11px] font-medium text-[#3F443E]"
                    >
                      Email Address
                    </label>

                    <div className="relative">

                      <Mail
                        size={16}
                        strokeWidth={1.5}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7C847A]"
                      />

                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="h-11 w-full rounded-lg border border-[#DDDAD0] bg-[#FCFBF8] pl-11 pr-4 text-[13px] text-[#24251F] outline-none transition-all duration-200 placeholder:text-[#A0A29C] focus:border-[#315C35] focus:bg-white focus:ring-4 focus:ring-[#315C35]/[0.06]"
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}

                  <div>

                    <div className="mb-1.5 flex items-center justify-between">

                      <label
                        htmlFor="password"
                        className="text-[11px] font-medium text-[#3F443E]"
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        className="text-[10px] text-[#315C35] transition hover:text-[#173D20]"
                      >
                        Forgot Password?
                      </button>

                    </div>

                    <div className="relative">

                      <Lock
                        size={16}
                        strokeWidth={1.5}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7C847A]"
                      />

                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="h-11 w-full rounded-lg border border-[#DDDAD0] bg-[#FCFBF8] pl-11 pr-12 text-[13px] text-[#24251F] outline-none transition-all duration-200 placeholder:text-[#A0A29C] focus:border-[#315C35] focus:bg-white focus:ring-4 focus:ring-[#315C35]/[0.06]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (previous) => !previous
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7C847A] transition hover:text-[#315C35]"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >

                        {showPassword ? (
                          <EyeOff
                            size={16}
                            strokeWidth={1.5}
                          />
                        ) : (
                          <Eye
                            size={16}
                            strokeWidth={1.5}
                          />
                        )}

                      </button>

                    </div>

                  </div>

                  {/* ERROR */}

                  {loginMutation.isError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">

                      <p className="text-[11px] text-red-600">
                        {loginMutation.error?.response?.data?.message ||
                          "Invalid email or password"}
                      </p>

                    </div>
                  )}

                  {/* LOGIN BUTTON */}

                  <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#214B29] text-[13px] font-medium text-white transition-all duration-300 hover:bg-[#173D20] hover:shadow-[0_8px_20px_rgba(33,75,41,0.18)] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {loginMutation.isPending ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        Logging in...
                      </>
                    ) : (
                      <>
                        Login

                        <ArrowRight
                          size={15}
                          strokeWidth={1.7}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </>
                    )}

                  </button>

                </form>

                {/* OR */}

                <div className="my-4 flex items-center gap-3">

                  <span className="h-px flex-1 bg-[#E8E5DD]" />

                  <span className="text-[9px] tracking-widest text-[#999C95]">
                    OR
                  </span>

                  <span className="h-px flex-1 bg-[#E8E5DD]" />

                </div>

                {/* REGISTER */}

                <p className="text-center text-[11px] text-[#777A72]">

                  Don't have an account?{" "}

                  <Link
                    to="/register"
                    className="font-medium text-[#315C35] transition hover:text-[#173D20]"
                  >
                    Create an account
                  </Link>

                </p>

              </div>

              {/* Bottom text */}

              <p className="mt-3 text-center text-[8px] leading-4 text-[#999B94]">
                By continuing, you agree to our Terms & Privacy Policy.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Login;