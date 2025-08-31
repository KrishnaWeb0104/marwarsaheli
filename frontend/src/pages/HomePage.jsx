import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCategoryStore } from "../store/useCategoryStore"; // NEW

// helper to match CategoryPage's slug format
const slugify = (label) =>
  encodeURIComponent(label.trim().toLowerCase().replace(/\s+/g, "-"));

const HomePage = () => {
  const { dropdownCategories, fetchDropdownCategories } = useCategoryStore(); // NEW

  useEffect(() => {
    fetchDropdownCategories();
  }, [fetchDropdownCategories]);

  const imageBySlug = {
    spices: "/Spices.webp",
    biscuits: "/Biscuits.webp",
    papads: "/Papads.webp",
  };

  const items = useMemo(() => {
    const dyn = (dropdownCategories || []).map((c) => ({
      src: imageBySlug[c.slug] || "/placeholder.webp",
      label: c.name,
      slug: slugify(c.name), // CategoryPage finds by slugified name
    }));
    if (dyn.length) return dyn;

    // fallback (static) if API not loaded yet
    return [
      { src: "/Spices.webp", label: "Spices", slug: slugify("Spices") },
      { src: "/Biscuits.webp", label: "Biscuits", slug: slugify("Biscuits") },
      { src: "/Papads.webp", label: "Papads", slug: slugify("Papads") },
    ];
  }, [dropdownCategories]);

  return (
    <div className="relative h-[550px] sm:h-[650px]">
      {/* Desktop Background Image */}
      <div className="absolute inset-0">
        <img
          src="/HomePage-1.webp"
          className="w-full h-full object-cover"
          alt="Background"
        />
      </div>

      {/* Bottom Illustration */}
      <div className="absolute bottom-0 right-0 z-10 max-w-[70%] sm:max-w-none sm:bottom-0 sm:right-0">
        <img
          src="/HomePage-2.webp"
          className="w-full h-auto object-contain"
          alt=""
        />
      </div>

      {/* Content */}
      <div className="relative z-20">
        {/* Product Categories - Always in Row */}
        <div className="flex flex-row justify-center items-center gap-5 sm:gap-8 py-8 sm:py-6 flex-wrap">
          {items.map((item) => (
            <Link
              key={item.slug}
              to={`/category/${item.slug}`}
              className="flex flex-col items-center"
              aria-label={`Browse ${item.label}`}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-orange-400 overflow-hidden">
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 font-bold text-black text-sm">{item.label}</p>
            </Link>
          ))}
        </div>

        {/* Headline & CTA */}
        <div className="flex flex-col sm:block items-start text-left px-4 sm:px-16 max-w-full sm:max-w-4xl mt-4 sm:mt-6">
          <h1 className="text-white text-3xl sm:text-6xl font-bold leading-snug sm:leading-tight mb-4 sm:mb-6">
            Spices of the <span className="text-[#3e2b08]">Desert</span>
            <br className="max-sm:hidden" />
            <span className="block sm:inline"> Stories of Her Hands</span>
          </h1>

          <p className="text-white text-base sm:text-lg leading-relaxed max-w-lg sm:max-w-2xl mx-auto sm:mx-0 mb-6">
            Handcrafted by Rajasthan’s rural women — pure, bold, and rooted in
            tradition.
          </p>

          <div className="flex flex-row justify-center sm:justify-start gap-4">
            {" "}
            <Link to="/productsList">
              <button className="bg-[#ffaf19] text-white px-6 py-2 sm:px-8 sm:py-3 rounded-2xl font-semibold text-sm sm:text-base cursor-pointer">
                Shop Now
              </button>
            </Link>
            <button className="bg-white hover:bg-gray-100 text-[#ffaf19] px-6 py-2 sm:px-8 sm:py-3 rounded-2xl font-semibold text-sm sm:text-base cursor-pointer">
              Discover Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
