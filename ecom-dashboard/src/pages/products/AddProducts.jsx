import React, { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useProductStore } from "../../store/useProductStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useNavigate } from "react-router-dom";
import { Label } from "../../components/ui/label";
import toast from "react-hot-toast";

const AddProducts = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock_quantity: "",
    discount: "",
    sku: "",
    product_id: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  const navigate = useNavigate();

  const { addProduct, isLoading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manage additional images: allow up to 5, show previews, and allow removal
  const handleAdditionalChange = (e) => {
    const picked = Array.from(e.target.files || []);
    // merge existing + new, dedupe by name-size-lastModified
    const merged = [...additionalImages, ...picked];
    const uniqueMap = new Map();
    merged.forEach((f) => uniqueMap.set(`${f.name}-${f.size}-${f.lastModified}`, f));
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

  const removeAdditionalAt = (index) => {
    const next = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(next);
    setAdditionalPreviews(next.map((f) => URL.createObjectURL(f)));
  };

  useEffect(() => {
    // cleanup previews to avoid memory leaks
    return () => {
      additionalPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [additionalPreviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (image) formData.append("image_url", image);
    additionalImages.forEach((file) =>
      formData.append("additional_images", file)
    );

    try {
      await addProduct(formData);
      navigate("/dashboard/products");
    } catch (err) {
      console.error("❌ Failed to add product:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            placeholder="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            placeholder="SKU"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="product_id">Product ID (optional)</Label>
          <Input
            id="product_id"
            placeholder="Product ID (optional)"
            name="product_id"
            value={form.product_id}
            onChange={handleChange}
            type="number"
          />
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            placeholder="Price"
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            required
          />
        </div>

        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            placeholder="Discount (%)"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            type="number"
          />
        </div>

        <div>
          <Label htmlFor="stock_quantity">Stock Quantity</Label>
          <Input
            id="stock_quantity"
            placeholder="Stock Quantity"
            name="stock_quantity"
            value={form.stock_quantity}
            onChange={handleChange}
            type="number"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* 📦 Category Select */}
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Category</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 📷 Main Image Upload Styled */}
        <div>
          <Label htmlFor="main_image" className="block mb-1">
            Main Product Image
          </Label>
          <input
            id="main_image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        {/* 📸 Additional Images Upload Styled */}
        <div>
          <Label htmlFor="additional_images" className="block mb-1">
            Additional Product Images
          </Label>
          <p className="text-xs text-gray-500 mb-2">You can add up to 5 images.</p>
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
                  <img src={src} alt={`Additional ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default AddProducts;
