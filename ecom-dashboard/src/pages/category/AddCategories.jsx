import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategoryStore } from "../../store/useCategoryStore";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Loader2 } from "lucide-react";

// Slugify helper
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -

// Generate 8-digit random category_id
const generateCategoryId = () => Math.floor(10000000 + Math.random() * 90000000);

const AddCategories = () => {
  const navigate = useNavigate();
  const { addCategory, isLoading } = useCategoryStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [slug, setSlug] = useState("");
  const [categoryId] = useState(generateCategoryId());

  // Whenever name changes, update slug
  const handleNameChange = (e) => {
    setName(e.target.value);
    setSlug(slugify(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category_id", categoryId);
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await addCategory(formData);
      navigate("/dashboard/category");
    } catch (error) {
      // handled in store
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1">Category ID</label>
          <Input type="text" value={categoryId} readOnly className="bg-gray-100 cursor-not-allowed" />
        </div>
        <label className="block text-xs font-medium mb-1">Category Name</label>
        <Input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={handleNameChange}
          required
        />
        <div>
          <label className="block text-xs font-medium mb-1">Slug</label>
          <Input type="text" value={slug} readOnly className="bg-gray-100 cursor-not-allowed" />
        </div>
        <label className="block text-xs font-medium mb-1">Description</label>
        <Input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className="block text-xs font-medium mb-1">Image</label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/dashboard/category")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCategories;
