// src/pages/ProductDetails.jsx
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb.jsx";
import { Button } from "../components/ui/button";
import { SlashIcon, ChevronLeft, ChevronRight } from "lucide-react"; // added arrows
import TrendingProdCard from "@/components/TrendingProdCard.jsx";
import Review from "../components/Review";
import { useProductStore } from "@/store/useProductStore.js";
import { useCartStore } from "@/store/useCartStore.js";
import { useAuthStore } from "@/store/useAuthStore.js";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const { product, getProductById, isLoading, error, clearProduct } =
    useProductStore();
  const { addToCart, fetchCart, isLoading: cartLoading } = useCartStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [section, setSection] = useState("description");
  const [qty, setQty] = useState(1);

  // Build images array (main + additional), de-duplicated, keep order
  const images = useMemo(() => {
    const list = [
      product?.image || product?.image_url,
      ...(Array.isArray(product?.additional_images)
        ? product.additional_images
        : []),
      ...(Array.isArray(product?.gallery) ? product.gallery : []),
    ]
      .filter(Boolean)
      .filter((x) => typeof x === "string");

    // de-duplicate while preserving order
    const seen = new Set();
    return list.filter((src) => {
      if (seen.has(src)) return false;
      seen.add(src);
      return true;
    });
  }, [product]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  // NEW: zoom state
  const imgWrapRef = useRef(null);
  const [zoom, setZoom] = useState({
    enabled: false,
    x: 50,
    y: 50,
    scale: 2.5,
  });

  // Move these ABOVE the effect that depends on mainSrc
  const hasImages = images.length > 0;
  const mainSrc = hasImages ? images[selectedIndex] : "/placeholder.png";

  const updateZoomPos = useCallback((clientX, clientY) => {
    const rect = imgWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    const clamp = (n) => Math.max(0, Math.min(100, n));
    setZoom((z) => ({ ...z, x: clamp(x), y: clamp(y) }));
  }, []);

  const onMouseMove = useCallback(
    (e) => {
      if (!zoom.enabled) return;
      updateZoomPos(e.clientX, e.clientY);
    },
    [zoom.enabled, updateZoomPos]
  );

  const onTouchMove = useCallback(
    (e) => {
      if (!zoom.enabled) return;
      const t = e.touches?.[0];
      if (t) updateZoomPos(t.clientX, t.clientY);
    },
    [zoom.enabled, updateZoomPos]
  );

  // Reset zoom when image changes
  useEffect(() => {
    setZoom((z) => ({ ...z, enabled: false, x: 50, y: 50 }));
  }, [selectedIndex, mainSrc]);

  useEffect(() => {
    getProductById(id);
    return () => clearProduct();
  }, [id]);

  // ✅ Normalize Decimal128 / string / number -> number
  const priceNumber = useMemo(() => {
    const raw = product?.price;
    if (raw == null) return 0;
    if (typeof raw === "number") return raw;
    if (typeof raw === "string") return parseFloat(raw) || 0;
    if (typeof raw === "object" && raw?.$numberDecimal)
      return parseFloat(raw.$numberDecimal) || 0;
    // Last resort
    return Number(raw) || 0;
  }, [product]);

  const featureList = useMemo(() => {
    const featuresText = product?.productFeatures || product?.features || "";
    return featuresText
      ? featuresText
          .split(".")
          .map((f) => f.trim())
          .filter(Boolean)
          .map((f, i) => <li key={i}>• {f}</li>)
      : null;
  }, [product]);

  if (isLoading && !product)
    return <div className="p-6 max-w-7xl mx-auto">Loading product…</div>;
  if (error && !product)
    return (
      <div className="p-6 max-w-7xl mx-auto text-center text-red-500">
        {error}
      </div>
    );
  if (!product)
    return (
      <div className="p-6 max-w-7xl mx-auto text-center text-red-500">
        Product not found 😢
      </div>
    );

  return (
    <div className="relative p-6 max-w-7xl mx-auto">
      <div className="relative z-0 pb-[300px]">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/product/${product._id}`}>Product Details</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Product Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left - Images */}
          <div className="flex gap-4">
            {/* Thumbnails (vertical on md+, scrollable) */}
            <div className="hidden md:flex md:flex-col gap-2 max-h-[520px] overflow-auto pr-1">
              {images.map((src, idx) => (
                <button
                  key={src + idx}
                  className={`border rounded-lg overflow-hidden w-20 h-20 flex-shrink-0 ${idx === selectedIndex ? "border-red-500" : "border-gray-200"}`}
                  onClick={() => setSelectedIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img
                    src={src}
                    alt={`Thumbnail ${idx + 1} - ${product?.name || ""}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            {/* Main image with click-to-zoom and next/prev controls */}
            <div
              ref={imgWrapRef}
              className={`relative flex-1 ${zoom.enabled ? "cursor-zoom-out" : "cursor-zoom-in"}`}
              onClick={() => setZoom((z) => ({ ...z, enabled: !z.enabled }))}
              onMouseMove={onMouseMove}
              onTouchMove={onTouchMove}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setZoom((z) => ({ ...z, enabled: !z.enabled }));
                } else if (e.key === "Escape") {
                  setZoom((z) => ({ ...z, enabled: false }));
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={zoom.enabled ? "Exit zoom" : "Click to zoom"}
            >
              {!zoom.enabled ? (
                <>
                  <img
                    src={mainSrc}
                    alt={product?.name}
                    className="rounded-lg shadow-lg w-full object-contain bg-white"
                    style={{ height: 520 }}
                  />
                  <span className="hidden md:block absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
                    Click to zoom
                  </span>
                </>
              ) : (
                <div
                  className="rounded-lg shadow-lg w-full h-full bg-white"
                  style={{
                    height: 520,
                    backgroundImage: `url(${mainSrc})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${zoom.scale * 100}%`,
                    backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                  }}
                />
              )}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border rounded-full p-2 shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(
                        (i) => (i - 1 + images.length) % images.length
                      );
                    }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border rounded-full p-2 shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex((i) => (i + 1) % images.length);
                    }}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right - Info */}
          <div>
            <div className="flex justify-end mb-2">
              <button className="text-red-500 text-sm hover:underline">
                ❤️ Add to Wishlist
              </button>
            </div>

            <h1 className="text-2xl font-semibold mb-2 uppercase">
              {product?.name}
            </h1>

            <p className="text-yellow-500 text-lg">
              {product?.stars || "★★★★★"}{" "}
              <span className="text-black font-semibold text-md">
                {product?.ratings ?? 5}
              </span>
            </p>

            {featureList && (
              <ul className="mt-4 space-y-1 text-gray-700">{featureList}</ul>
            )}

            {/* Qty */}
            <div className="mt-6 flex flex-col gap-2">
              <span className="text-sm">QTY</span>
              <div className="flex items-center border rounded px-2 w-fit mb-4">
                <Button
                  variant="ghost"
                  onClick={() => setQty((q) => Math.max(q - 1, 1))}
                >
                  -
                </Button>
                <span className="px-4">{qty}</span>
                <Button variant="ghost" onClick={() => setQty((q) => q + 1)}>
                  +
                </Button>
              </div>
            </div>

            {/* Price */}
            <span className="text-sm">PRICE</span>
            <p className="mt-2 text-2xl font-semibold">
              ₹{priceNumber.toFixed(2)}
            </p>

            {/* Actions */}
            <div className="flex mt-6">
              {/* <Button className="bg-[#BD1A12] px-7 hover:bg-red-700 text-white">
                Buy Now
              </Button> */}
              <Button
                variant="outline"
                className="border-[#FFAF19] text-[#BD1A12] px-14"
                disabled={cartLoading}
                onClick={async () => {
                  if (!authUser) {
                    toast.error("Please sign in to add items to cart");
                    navigate("/login", { state: { from: location.pathname } });
                    return;
                  }
                  try {
                    await addToCart(product._id, qty);
                    await fetchCart();
                    toast.success("Added to cart");
                  } catch (e) {
                    toast.error("Failed to add to cart");
                  }
                }}
              >
                {cartLoading ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20 mb-10">
          <div className="flex justify-center items-center gap-24 border-b mb-4">
            {["description", "storage", "reviews"].map((key) => (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={`pb-2 font-medium ${section === key ? "border-b-2 text-black" : "text-gray-500"}`}
                style={section === key ? { borderColor: "#FFAF19" } : {}}
              >
                {key === "description"
                  ? "Description"
                  : key === "storage"
                    ? "Storage & Usage"
                    : "Reviews"}
              </button>
            ))}
          </div>

          <div className="text-gray-700 whitespace-pre-wrap">
            {section === "description" && <p>{product?.description}</p>}
            {section === "storage" && (
              <p>
                {product?.storageAndUsage ||
                  "Storage Type: Airtight, Resealable Pouch"}
              </p>
            )}
            {section === "reviews" && <Review />}
          </div>
        </div>

        {/* Background */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center z-[-1]">
          <img
            src="/Behind-Products.webp"
            alt="Background"
            className="w-full h-full object-contain opacity-10 translate-y-10"
          />
        </div>
      </div>

      {/* Similar */}
      {/* <div className="mt-20 mb-10">
        <h2 className="font-bold text-3xl mb-6">
          Similar Products you might like
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="w-full">
              <TrendingProdCard />
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ProductDetails;
