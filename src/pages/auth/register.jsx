import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
} from "lucide-react";

import { registerUser } from "../../services/authApi";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      navigate("/login");
    },

    onError: (error) => {
      setError(error.message || "Registration failed");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    registerMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <main className="h-screen w-full overflow-hidden bg-[#F8F5EE] text-[#20221E]">

      {/* =====================================================
          REGISTER SECTION
      ===================================================== */}

      <section className="relative h-full w-full overflow-hidden">

        {/* DECORATIVE LEFT LEAF */}
        <div className="pointer-events-none absolute left-[-60px] top-[15%] hidden text-[#315C35]/10 lg:block">
          <Leaf
            size={150}
            strokeWidth={0.7}
          />
        </div>

        {/* DECORATIVE RIGHT LEAF */}
        <div className="pointer-events-none absolute bottom-[-50px] right-[-30px] hidden rotate-[-25deg] text-[#315C35]/10 lg:block">
          <Leaf
            size={170}
            strokeWidth={0.7}
          />
        </div>


        {/* =====================================================
            MAIN CONTAINER
        ===================================================== */}

        <div className="mx-auto flex h-full w-full max-w-[1400px]">


          {/* ===================================================
              LEFT BRAND PANEL
          =================================================== */}

          <div className="relative hidden h-full w-1/2 overflow-hidden lg:flex lg:items-center">

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#E7DFCF] via-[#F1ECE2] to-[#D5C8B1]" />


            {/* Decorative circles */}
            <div className="absolute bottom-[-120px] left-[-110px] h-[380px] w-[380px] rounded-full border border-[#315C35]/10" />

            <div className="absolute bottom-[-90px] left-[-80px] h-[300px] w-[300px] rounded-full border border-[#315C35]/10" />


            {/* Bamboo */}
            <div className="absolute right-0 top-0 h-full w-52 overflow-hidden opacity-[0.17]">

              <div className="absolute right-7 top-[-70px] h-[800px] w-9 rounded-full bg-[#214B29]" />

              <div className="absolute right-20 top-[-40px] h-[740px] w-5 rounded-full bg-[#315C35]" />

              <div className="absolute right-32 top-[-90px] h-[820px] w-7 rounded-full bg-[#214B29]" />

              <div className="absolute right-44 top-[-30px] h-[760px] w-4 rounded-full bg-[#3E673E]" />

            </div>


            {/* LEFT CONTENT */}
            <div className="relative z-10 max-w-xl px-10 xl:px-16">

              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-[#55705A]">
                Join Bamboora
              </p>


              <h2 className="font-serif text-[44px] leading-[1.02] text-[#20221E] xl:text-[56px]">

                Bring Nature

                <span className="mt-1 block text-[#315C35]">
                  Into Your Home.
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
                Create your Bamboora account and discover thoughtfully crafted
                bamboo products designed for beautiful, sustainable living.
              </p>


              {/* BENEFITS */}
              <div className="mt-7 space-y-4">

                {/* SUSTAINABLE */}
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#315C35]/10">

                    <Leaf
                      size={16}
                      strokeWidth={1.5}
                      className="text-[#315C35]"
                    />

                  </div>

                  <div>

                    <h3 className="font-serif text-base text-[#30352F]">
                      Sustainable
                    </h3>

                    <p className="text-[11px] text-[#70746D]">
                      Eco-friendly bamboo products
                    </p>

                  </div>

                </div>


                {/* HANDMADE */}
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#315C35]/10">

                    <span className="text-[14px] text-[#315C35]">
                      ✦
                    </span>

                  </div>

                  <div>

                    <h3 className="font-serif text-base text-[#30352F]">
                      Handmade
                    </h3>

                    <p className="text-[11px] text-[#70746D]">
                      Crafted with care by skilled artisans
                    </p>

                  </div>

                </div>


                {/* MADE TO LAST */}
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#315C35]/10">

                    <span className="text-base text-[#315C35]">
                      ♡
                    </span>

                  </div>

                  <div>

                    <h3 className="font-serif text-base text-[#30352F]">
                      Made to Last
                    </h3>

                    <p className="text-[11px] text-[#70746D]">
                      Quality products for everyday living
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ===================================================
              RIGHT REGISTER FORM
          =================================================== */}

          <div className="relative flex h-full w-full items-center justify-center px-5 py-3 sm:px-8 lg:w-1/2 lg:px-10 xl:px-14">


            {/* =================================================
                BACK TO HOME
            ================================================= */}

            <Link
              to="/"
              className="
                group
                absolute
                right-6
                top-4
                z-50
                flex
                flex items-center gap-2 text-[12px] text-[#315C35] transition hover:text-[#173D20]"
              
            >

              <span className="text-sm transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>

              <span>
                Back to Home
              </span>

            </Link>


            {/* =================================================
                REGISTER CONTENT
            ================================================= */}

           <div className="w-full max-w-[390px]">

  {/* MOBILE HEADING */}
  <div className="mb-3 text-center lg:hidden">

    <p className="mb-1 text-[9px] font-medium uppercase tracking-[0.3em] text-[#6C806D]">
      Join Bamboora
    </p>

    <h1 className="font-serif text-3xl text-[#20221E]">
      Create Account
    </h1>

  </div>


  {/* MAIN HEADING */}
  <div className="mb-4 text-center">

    <p className="mb-1 hidden text-[9px] font-medium uppercase tracking-[0.3em] text-[#6C806D] lg:block">
      Your Journey Begins
    </p>

    <h1 className="font-serif text-[20px] leading-tight text-[#20221E] sm:text-[36px]">
      Create Account
    </h1>

    {/* Ornament */}
    <div className="mt-1.5 flex items-center justify-center gap-2">

      <span className="h-px w-7 bg-[#AAB5A7]" />

      <span className="text-[10px] text-[#315C35]">
        ✦
      </span>

      <span className="h-px w-7 bg-[#AAB5A7]" />

    </div>

    <p className="mt-1 text-[11px] text-[#777A72]">
      Join our community of nature lovers
    </p>

  </div>


  {/* =================================================
      FORM CARD
  ================================================= */}
  <div className="rounded-2xl border border-[#E4DED2] bg-white p-4 shadow-[0_18px_55px_rgba(45,55,40,0.07)] sm:p-5">

    <form
      onSubmit={handleSubmit}
      className="space-y-2.5"
    >

      {/* NAME */}
      <div>

        <label
          htmlFor="name"
          className="mb-1 block text-[11px] font-medium text-[#3F443E]"
        >
          Full Name
        </label>

        <div className="relative">

          <User
            size={15}
            strokeWidth={1.5}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7C847A]"
          />

          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="
              h-10
              w-full
              rounded-lg
              border
              border-[#DDDAD0]
              bg-[#FCFBF8]
              pl-11
              pr-4
              text-[12px]
              text-[#24251F]
              outline-none
              transition-all
              duration-200
              placeholder:text-[#A0A29C]
              focus:border-[#315C35]
              focus:bg-white
              focus:ring-4
              focus:ring-[#315C35]/[0.06]
            "
          />

        </div>

      </div>


      {/* EMAIL */}
      <div>

        <label
          htmlFor="email"
          className="mb-1 block text-[11px] font-medium text-[#3F443E]"
        >
          Email Address
        </label>

        <div className="relative">

          <Mail
            size={15}
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
            className="
              h-10
              w-full
              rounded-lg
              border
              border-[#DDDAD0]
              bg-[#FCFBF8]
              pl-11
              pr-4
              text-[12px]
              text-[#24251F]
              outline-none
              transition-all
              duration-200
              placeholder:text-[#A0A29C]
              focus:border-[#315C35]
              focus:bg-white
              focus:ring-4
              focus:ring-[#315C35]/[0.06]
            "
          />

        </div>

      </div>


      {/* PASSWORD */}
      <div>

        <label
          htmlFor="password"
          className="mb-1 block text-[11px] font-medium text-[#3F443E]"
        >
          Password
        </label>

        <div className="relative">

          <Lock
            size={15}
            strokeWidth={1.5}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7C847A]"
          />

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
            className="
              h-10
              w-full
              rounded-lg
              border
              border-[#DDDAD0]
              bg-[#FCFBF8]
              pl-11
              pr-12
              text-[12px]
              text-[#24251F]
              outline-none
              transition-all
              duration-200
              placeholder:text-[#A0A29C]
              focus:border-[#315C35]
              focus:bg-white
              focus:ring-4
              focus:ring-[#315C35]/[0.06]
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((previous) => !previous)
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
                size={15}
                strokeWidth={1.5}
              />
            ) : (
              <Eye
                size={15}
                strokeWidth={1.5}
              />
            )}
          </button>

        </div>

        <p className="mt-0.5 text-[9px] text-[#999C95]">
          Must be at least 6 characters
        </p>

      </div>


      {/* CONFIRM PASSWORD */}
      <div>

        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-[11px] font-medium text-[#3F443E]"
        >
          Confirm Password
        </label>

        <div className="relative">

          <Lock
            size={15}
            strokeWidth={1.5}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7C847A]"
          />

          <input
            id="confirmPassword"
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            className="
              h-10
              w-full
              rounded-lg
              border
              border-[#DDDAD0]
              bg-[#FCFBF8]
              pl-11
              pr-12
              text-[12px]
              text-[#24251F]
              outline-none
              transition-all
              duration-200
              placeholder:text-[#A0A29C]
              focus:border-[#315C35]
              focus:bg-white
              focus:ring-4
              focus:ring-[#315C35]/[0.06]
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                (previous) => !previous
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7C847A] transition hover:text-[#315C35]"
            aria-label={
              showConfirmPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff
                size={15}
                strokeWidth={1.5}
              />
            ) : (
              <Eye
                size={15}
                strokeWidth={1.5}
              />
            )}
          </button>

        </div>

      </div>


      {/* ERROR */}
      {(error || registerMutation.isError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">

          <p className="text-[10px] leading-4 text-red-600">
            {error ||
              registerMutation.error?.message ||
              "Registration failed"}
          </p>

        </div>
      )}


      {/* REGISTER BUTTON */}
      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="
          group
          flex
          h-10
          w-full
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-[#214B29]
          text-[12px]
          font-medium
          text-white
          transition-all
          duration-300
          hover:bg-[#173D20]
          hover:shadow-[0_8px_20px_rgba(33,75,41,0.18)]
          active:scale-[0.985]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >

        {registerMutation.isPending ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Creating Account...
          </>
        ) : (
          <>
            Create Account

            <ArrowRight
              size={14}
              strokeWidth={1.7}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </>
        )}

      </button>

    </form>


    {/* DIVIDER */}
    <div className="my-2 flex items-center gap-3">

      <span className="h-px flex-1 bg-[#E8E5DD]" />

      <span className="text-[9px] tracking-widest text-[#999C95]">
        OR
      </span>

      <span className="h-px flex-1 bg-[#E8E5DD]" />

    </div>


    {/* LOGIN */}
    <p className="text-center text-[11px] text-[#777A72]">

      Already have an account?{" "}

      <Link
        to="/login"
        className="font-medium text-[#315C35] transition hover:text-[#173D20]"
      >
        Login
      </Link>

    </p>

  </div>


  {/* BOTTOM TEXT */}
  <p className="mt-1 text-center text-[8px] leading-4 text-[#999B94]">
    By creating an account, you agree to our Terms & Privacy Policy.
  </p>

</div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Register;