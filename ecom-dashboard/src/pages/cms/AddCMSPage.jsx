import React, { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { usePageStore } from "../../store/usePageStore";

const AddCMSPage = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const { createPage } = usePageStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createPage({ title, slug, content });
      setTitle("");
      setSlug("");
      setContent("");
      navigate("/dashboard/cms");
    } catch (err) {
      console.error("Create page failed:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">➕ Add CMS Page</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-md shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Privacy Policy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="e.g. privacy-policy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <Textarea
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the page content here..."
          />
        </div>

        <Button type="submit" className="w-full">
          Create Page
        </Button>
      </form>
    </div>
  );
};

export default AddCMSPage;
