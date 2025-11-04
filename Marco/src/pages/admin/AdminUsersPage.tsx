import { useCallback, useEffect, useState } from "react";
import { userService, type User } from "../../api/userServices";
import Pagination from "../../components/Pagination";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch users (with optional role filter)
  const fetchUsers = useCallback(async (role?: string, pageNum = page) => {
    setLoading(true);
    try {
      const res = await userService.getUsers({ role, page: pageNum, limit: 8 });
      setUsers(res.data || []);
      setTotalPages(res.meta.lastPage);
    } catch (error) {
      console.error(error);
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  // ✅ Fetch users whenever `page` or `roleFilter` changes
  useEffect(() => {
    fetchUsers(roleFilter, page);
  }, [fetchUsers, roleFilter, page]);

  // ✅ Handle role filter change — resets page to 1
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setRoleFilter(newRole);
    setPage(1); // 👈 reset to first page
  };

  // ✅ Handle user activation/deactivation
  const handleStatusChange = async (user: User, action: "activate" | "deactivate") => {
    const confirmMsg =
      action === "activate"
        ? `Are you sure you want to activate ${user.name}?`
        : `Are you sure you want to deactivate ${user.name}?`;

    if (!confirm(confirmMsg)) return;

    try {
      if (action === "activate") {
        await userService.activateUser(user.id);
        alert(`${user.name} activated successfully!`);
      } else {
        await userService.deactivateUser(user.id);
        alert(`${user.name} deactivated successfully!`);
      }

      // 🔄 Refresh after update (keeps filter and page)
      fetchUsers(roleFilter, page);
    } catch (error) {
      console.error(error);
      alert("Failed to update user status.");
    }
  };

  if (loading) return <p className="loading-text">Loading users...</p>;

  return (
    <div className="admin-users">
      <h2>👥 Manage Users</h2>

      {/* Filter Bar */}
      <div className="filter-bar">
        <label>Role Filter:</label>
        <select value={roleFilter} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="admin">Admin</option>
          <option value="customer">Customers</option>
          <option value="employee">Employee</option>
          <option value="supplier">Supplier</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {users.length === 0 ? (
        <p className="no-users">No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="role">{u.role}</td>
                <td>
                  <span className={`status ${u.role.toLowerCase()}`}>{u.role}</span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u.role === "pending" ? (
                    <button
                      className="btn-activate"
                      onClick={() => handleStatusChange(u, "activate")}
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      className="btn-deactivate"
                      onClick={() => handleStatusChange(u, "deactivate")}
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
