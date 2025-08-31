import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePageStore } from "../../store/usePageStore";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

const EditCMSPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    currentPage,
    fetchPageBySlug,
    updatePage,
    loading,
  } = usePageStore();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
  });

  useEffect(() => {
    if (slug) fetchPageBySlug(slug);
  }, [slug]);

  useEffect(() => {
    if (currentPage) {
      setForm({
        title: currentPage.title || "",
        slug: currentPage.slug || "",
        content: currentPage.content || "",
      });
    }
  }, [currentPage]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePage(slug, form);
      navigate("/dashboard/cms");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">✏️ Edit CMS Page</h2>

      {loading ? (
        <p>Loading page...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Slug</label>
            <Input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Content</label>
            <Textarea
              name="content"
              rows={8}
              value={form.content}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Page"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/cms")}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditCMSPage;
