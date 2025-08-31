import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../../store/useProductStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { getProductById, updateProduct, product, isLoading } =
    useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    stock_quantity: "",
    sku: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // helper: Decimal128 | number | string -> string for inputs
  const toDecimalString = (val) => {
    if (val == null) return "";
    if (typeof val === "object" && "$numberDecimal" in val)
      return val.$numberDecimal;
    if (typeof val === "number") return String(val);
    if (typeof val === "string") return val;
    return "";
  };

  // 🧠 Prefill form when product is fetched
  useEffect(() => {
    if (productId) {
      fetchCategories();
      getProductById(productId);
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        // FIX: ensure number shows in input
        price: toDecimalString(product.price),
        discount: toDecimalString(product.discount),
        stock_quantity: toDecimalString(product.stock_quantity),
        sku: product.sku || "",
        category: product.category?._id || "",
      });

      setPreviewImage(product.image_url || "");
    }
  }, [product]);

  // 🖼️ Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAdditionalChange = (e) => {
    const picked = Array.from(e.target.files || []);
    // merge existing + new, dedupe by name-size-lastModified
    const merged = [...additionalImages, ...picked];
    const uniqueMap = new Map();
    merged.forEach((f) =>
      uniqueMap.set(`${f.name}-${f.size}-${f.lastModified}`, f)
    );
    let unique = Array.from(uniqueMap.values());
    const max = 5;
    if (unique.length > max) {
      toast.error(`You can upload up to ${max} additional images`);
      unique = unique.slice(0, max);
    }
    setAdditionalImages(unique);
    setAdditionalPreviews(unique.map((f) => URL.createObjectURL(f)));
    // reset input value so re-selecting the same files works
    e.target.value = "";
  };

  // ✍️ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🚀 Submit the update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);

    // FIX: parse safely (fallback to 0 if empty)
    const priceNum = parseFloat(formData.price);
    const discountNum = parseFloat(formData.discount);
    const stockNum = parseInt(formData.stock_quantity, 10);

    payload.append("price", Number.isFinite(priceNum) ? priceNum : 0);
    payload.append("discount", Number.isFinite(discountNum) ? discountNum : 0);
    payload.append("stock_quantity", Number.isFinite(stockNum) ? stockNum : 0);

    payload.append("sku", formData.sku);
    payload.append("category", formData.category);

    if (imageFile) {
      payload.append("image_url", imageFile);
    }

    try {
      const success = await updateProduct(productId, payload);
      if (success) {
        toast.success("Product updated!");
        navigate("/dashboard/products");
      }
    } catch {
      toast.error("Failed to update product.");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              step="0.01"
              required
            />
          </div>

          <div>
            <Label htmlFor="discount">Discount %</Label>
            <Input
              id="discount"
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Discount %"
            />
          </div>

          <div>
            <Label htmlFor="stock_quantity">Stock Quantity</Label>
            <Input
              id="stock_quantity"
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              placeholder="Stock Quantity"
              required
            />
          </div>

          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="SKU"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Category</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="image">Product Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-24 h-24 rounded object-cover"
              />
            )}
          </div>
          <div>
            <Label htmlFor="additional_images" className="block mb-1">
              Additional Product Images
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              You can add up to 5 images.
            </p>
            <input
              id="additional_images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleAdditionalChange}
              className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
            />
            {additionalPreviews?.length ? (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {additionalPreviews.map((src, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <img
                      src={src}
                      alt={`Additional ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalAt(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                      aria-label={`Remove additional image ${idx + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <Button type="submit" className="w-full">
            Update Product
          </Button>
        </form>
      )}
    </div>
  );
};

export default EditProduct;
