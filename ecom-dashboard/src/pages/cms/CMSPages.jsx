import React, { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { usePageStore } from "../../store/usePageStore";

const CMSPages = () => {
  const [search, setSearch] = useState("");
  const {
    pages,
    fetchPages,
    deletePage,
    togglePageStatus,
    loading,
  } = usePageStore();
  const [filteredPages, setFilteredPages] = useState([]);

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      const result = pages.filter((page) =>
        page.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredPages(result);
    }, 300);
    return () => clearTimeout(delay);
  }, [search, pages]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📄 CMS Pages</h2>

      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search pages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Link to="add">
          <Button>Add CMS Page</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Slug</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Last Updated</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredPages.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  No pages found
                </td>
              </tr>
            ) : (
              filteredPages.map((page) => (
                <tr key={page._id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{page.title}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{page.slug}</td>
                  <td className="px-4 py-2">
                    {page.isActive ? "✅ Active" : "❌ Inactive"}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Link to={`/dashboard/cms/edit/${page.slug}`}>
                      <Button size="sm">Edit</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePageStatus(page.slug)}
                    >
                      Toggle
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deletePage(page.slug)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CMSPages;
