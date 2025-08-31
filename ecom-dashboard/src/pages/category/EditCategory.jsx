import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategoryStore } from "../../store/useCategoryStore";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Loader2 } from "lucide-react";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    category,
    getCategoryById,
    updateCategory,
    isLoading,
  } = useCategoryStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // ⏳ Load category on mount
  useEffect(() => {
    getCategoryById(id);
  }, [id]);

  // ✍️ Set form fields once category is fetched
  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setPreviewImage(category.image || null);
    }
  }, [category]);

  // 📦 Handle file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  // ✅ Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    await updateCategory(id, formData);
    navigate("/dashboard/category");
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Edit Category</h2>

      {isLoading || !category ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Image</label>
            <Input type="file" onChange={handleImageChange} />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-24 h-24 rounded object-cover"
              />
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Category"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default EditCategory;
