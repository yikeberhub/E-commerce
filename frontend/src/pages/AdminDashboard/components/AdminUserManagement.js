import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiSearch, FiTrash2, FiMail, FiPlus } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { inputClass, selectClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";
import AdminModal from "./AdminModal";

const API_URL = process.env.REACT_APP_API_URL;

const ROLE_STYLES = {
  admin: "bg-primary-50 text-primary-600",
  vendor: "bg-violet-50 text-violet-600",
  customer: "bg-slate-100 text-slate-600",
};

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-600",
  suspended: "bg-amber-50 text-amber-600",
  deactivated: "bg-red-50 text-red-600",
};

function AdminUserManagement() {
  const { authTokens, user: currentUser } = useAuth();
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "customer", phone_number: "" });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin_api/super-admin-dashboard/users/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to load users.");
      const data = await response.json();
      setUsers(data.sort((a, b) => b.id - a.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUser = async (userId, payload) => {
    setActionError("");
    setUpdatingId(userId);
    try {
      const response = await fetch(`${API_URL}/admin_api/super-admin-dashboard/users/${userId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.errors ? JSON.stringify(data.errors) : "Failed to update user.");
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...data } : u)));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (userId) => {
    setActionError("");
    setUpdatingId(userId);
    try {
      const response = await fetch(`${API_URL}/admin_api/super-admin-dashboard/users/${userId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to delete user.");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setConfirmDeleteId(null);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      const response = await fetch(`${API_URL}/admin_api/super-admin-dashboard/users/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          data ? Object.values(data).flat().join(" ") : "Failed to create user."
        );
      }
      setUsers((prev) => [data, ...(prev || [])]);
      setShowAddUser(false);
      setNewUser({ username: "", email: "", password: "", role: "customer", phone_number: "" });
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!term) return true;
      return (
        u.username?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
      );
    });
  }, [users, roleFilter, search]);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FiUsers className="text-primary-500" /> Users
        </h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className={`${inputClass} pl-8 w-48`}
            />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={selectClass}>
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="vendor">Vendor</option>
            <option value="customer">Customer</option>
          </select>
          <button
            type="button"
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition shrink-0"
          >
            <FiPlus className="text-sm" /> Add User
          </button>
        </div>
      </div>

      {showAddUser && (
        <AdminModal title="Add User" onClose={() => setShowAddUser(false)}>
          <form onSubmit={createUser} className="flex flex-col gap-3">
            {createError && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{createError}</p>
            )}
            <div>
              <label className="text-xs font-medium text-slate-500">Username</label>
              <input
                type="text"
                required
                value={newUser.username}
                onChange={(e) => setNewUser((u) => ({ ...u, username: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Email</label>
              <input
                type="email"
                required
                value={newUser.email}
                onChange={(e) => setNewUser((u) => ({ ...u, email: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={newUser.password}
                onChange={(e) => setNewUser((u) => ({ ...u, password: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Phone number (optional)</label>
              <input
                type="text"
                value={newUser.phone_number}
                onChange={(e) => setNewUser((u) => ({ ...u, phone_number: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser((u) => ({ ...u, role: e.target.value }))}
                className={`${selectClass} w-full`}
              >
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="mt-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition"
            >
              {creating ? "Creating..." : "Create User"}
            </button>
          </form>
        </AdminModal>
      )}

      {actionError && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">{actionError}</p>
      )}

      {loading ? (
        <RowSkeleton count={5} />
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : !filteredUsers.length ? (
        <EmptyState title="No users found" description="Registered users will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredUsers.map((u) => {
            const isSelf = u.id === currentUser?.id;
            const isUpdating = updatingId === u.id;

            return (
              <div
                key={u.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 border border-slate-100 rounded-xl p-3"
              >
                <Link to={`/admin-dashboard/users/${u.id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
                  <img
                    src={u.profile_image}
                    alt={u.username}
                    className="w-11 h-11 rounded-full object-cover shrink-0 bg-slate-50"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-slate-800 truncate group-hover:text-primary-600 transition">
                        {u.first_name || u.last_name ? `${u.first_name} ${u.last_name}`.trim() : u.username}
                      </p>
                      {isSelf && (
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                          You
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <FiMail className="text-slate-400" /> {u.email}
                    </span>
                  </div>
                </Link>

                <div className="flex items-center gap-2 sm:shrink-0">
                  <select
                    value={u.role}
                    disabled={isSelf || isUpdating}
                    onChange={(e) => updateUser(u.id, { role: e.target.value })}
                    className={`${selectClass} ${ROLE_STYLES[u.role] || ""} border-0 font-medium disabled:opacity-60`}
                  >
                    <option value="admin">Admin</option>
                    <option value="vendor">Vendor</option>
                    <option value="customer">Customer</option>
                  </select>

                  <select
                    value={u.account_status}
                    disabled={isSelf || isUpdating}
                    onChange={(e) => updateUser(u.id, { account_status: e.target.value })}
                    className={`${selectClass} ${STATUS_STYLES[u.account_status] || ""} border-0 font-medium disabled:opacity-60`}
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="deactivated">Deactivated</option>
                  </select>

                  {!isSelf &&
                    (confirmDeleteId === u.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1.5"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => deleteUser(u.id)}
                          className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-2.5 py-1.5 rounded-lg transition"
                        >
                          {isUpdating ? "Deleting..." : "Confirm"}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(u.id)}
                        className="flex items-center justify-center w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 transition shrink-0"
                        aria-label="Delete user"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminUserManagement;
