import React, { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useCategoryStore } from "../../store/useCategoryStore";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Category = () => {
  const {
    categories,
    fetchCategories,
    deleteCategory,
    isLoading,
    pagination,
  } = useCategoryStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5); // Items per page

  // 🔁 Fetch categories on load/search/page
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCategories({ search: searchQuery, page: currentPage, limit });
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, currentPage]);

  // Reset to page 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Categories</h2>

      {/* 🔍 Search & ➕ Add */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button asChild>
          <Link to="/dashboard/category/add">Add Category</Link>
        </Button>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Image</th>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Description</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-t border-gray-200">
                  <td className="px-4 py-2">
                    {cat.image && (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2">{cat.name}</td>
                  <td className="px-4 py-2">{cat.description}</td>
                  <td className="px-4 py-2 md:space-x-4 md:space-y-2">
                    <Button size="sm" asChild>
                      <Link to={`/dashboard/category/edit/${cat._id}`}>
                        Edit
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteCategory(cat._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔢 Pagination */}
      {pagination && (
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={!pagination.hasPrevPage}
          >
            Prev
          </Button>
          <span className="text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) =>
                pagination.hasNextPage ? prev + 1 : prev
              )
            }
            disabled={!pagination.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Category;
