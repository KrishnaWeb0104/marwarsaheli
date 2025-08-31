import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useCategoryStore } from "../store/useCategoryStore";
import { useAuthStore } from "../store/useAuthStore"; // Import auth store
import { useCartStore } from "../store/useCartStore"; // NEW
import axiosInstance from "../utils/api"; // NEW
import toast from "react-hot-toast"; // NEW

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCatPanel, setShowCatPanel] = useState(false);
  const [searchText, setSearchText] = useState("");
  // NEW: search state
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  const navigate = useNavigate();
  const { dropdownCategories, fetchDropdownCategories, isLoading } =
    useCategoryStore();
  const { authUser } = useAuthStore();
  const { cart, fetchCart, addToCart } = useCartStore(); // UPDATED: addToCart

  // Fetch cart when user is logged in (and on login change)
  useEffect(() => {
    if (authUser) {
      fetchCart().catch(() => {});
    }
  }, [authUser, fetchCart]);

  const items = cart?.items || [];
  const cartCount = items.reduce((sum, it) => sum + (it.quantity || 0), 0);

  // fetch on first open (cached)
  const handleOpenCategories = async () => {
    await fetchDropdownCategories();
    setShowCatPanel((s) => !s);
  };

  // click outside to close (both panels)
  const panelRef = useRef(null);
  const searchPanelRef = useRef(null); // NEW
  useEffect(() => {
    const onClick = (e) => {
      const t = e.target;
      if (panelRef.current && !panelRef.current.contains(t))
        setShowCatPanel(false);
      if (searchPanelRef.current && !searchPanelRef.current.contains(t))
        setShowSearchPanel(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    const q = searchText.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setShowSearchPanel(false);
      return;
    }
    setSearching(true);
    const id = setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get("/products", {
          params: { search: q, page: 1, limit: 6 },
        });
        const list = data?.data?.products || data?.products || data?.data || [];
        setSearchResults(Array.isArray(list) ? list : []);
        setShowSearchPanel(true);
      } catch {
        setSearchResults([]);
        setShowSearchPanel(false);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [searchText]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchText.trim()) params.set("search", searchText.trim());
    setShowSearchPanel(false);
    navigate(`/products?${params.toString()}`);
  };

  // helper: parse price safely
  const priceNum = (val) => {
    if (val && typeof val === "object" && "$numberDecimal" in val)
      return parseFloat(val.$numberDecimal);
    const n = Number(val ?? 0);
    return Number.isFinite(n) ? n : 0;
  };

  return (
    <header className="relative flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-6 py-3 gap-4 md:gap-0">
      {/* 1️⃣ Logo + Hamburger */}
      <Link to="/">
        <div className="flex justify-between items-center w-full md:w-auto">
          <img
            src="/marwar-saheli-logo.webp"
            alt="Marwar Saheli"
            className="h-12 md:h-16"
          />
          <div
            className="md:hidden text-3xl text-red-700 cursor-pointer"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IoMdClose /> : <HiMenuAlt3 />}
          </div>
        </div>
      </Link>

      {/* 2️⃣ Desktop-only Nav on the LEFT */}
      <nav className="hidden md:flex items-center gap-8 text-zinc-800">
        <Link to="aboutUs">
          <div className="hover:text-red-700 cursor-pointer transition">
            About Us
          </div>
        </Link>
        <Link to="resources">
          <div className="hover:text-red-700 cursor-pointer transition">
            Resources
          </div>
        </Link>
      </nav>

      {/* 3️⃣ Search + All Categories (center) */}
      <div className="relative w-full md:w-auto">
        <form
          onSubmit={handleSearch}
          className="flex items-center border-2 border-red-700 rounded-md overflow-hidden shadow-sm h-12 w-full md:w-auto"
        >
          {/* All Categories button */}
          <button
            type="button"
            onClick={handleOpenCategories}
            className="bg-red-700 px-3 text-white h-full flex items-center text-sm whitespace-nowrap"
            aria-haspopup="true"
            aria-expanded={showCatPanel}
            aria-controls="category-panel"
          >
            All Categories
          </button>

          <input
            type="text"
            placeholder="Search"
            className="px-3 py-2 w-full md:w-80 focus:outline-none text-gray-600 text-sm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => {
              if (searchResults.length) setShowSearchPanel(true);
            }}
          />

          <button
            type="submit"
            className="px-4 text-red-700 hover:text-red-800"
            aria-label="Search"
          >
            <FaSearch />
          </button>
        </form>

        {/* 🔎 Search Suggestions Panel */}
        {showSearchPanel && (
          <div
            ref={searchPanelRef}
            className="absolute z-50 mt-2 w-[min(92vw,28rem)] max-h-[70vh] overflow-auto rounded-md border border-zinc-200 bg-white shadow-lg"
          >
            <div className="px-3 py-2 text-xs text-zinc-500 border-b">
              {searching ? "Searching..." : "Search results"}
            </div>

            {!searching && searchResults.length === 0 && (
              <div className="px-3 py-4 text-sm text-zinc-600">
                No products found.
              </div>
            )}

            {searchResults.length > 0 && (
              <ul className="divide-y">
                {searchResults.map((p) => (
                  <li key={p._id} className="flex items-center gap-3 px-3 py-3">
                    <Link
                      to={`/product/${p._id}`}
                      className="flex items-center gap-3 flex-1 min-w-0"
                      onClick={() => setShowSearchPanel(false)}
                    >
                      <img
                        src={p.image_url || p.images?.[0] || "/placeholder.svg"}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-800 truncate">
                          {p.name}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                          ₹{priceNum(p.price).toFixed(2)}
                        </p>
                      </div>
                    </Link>

                    <button
                      className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 whitespace-nowrap"
                      onClick={async () => {
                        if (!authUser) {
                          toast.error("Please sign in to add items to cart");
                          navigate("/login", {
                            state: { from: `/product/${p._id}` },
                          });
                          return;
                        }
                        try {
                          await addToCart(p._id, 1);
                          await fetchCart();
                          toast.success("Added");
                        } catch {
                          toast.error("Failed");
                        }
                      }}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* View all results */}
            {searchResults.length > 0 && (
              <button
                className="w-full text-center text-sm text-red-700 hover:bg-red-50 py-2"
                onClick={() => {
                  setShowSearchPanel(false);
                  navigate(
                    `/products?search=${encodeURIComponent(searchText.trim())}`
                  );
                }}
              >
                View all results
              </button>
            )}
          </div>
        )}

        {/* 🔽 Category Panel */}
        {/*
        {showCatPanel && (
          <div
            ref={panelRef}
            id="category-panel"
            className="absolute z-50 mt-2 w-[min(92vw,28rem)] max-h-[60vh] overflow-auto rounded-md border border-zinc-200 bg-white shadow-lg p-2"
          >
            <div className="px-2 py-1 text-xs text-zinc-500">
              {isLoading && dropdownCategories.length === 0
                ? "Loading categories..."
                : "Browse by category"}
            </div>

            {!isLoading && dropdownCategories.length === 0 && (
              <div className="px-2 py-3 text-sm text-zinc-600">
                No categories found.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {dropdownCategories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${encodeURIComponent(
                    cat.slug || cat._id
                  )}`}
                  onClick={() => setShowCatPanel(false)}
                  className="px-3 py-2 rounded hover:bg-red-50 text-sm text-zinc-800 hover:text-red-700 transition"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
        */}
      </div>

      {/* 4️⃣ Desktop-only Buttons on the RIGHT */}
      <div className="hidden md:flex items-center gap-4 h-12">
        <Link to="/cart">
          <button className="relative flex items-center gap-2 px-4 py-2 border border-red-700 text-red-700 rounded-full hover:bg-red-50 transition text-sm cursor-pointer">
            <FiShoppingCart className="h-5 w-5" />
            <span>My Cart</span>
            {/* Badge */}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">
                {cartCount}
              </span>
            )}
          </button>
        </Link>

        {/* Conditional rendering based on auth status */}
        {authUser ? (
          <Link to="account">
            <button className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition text-sm cursor-pointer">
              <VscAccount className="h-5 w-5" />
              <span>My Account</span>
            </button>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="login">
              <button className="px-4 py-2 border border-red-700 text-red-700 rounded-full hover:bg-red-50 transition text-sm cursor-pointer">
                Sign In
              </button>
            </Link>
            <Link to="signup">
              <button className="px-4 py-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition text-sm cursor-pointer">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* 5️⃣ Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md z-50 px-4 py-4 flex flex-col gap-4">
          <Link
            to="aboutUs"
            className="text-zinc-800 hover:text-red-700 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            to="resources"
            className="text-zinc-800 hover:text-red-700 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Resources
          </Link>

          {/* Mobile: put the All Categories button too */}
          <button
            onClick={handleOpenCategories}
            className="text-left px-4 py-2 border border-red-700 text-red-700 rounded-full hover:bg-red-50 transition text-sm w-fit"
          >
            All Categories
          </button>

          <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
            <button className="flex items-center gap-2 px-4 py-2 border border-red-700 text-red-700 rounded-full hover:bg-red-50 transition text-sm w-fit">
              <FiShoppingCart className="h-5 w-5" />
              <span>My Cart{cartCount > 0 ? ` (${cartCount})` : ""}</span>
            </button>
          </Link>

          {/* Mobile: Conditional auth buttons */}
          {authUser ? (
            <Link to="account" onClick={() => setMobileMenuOpen(false)}>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition text-sm w-fit">
                <VscAccount className="h-5 w-5" />
                <span>My Account</span>
              </button>
            </Link>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="login" onClick={() => setMobileMenuOpen(false)}>
                <button className="px-4 py-2 border border-red-700 text-red-700 rounded-full hover:bg-red-50 transition text-sm w-fit">
                  Sign In
                </button>
              </Link>
              <Link to="register" onClick={() => setMobileMenuOpen(false)}>
                <button className="px-4 py-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition text-sm w-fit">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
