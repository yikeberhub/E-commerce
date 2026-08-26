import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiCheckCircle,
  FiXCircle,
  FiPauseCircle,
  FiPlayCircle,
  FiSearch,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { inputClass, selectClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";

const API_URL = process.env.REACT_APP_API_URL;

function vendorStatus(vendor) {
  if (vendor.account_status === "suspended") return "suspended";
  if (!vendor.is_active) return "pending";
  return "active";
}

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  active: "bg-emerald-50 text-emerald-600",
  suspended: "bg-red-50 text-red-600",
};

const STATUS_LABELS = {
  pending: "Pending Approval",
  active: "Active",
  suspended: "Suspended",
};

function AdminVendorManagement() {
  const { authTokens } = useAuth();
  const [vendors, setVendors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/vendors/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to load vendors.");
      const data = await response.json();
      setVendors(data.sort((a, b) => b.id - a.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const updateVendor = async (vendorId, payload) => {
    setActionError("");
    setUpdatingId(vendorId);
    try {
      const response = await fetch(`${API_URL}/vendors/${vendorId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.detail || "Failed to update vendor.");
      setVendors((prev) => prev.map((v) => (v.id === vendorId ? { ...v, ...data } : v)));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const approve = (id) => updateVendor(id, { is_active: true, account_status: "active" });
  const suspend = (id) => updateVendor(id, { is_active: false, account_status: "suspended" });
  const reactivate = (id) => updateVendor(id, { is_active: true, account_status: "active" });
  const reject = (id) => updateVendor(id, { is_active: false, account_status: "inactive" });

  const deleteVendor = async (vendorId) => {
    setActionError("");
    setDeletingId(vendorId);
    try {
      const response = await fetch(`${API_URL}/vendors/${vendorId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to delete vendor.");
      setVendors((prev) => prev.filter((v) => v.id !== vendorId));
      setConfirmDeleteId(null);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredVendors = useMemo(() => {
    if (!vendors) return [];
    const term = search.trim().toLowerCase();
    return vendors.filter((v) => {
      const status = vendorStatus(v);
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (!term) return true;
      return (
        v.title?.toLowerCase().includes(term) ||
        v.email?.toLowerCase().includes(term) ||
        v.user?.username?.toLowerCase().includes(term)
      );
    });
  }, [vendors, statusFilter, search]);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FiBriefcase className="text-primary-500" /> Vendors
        </h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors..."
              className={`${inputClass} pl-8 w-48`}
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
            <option value="all">All statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {actionError && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">{actionError}</p>
      )}

      {loading ? (
        <RowSkeleton count={5} />
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : !filteredVendors.length ? (
        <EmptyState title="No vendors found" description="Vendors who register on the marketplace will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredVendors.map((vendor) => {
            const status = vendorStatus(vendor);
            const isUpdating = updatingId === vendor.id;

            return (
              <div
                key={vendor.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 border border-slate-100 rounded-xl p-3"
              >
                <Link to={`/admin-dashboard/vendors/${vendor.id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
                  <img
                    src={vendor.logo}
                    alt={vendor.title}
                    className="w-11 h-11 rounded-full object-cover shrink-0 bg-slate-50"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-slate-800 truncate group-hover:text-primary-600 transition">{vendor.title}</p>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>
                        {STATUS_LABELS[status]}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-slate-500 mt-0.5">
                      <span>{vendor.email}</span>
                      {vendor.user?.username && <span>@{vendor.user.username}</span>}
                      <span className="flex items-center gap-1">
                        <FiStar className="text-amber-400" /> {vendor.authentic_rating}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-2 sm:shrink-0">
                  {status === "pending" && (
                    <>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => approve(vendor.id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-lg py-2 px-3 transition"
                      >
                        <FiCheckCircle className="text-sm" /> Approve
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => reject(vendor.id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-lg py-2 px-3 transition"
                      >
                        <FiXCircle className="text-sm" /> Reject
                      </button>
                    </>
                  )}
                  {status === "active" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => suspend(vendor.id)}
                      className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 border border-amber-200 hover:border-amber-300 rounded-lg py-2 px-3 transition"
                    >
                      <FiPauseCircle className="text-sm" /> Suspend
                    </button>
                  )}
                  {status === "suspended" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => reactivate(vendor.id)}
                      className="flex items-center gap-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-lg py-2 px-3 transition"
                    >
                      <FiPlayCircle className="text-sm" /> Reactivate
                    </button>
                  )}

                  {confirmDeleteId === vendor.id ? (
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
                        disabled={deletingId === vendor.id}
                        onClick={() => deleteVendor(vendor.id)}
                        className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-2.5 py-1.5 rounded-lg transition"
                      >
                        {deletingId === vendor.id ? "Deleting..." : "Confirm"}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(vendor.id)}
                      className="flex items-center justify-center w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 transition shrink-0"
                      aria-label="Delete vendor"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminVendorManagement;
