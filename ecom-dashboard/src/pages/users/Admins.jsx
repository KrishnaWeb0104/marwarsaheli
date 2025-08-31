import React, { useEffect, useMemo, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAdminsStore } from "../../store/useAdminsStore";

const Admins = () => {
  const navigate = useNavigate();
  const { admins, pagination, fetchAdmins, toggleAdmin, deleteAdmin, isLoading } = useAdminsStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      fetchAdmins({ page: 1, limit, q: search });
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search, fetchAdmins]);

  // Initial load
  useEffect(() => {
    fetchAdmins({ page, limit });
  }, []);

  const totalPages = useMemo(() => pagination?.totalPages || 1, [pagination]);

  const onPrev = () => {
    const p = Math.max(1, page - 1);
    setPage(p);
    fetchAdmins({ page: p, limit, q: search });
  };

  const onNext = () => {
    const p = Math.min(totalPages, page + 1);
    setPage(p);
    fetchAdmins({ page: p, limit, q: search });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🛡️ Admins</h2>

      {/* Search */}
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search by name, username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => navigate("/dashboard/users/admins/add")}>Add Admin</Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Active</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-6">Loading...</td>
              </tr>
            ) : (admins?.length ? admins.map((a) => (
              <tr key={a._id} className="border-t border-gray-200">
                <td className="px-4 py-2">{a?.user?.fullName || a?.user?.userName || "-"}</td>
                <td className="px-4 py-2">{a?.user?.email || "-"}</td>
                <td className="px-4 py-2 capitalize">{a?.role?.toLowerCase()}</td>
                <td className="px-4 py-2">{a?.isActive ? "Yes" : "No"}</td>
                <td className="px-4 py-2">{new Date(a?.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button size="sm" onClick={() => navigate(`/dashboard/users/admins/add?id=${a._id}`)}>Edit</Button>
                  <Button size="sm" variant="secondary" onClick={async () => { await toggleAdmin(a._id); fetchAdmins({ page, limit, q: search }); }}>Toggle</Button>
                  <Button size="sm" variant="destructive" onClick={async () => { if (confirm("Delete this admin?")) { await deleteAdmin(a._id); fetchAdmins({ page, limit, q: search }); } }}>Remove</Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center py-6">No admins found</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button size="sm" onClick={onPrev} disabled={page === 1}>
            ⬅️ Prev
          </Button>
          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          <Button size="sm" onClick={onNext} disabled={page === totalPages}>
            Next ➡️
          </Button>
        </div>
      )}
    </div>
  );
};

export default Admins;
