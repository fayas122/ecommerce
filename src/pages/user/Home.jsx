import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { getProducts } from "../../services/productApi";
import ProductCard from "../../components/productCard";
import Navbar from "../../components/navbar";
import heroImage from "../../assets/Hero Image.png";
import discoveryimage from "../../assets/discovry.png";
import cimage1 from "../../assets/cimage1.jpg";
import cimage2 from "../../assets/cimage2.jpg";
import cimage3 from "../../assets/cimage3.jpg";
import cimage4 from "../../assets/cimage4.jpg";
import cornerimage from "../../assets/cornerimage.png";

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const featuredProducts = products;

  const productsPerSlide = 4;

  const totalSlides = 3;

  const startIndex = currentSlide * productsPerSlide;

  const currentProducts = featuredProducts.slice(
    startIndex,
    startIndex + productsPerSlide,
  );

  if (isLoading) {
    return <h1>Loading products...</h1>;
  }

  if (isError) {
    return <h1>Failed to load products</h1>;
  }

  return (
    <main className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-visible">
        {/* ================= HERO BACKGROUND ================= */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Bamboo furniture"
            className="h-full w-full object-cover object-center"
          />

          {/* Soft overlay */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* ================= NAVBAR ================= */}
        <div
          data-aos="fade-down"
          className="absolute fixed left-0 top-0 z-50 w-full"
        >
          <Navbar />
        </div>

        {/* Hero Content */}
        <div
          data-aos="fade-right"
          className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-8 lg:px-12"
        >
          <div className="max-w-[440px] pt-12 mt-12">
            <h1 className="font-serif text-5xl leading-[1.05] text-[#111] md:text-6xl">
              Crafted by Nature.
              <br />
              <span className="text-[#315c3b]">Made for You.</span>
            </h1>

            <div className="mt-6 h-[2px] w-8 bg-[#315c3b]" />

            <p className="mt-5 max-w-[330px] text-[15px] leading-7 text-[#292922]">
              Sustainable bamboo products
              <br />
              handcrafted for a better and
              <br />
              greener tomorrow.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-3 rounded-md bg-[#244c31] px-5 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#193b25]"
            >
              Shop Collection
              <span className="text-lg leading-none">→</span>
            </Link>
          </div>
        </div>

        {/* Features Card */}
        <div
          data-aos="fade-up"
          className="absolute bottom-0 left-1/2 z-50 w-[86%] max-w-[800px] -translate-x-1/2 translate-y-1/2"
        >
          {" "}
          <div className="grid grid-cols-2 overflow-hidden rounded-[14px] bg-[#f8f5ee]/95 shadow-lg backdrop-blur-md md:grid-cols-4">
            {/* ================= SUSTAINABLE ================= */}
            <div className="flex min-h-[80px] flex-col items-center justify-center px-4 py-5 text-center md:border-r md:border-[#e3ded3]">
              {/* Icon */}
              <div className="mb-3 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#e1e8dc]">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#52654d]"
                >
                  <path
                    d="M20 4C13 4 5 7 5 14C5 17.5 7.5 20 11 20C18 20 20 13 20 4Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 20C7 16 10 13 15 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3 className="text-[11px] font-semibold text-[#292929] md:text-xs">
                Sustainable
              </h3>

              <p className="mt-1 text-[9px] text-[#666] md:text-[10px]">
                Eco friendly products
              </p>
            </div>

            {/* ================= HANDMADE ================= */}
            <div className="flex min-h-[120px] flex-col items-center justify-center border-b border-[#e3ded3] px-4 py-5 text-center md:border-b-0 md:border-r">
              {/* Icon */}
              <div className="mb-3 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#e1e8dc]">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#52654d]"
                >
                  <path
                    d="M12 21V10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M12 10C9 10 7 8 7 5C10 5 12 7 12 10Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M12 14C15 14 17 12 17 9C14 9 12 11 12 14Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M8 21H16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3 className="text-[11px] font-semibold text-[#292929] md:text-xs">
                Handmade
              </h3>

              <p className="mt-1 text-[9px] text-[#666] md:text-[10px]">
                Crafted with care
              </p>
            </div>

            {/* ================= DURABLE ================= */}
            <div className="flex min-h-[120px] flex-col items-center justify-center border-r border-[#e3ded3] px-4 py-5 text-center">
              {/* Icon */}
              <div className="mb-3 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#e1e8dc]">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#52654d]"
                >
                  <path
                    d="M12 3L20 6V11C20 16 16.8 19.5 12 21C7.2 19.5 4 16 4 11V6L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M8.5 12L11 14.5L15.5 9.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="text-[11px] font-semibold text-[#292929] md:text-xs">
                Durable
              </h3>

              <p className="mt-1 text-[9px] text-[#666] md:text-[10px]">
                Long lasting quality
              </p>
            </div>

            {/* ================= NATURAL ================= */}
            <div className="flex min-h-[120px] flex-col items-center justify-center border-t border-[#e3ded3] px-4 py-5 text-center md:border-t-0">
              {/* Icon */}
              <div className="mb-3 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#e1e8dc]">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#52654d]"
                >
                  <path
                    d="M8 21V6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M12 21V3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M16 21V8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M8 9C6 8 5 6 5 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M12 7C14 6 15 4 15 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M16 13C18 12 19 10 19 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3 className="text-[11px] font-semibold text-[#292929] md:text-xs">
                Natural
              </h3>

              <p className="mt-1 text-[9px] text-[#666] md:text-[10px]">
                100% bamboo material
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative bg-white px-6 py-16 md:px-10">
        {/* Section Heading */}
        <div data-aos="fade-right" className="mb-8 text-center">
          <p className="mb-2 mt-6 text-[10px] font-semibold uppercase tracking-[2px] text-[#58745c]">
            OUR PICKS
          </p>

          <h2 className="font-serif text-3xl text-[#171717] md:text-4xl">
            Featured Products
          </h2>

          {/* Decorative divider */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-[#d8d4c8]" />

            <span className="text-sm text-[#6c8067]">✣</span>

            <span className="h-px w-8 bg-[#d8d4c8]" />
          </div>
        </div>

        {/* Products Container */}
        {featuredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <div className="relative mx-auto max-w-3xl">
            {/* Left Arrow */}
            <button
              type="button"
              onClick={() => {
                setCurrentSlide((prev) =>
                  prev === 0 ? totalSlides - 1 : prev - 1,
                );
              }}
              className="absolute -left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#333] shadow-md transition hover:bg-[#315c3b] hover:text-white md:-left-20"
            >
              <ChevronLeft size={19} strokeWidth={1.5} />
            </button>

            {/* Product Grid */}
            <div
              data-aos="fade-left"
              className="grid grid-cols-1 gap-8   sm:grid-cols-2 lg:grid-cols-4 "
            >
              {currentProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Right Arrow */}
            <button
              type="button"
              onClick={() => {
                setCurrentSlide((prev) =>
                  prev === totalSlides - 1 ? 0 : prev + 1,
                );
              }}
              className="absolute -right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#333] shadow-md transition hover:bg-[#315c3b] hover:text-white md:-right-20"
            >
              <ChevronRight size={19} strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* Slider Dots */}
        {totalSlides > 1 && (
          <div className="mt-5 flex justify-center gap-1.5">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "scale-125 bg-[#315c3b]"
                    : "bg-[#d8ddd5] hover:bg-[#9aa994]"
                }`}
              />
            ))}
          </div>
        )}

        {/* View All */}
        <div data-aos="fade-up"className="mt-7 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 border-b border-[#315c3b] pb-1 text-sm font-medium text-[#315c3b] transition hover:border-[#193b25] hover:text-[#193b25]"
          >
            View All Products
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* discovery */}

      <section
        data-aos="fade-up"
        className="relative flex min-h-[430px] w-full overflow-hidden bg-[#f7f5ef] shadow-sm"
      >
        {/* Image */}
        <div className="relative h-[430px] w-[55%] shrink-0">
          <img
            src={discoveryimage}
            alt="Bamboo forest"
            className="h-full w-full object-cover"
          />

          {/* Image fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#f7f5ef]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex w-[45%] max-w-[560px] flex-col justify-center px-10 py-14 lg:px-16">
          <span className="mb-3 text-[10px] font-semibold tracking-[0.08em] text-[#52604d]">
            OUR STORY
          </span>

          <h2 className="font-serif text-[clamp(34px,3.2vw,48px)] font-normal leading-[1.12] text-[#171914]">
            Made with Nature,
            <br />
            Made to Last.
          </h2>

          {/* Divider */}
          <div className="my-5 h-[2px] w-[22px] bg-[#1c281c]" />

          <p className="mb-6 max-w-[390px] text-[13px] leading-[1.65] text-[#555951]">
            We work with skilled artisans to create beautiful, durable and
            sustainable products that bring nature into your everyday life.
          </p>

          {/* Button */}
          <a
            href="/our-story"
            className="group inline-flex w-fit items-center gap-4 rounded-[4px] bg-[#17351d] px-[18px] py-[13px] text-[12px] text-white transition-all duration-300 hover:bg-[#254d2d]"
          >
            Discover Our Story
            <span className="text-[17px] leading-none transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

        {/* Decorative Leaf */}
        <div className="absolute -bottom-1 -right-1 w-[105px] rotate-[-4deg] text-[#3d6a2d] opacity-95">
          <svg viewBox="0 0 120 120" fill="none" className="w-full">
            <path
              d="M20 100C42 82 68 56 103 17"
              stroke="currentColor"
              strokeWidth="2"
            />

            <path
              d="M52 70C42 53 43 39 48 29C61 35 67 47 65 57"
              fill="currentColor"
            />

            <path
              d="M68 52C68 34 78 23 91 18C94 32 88 43 78 49"
              fill="currentColor"
            />

            <path
              d="M38 83C25 70 23 57 26 47C39 51 46 61 45 71"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section id="category" className="w-full bg-white px-6 py-12 md:py-16">
        {/* Section Heading */}
        <div data-aos="fade-up" className="mb-8 text-center">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#53604f]">
            Browse Collection
          </p>

          <h2 className="font-serif text-[28px] font-normal leading-tight text-[#171914] md:text-[34px]">
            Shop by Category
          </h2>

          {/* Small decorative divider */}
          <div className="mx-auto mt-2 flex items-center justify-center">
            <span className="h-px w-4 bg-[#68745f]" />
            <span className="mx-1 text-[11px] text-[#68745f]">✦</span>
            <span className="h-px w-4 bg-[#68745f]" />
          </div>
        </div>

        {/* Categories */}
        <div
          data-aos="fade-up"
          id="categories"
          className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-7 gap-y-8 md:gap-x-8 lg:gap-x-10"
        >
          {/* Furniture */}
          <Link
            to="/products?category=Furniture"
            className="group flex w-[110px] flex-col items-center text-center md:w-[125px]"
          >
            <div className="mb-3 h-[100px] w-[100px] overflow-hidden rounded-full bg-[#e8dfd0] md:h-[115px] md:w-[115px]">
              <img
                src={cimage1}
                alt="Furniture"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </div>

            <h3 className="text-[13px] font-medium text-[#20231d]">
              Furniture
            </h3>
          </Link>

          {/* Home Decor */}
          <Link
            to="/products?category=Decor"
            className="group flex w-[110px] flex-col items-center text-center md:w-[125px]"
          >
            <div className="mb-3 h-[100px] w-[100px] overflow-hidden rounded-full bg-[#e8dfd0] md:h-[115px] md:w-[115px]">
              <img
                src={cimage2}
                alt="Home Decor"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </div>

            <h3 className="text-[13px] font-medium text-[#20231d]">
              Home Decor
            </h3>
          </Link>

          {/* Kitchen */}
          <Link
            to="/products?category=Kitchen & Dining"
            className="group flex w-[110px] flex-col items-center text-center md:w-[125px]"
          >
            <div className="mb-3 h-[100px] w-[100px] overflow-hidden rounded-full bg-[#e8dfd0] md:h-[115px] md:w-[115px]">
              <img
                src={cimage3}
                alt="Kitchen"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </div>

            <h3 className="text-[13px] font-medium text-[#20231d]">Kitchen</h3>
          </Link>

          {/* Accessories */}
          <Link
            to="/products?category=Accessories"
            className="group flex w-[110px] flex-col items-center text-center md:w-[125px]"
          >
            <div className="mb-3 h-[100px] w-[100px] overflow-hidden rounded-full bg-[#e8dfd0] md:h-[115px] md:w-[115px]">
              <img
                src={cimage4}
                alt="Accessories"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </div>

            <h3 className="text-[13px] font-medium text-[#20231d]">
              Accessories
            </h3>
          </Link>
        </div>

        {/* View All Button */}
        <div data-aos="fade-up" className="mt-8 flex justify-center">
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 rounded-[4px] bg-[#17351d] px-5 py-3 text-[11px] font-medium text-white transition-all duration-300 hover:bg-[#254d2d]"
          >
            View All Categories
            <span className="text-[15px] transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

      <section className="w-full overflow-hidden">
        {/* =========================
      CUSTOMER REVIEWS
  ========================= */}
        <div className="relative bg-[#f1f2ec] px-5 py-10 sm:px-8 md:px-12 lg:px-16">
          {/* Decorative Bamboo Leaves - Left */}
          <div
            data-aos="fade-right"
            className="pointer-events-none absolute bottom-0 left-0 w-[90px] sm:w-[120px]"
          >
            <svg
              viewBox="0 0 130 130"
              fill="none"
              className="w-full text-[#477536]"
            >
              <path
                d="M0 128C28 100 60 68 126 4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M30 101C16 87 12 70 17 55C33 61 42 75 40 90"
                fill="currentColor"
              />
              <path
                d="M51 79C43 61 47 46 57 34C68 47 70 62 63 73"
                fill="currentColor"
              />
              <path
                d="M77 54C77 37 87 23 101 17C103 31 98 44 87 51"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Top Section */}
          <div
            data-aos="fade-right"
            className="relative mx-auto flex max-w-7xl items-center gap-5 lg:gap-8"
          >
            {/* Heading / Intro */}
            <div className="w-full shrink-0 px-0 sm:px-4 md:w-[28%] md:pl-10 lg:pl-8">
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#53604f]">
                What Our Customers Say
              </p>

              <h2 className="font-serif text-[27px] font-normal leading-tight text-[#171914] sm:text-[30px]">
                Loved by Thousands
              </h2>

              <div className="my-3 h-[2px] w-5 bg-[#263025]" />

              <p className="mb-5 max-w-[240px] text-[10px] leading-[1.65] text-[#62665e] sm:text-[11px]">
                Real reviews from real customers who love our bamboo products.
              </p>

              <Link
                to="/reviews"
                className="group inline-flex items-center gap-3 rounded-[3px] bg-[#17351d] px-4 py-2.5 text-[10px] font-medium text-white transition duration-300 hover:bg-[#254d2d]"
              >
                View All Reviews
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            {/* Review Cards */}
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {/* Review 1 */}
              <div
                data-aos="fade-left"
                className="min-h-[125px] rounded-[6px] border border-[#e2e3de] bg-white px-4 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.025)] sm:px-5"
              >
                <div className="mb-3 flex gap-[3px] text-[12px] text-[#efa51b]">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>

                <p className="text-[10px] leading-[1.65] text-[#4e524c]">
                  "The quality is amazing! You can feel the natural touch in
                  every product. Totally love it."
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <img
                    src="/images/testimonials/anjali.jpg"
                    alt="Anjali Sharma"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="text-[9px] text-[#33372f]">
                    — Anjali Sharma
                  </span>
                </div>
              </div>

              {/* Review 2 */}
              <div
                data-aos="fade-left"
                className="min-h-[125px] rounded-[6px] border border-[#e2e3de] bg-white px-4 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.025)] sm:px-5"
              >
                <div className="mb-3 flex gap-[3px] text-[12px] text-[#efa51b]">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>

                <p className="text-[10px] leading-[1.65] text-[#4e524c]">
                  "Beautiful craftsmanship and very durable. It fits perfectly
                  with my home decor."
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <img
                    src="/images/testimonials/rahul.jpg"
                    alt="Rahul Mehta"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="text-[9px] text-[#33372f]">
                    — Rahul Mehta
                  </span>
                </div>
              </div>

              {/* Review 3 */}
              <div
                data-aos="fade-left"
                className="min-h-[125px] rounded-[6px] border border-[#e2e3de] bg-white px-4 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.025)] sm:px-5"
              >
                <div className="mb-3 flex gap-[3px] text-[12px] text-[#efa51b]">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>

                <p className="text-[10px] leading-[1.65] text-[#4e524c]">
                  "Eco-friendly and stylish! Bamboo is now my go-to brand for
                  home products."
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <img
                    src="/images/testimonials/priya.jpg"
                    alt="Priya Nair"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="text-[9px] text-[#33372f]">
                    — Priya Nair
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Dots */}
          <div className="relative z-10 mt-5 flex justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#31552f]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#c8ccc3]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#c8ccc3]" />
          </div>
        </div>

        {/* =========================
      NEWSLETTER
  ========================= */}
        <div className="relative bg-[#faf9f5]">
          <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
            {/* Decorative / Product Image */}
            <div
              data-aos="fade-right"
              className="relative hidden h-[125px] w-[25%] overflow-hidden md:block"
            >
              <img
                src={cornerimage}
                alt="Natural bamboo home decor"
                className="h-full w-full object-cover"
              />

              {/* Soft fade */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#faf9f5]" />
            </div>

            {/* Newsletter Content */}
            <div
              data-aos="fade-up"
              className="flex flex-1 flex-col justify-center px-6 py-7 sm:px-10 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12"
            >
              {/* Text */}
              <div>
                <h3 className="font-serif text-[20px] font-normal text-[#20231d]">
                  Stay in the Loop
                </h3>

                <p className="mt-1.5 max-w-[300px] text-[9px] leading-[1.6] text-[#70736d] sm:text-[10px]">
                  Subscribe to get special offers, free giveaways
                  <br className="hidden sm:block" />
                  and once-in-a-lifetime deals.
                </p>
              </div>

              {/* Subscribe Form */}
              <form
                data-aos="fade-left"
                onSubmit={(e) => e.preventDefault()}
                className="mt-5 flex w-full max-w-[390px] md:mt-0"
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="h-[38px] min-w-0 flex-1 rounded-l-[4px] border border-[#d9dcd5] bg-white px-3 text-[10px] text-[#333] outline-none placeholder:text-[#a0a39d] focus:border-[#61705c]"
                />

                <button
                  type="submit"
                  className="h-[38px] rounded-r-[4px] bg-[#17351d] px-5 text-[10px] font-medium text-white transition hover:bg-[#254d2d]"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-[#173318] text-white">
        {/* Decorative Leaves */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
          <svg viewBox="0 0 1200 400" className="h-full w-full" fill="none">
            <path
              d="M0 80C55 35 70 15 115 0M0 150C50 110 90 95 130 55M0 230C45 190 75 175 115 125"
              stroke="white"
              strokeWidth="1"
            />

            <path
              d="M1200 70C1150 35 1130 15 1085 0M1200 145C1150 105 1120 85 1070 55M1200 225C1150 185 1120 160 1080 120"
              stroke="white"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:pr-8">
              <div className="mb-5 flex items-center gap-3">
                <svg viewBox="0 0 30 30" className="h-9 w-9" fill="none">
                  <path
                    d="M8 26V5M14 26V2M20 26V7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  <path
                    d="M8 9L4 5M8 14L3 11M14 7L19 3M14 12L20 9M20 12L25 8M20 17L26 14"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>

                <span className="font-serif text-xl tracking-wide">
                  WESTEROS
                </span>
              </div>

              <p className="max-w-[230px] text-sm leading-6 text-white/75">
                Eco-friendly bamboo products crafted by skilled artisans with
                love and care.
              </p>

              {/* Social Icons */}
              <div className="mt-5 flex gap-3">
                {["f", "◎", "▶", "p"].map((icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 text-sm text-white transition hover:bg-white hover:text-[#173318]"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <h3 className="mb-5 text-base font-semibold">Shop</h3>

              <ul className="space-y-3 text-sm text-white/75">
                <li>
                  <a href="/products" className="transition hover:text-white">
                    All Products
                  </a>
                </li>

                <li>
                  <a
                    href="/products?category=Furniture"
                    className="transition hover:text-white"
                  >
                    Furniture
                  </a>
                </li>

                <li>
                  <a
                    href="/products?category=Decor"
                    className="transition hover:text-white"
                  >
                    Home Decor
                  </a>
                </li>

                <li>
                  <a
                    href="/products?category=Kitchen"
                    className="transition hover:text-white"
                  >
                    Kitchen
                  </a>
                </li>

                <li>
                  <a
                    href="/products?category=Storage"
                    className="transition hover:text-white"
                  >
                    Storage
                  </a>
                </li>

                <li>
                  <a
                    href="/products?category=Accessories"
                    className="transition hover:text-white"
                  >
                    Accessories
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-5 text-base font-semibold">Company</h3>

              <ul className="space-y-3 text-sm text-white/75">
                <li>
                  <a href="/about" className="transition hover:text-white">
                    About Us
                  </a>
                </li>

                <li>
                  <a href="/our-story" className="transition hover:text-white">
                    Our Story
                  </a>
                </li>

                <li>
                  <a href="/blog" className="transition hover:text-white">
                    Blog
                  </a>
                </li>

                <li>
                  <a
                    href="/sustainability"
                    className="transition hover:text-white"
                  >
                    Sustainability
                  </a>
                </li>

                <li>
                  <a href="/contact" className="transition hover:text-white">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="mb-5 text-base font-semibold">Customer Service</h3>

              <ul className="space-y-3 text-sm text-white/75">
                <li>
                  <a href="/faq" className="transition hover:text-white">
                    FAQs
                  </a>
                </li>

                <li>
                  <a href="/shipping" className="transition hover:text-white">
                    Shipping & Delivery
                  </a>
                </li>

                <li>
                  <a href="/returns" className="transition hover:text-white">
                    Returns & Refunds
                  </a>
                </li>

                <li>
                  <a href="/terms" className="transition hover:text-white">
                    Terms & Conditions
                  </a>
                </li>

                <li>
                  <a href="/privacy" className="transition hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-5 text-base font-semibold">Contact</h3>

              <div className="space-y-4 text-sm text-white/75">
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-3 transition hover:text-white"
                >
                  <span className="text-base">⌕</span>
                  <span>+91 98765 43210</span>
                </a>

                <a
                  href="mailto:hello@bamboora.com"
                  className="flex items-center gap-3 transition hover:text-white"
                >
                  <span className="text-base">✉</span>
                  <span>hello@bamboora.com</span>
                </a>

                <div className="flex items-start gap-3">
                  <span className="text-base">⌖</span>
                  <span>Kerala, India - 673xxx</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-7 h-px bg-white/20" />

          {/* Bottom Footer */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/70">
              © 2024 Bamboora. All rights reserved.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-11 items-center justify-center rounded bg-white text-[10px] font-bold italic text-[#1a4d9c]">
                VISA
              </div>

              <div className="flex h-7 w-11 items-center justify-center rounded bg-white text-[10px] font-bold">
                <span className="text-[#d44b31]">●</span>
                <span className="-ml-1 text-[#f2b233]">●</span>
              </div>

              <div className="flex h-7 w-11 items-center justify-center rounded bg-white text-[9px] font-bold text-[#2473b8]">
                RuPay
              </div>

              <div className="flex h-7 w-11 items-center justify-center rounded bg-white text-[10px] font-bold text-[#19724d]">
                UPI
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Home;
