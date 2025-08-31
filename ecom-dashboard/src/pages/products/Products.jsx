import React, { useEffect, useState } from "react";
import { useProductStore } from "../../store/useProductStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
// import { Loader2 } from "lucide-react"; // Uncomment if you want a spinner

const Products = () => {
  const {
    products,
    fetchProducts,
    deleteProduct,
    pagination,
    isLoading,
    filters,
  } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [search, setSearch] = useState(filters.search);
  const [currentPage, setCurrentPage] = useState(filters.page || 1);
  const [limit] = useState(10); // Feel free to make this dynamic if needed
  const [category, setCategory] = useState(filters.category || "");

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products on change
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts({ page: currentPage, limit, search, category });
    }, 300);
    return () => clearTimeout(delay);
  }, [currentPage, search, category, ]);

  // Reset page to 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await deleteProduct(id);
      fetchProducts({ page: currentPage, limit, search, category });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Products</h2>

      {/* 🔍 Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-between items-center">
        <Input
          placeholder="Search name, SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />


        <Link to="/dashboard/products/addProducts">
          <Button>Add Product</Button>
        </Link>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-5 py-3">Image</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  {/* <Loader2 className="mx-auto animate-spin" /> */}
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-t border-gray-200">
                  <td className="px-5 py-3 text-center">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-14 h-14 rounded object-cover"
                    />
                  </td>
                  <td className="px-5 py-3">{product.name}</td>
                  <td className="px-5 py-3">
                    ₹{parseFloat(product.price).toFixed(2)}
                  </td>
                  <td className="px-5 py-3">{product.stock_quantity}</td>
                  <td className="px-5 py-3">{product.sku}</td>
                  <td className="px-5 py-3">{product.category?.name || "-"}</td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Link to={`/dashboard/products/edit/${product._id}`}>
                        <Button size="sm">Edit</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔢 Pagination */}
      {pagination && (
        <div className="flex justify-between items-center mt-4">
          <Button
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={!pagination.hasPrevPage}
          >
            Prev
          </Button>
          <span className="text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            size="sm"
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

export default Products;
