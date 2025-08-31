import React, { useEffect, useState } from "react";
import { useBrandStore } from "../../store/useBrandStore";

const Brands = () => {
  const {
    brands,
    pagination,
    isLoading,
    fetchBrands,
    addBrand,
    updateBrand,
    deleteBrand,
  } = useBrandStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBrands({ page, limit, search: searchQuery });
  }, [page, searchQuery]);

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
    };
    try {
      if (editMode) {
        await updateBrand(editId, payload);
      } else {
        await addBrand(payload);
      }
      fetchBrands({ page, limit, search: searchQuery });
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    await deleteBrand(id);
    fetchBrands({ page, limit, search: searchQuery });
  };

  const openEdit = (brand) => {
    setEditId(brand._id);
    setForm({ name: brand.name, description: brand.description });
    setEditMode(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setForm({ name: "", description: "" });
    setEditMode(false);
    setEditId(null);
    setShowModal(false);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Brands</h2>

      {/* Search & Add */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-sm"
        />
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Brand
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-md shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Description</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand._id} className="border-t">
                  <td className="px-4 py-2">{brand.name}</td>
                  <td className="px-4 py-2">{brand.description}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => openEdit(brand)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm text-red-600 hover:underline"
                      onClick={() => handleDelete(brand._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setPage((prev) =>
                prev < pagination.totalPages ? prev + 1 : prev
              )
            }
            disabled={page >= pagination.totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">
              {editMode ? "Edit Brand" : "Add Brand"}
            </h3>
            <form onSubmit={handleAddOrEdit} className="space-y-4">
              <input
                type="text"
                placeholder="Brand Name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editMode ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;
