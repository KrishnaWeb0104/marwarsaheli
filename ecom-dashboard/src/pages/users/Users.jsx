import React, { useEffect, useMemo, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useUsersStore } from "../../store/useUsersStore";

const Users = () => {
  const { users, pagination, fetchUsers, isLoading, filters } = useUsersStore();
  const [search, setSearch] = useState(filters.q || "");
  const [role, setRole] = useState(filters.role || "");
  const [page, setPage] = useState(filters.page || 1);
  const limit = filters.limit || 10;

  useEffect(() => {
    fetchUsers({ page, limit, q: search, role });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchUsers({ page: 1, limit, q: search, role });
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search, role]);

  const totalPages = useMemo(() => pagination?.totalPages || 1, [pagination]);

  const onPrev = () => {
    const p = Math.max(1, page - 1);
    setPage(p);
    fetchUsers({ page: p, limit, q: search, role });
  };

  const onNext = () => {
    const p = Math.min(totalPages, page + 1);
    setPage(p);
    fetchUsers({ page: p, limit, q: search, role });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Users</h2>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search name, username, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Roles</option>
          <option value="CUSTOMER">CUSTOMER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="SUB_ADMIN">SUB_ADMIN</option>
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-6">Loading...</td>
              </tr>
            ) : (users?.length ? users.map((u) => (
              <tr key={u._id} className="border-t border-gray-200">
                <td className="px-4 py-2">{u.fullName}</td>
                <td className="px-4 py-2">{u.userName}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.role}</td>
                <td className="px-4 py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center py-6">No users found</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button size="sm" onClick={onPrev} disabled={page === 1}>Prev</Button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <Button size="sm" onClick={onNext} disabled={page === totalPages}>Next</Button>
        </div>
      )}
    </div>
  );
};

export default Users;
