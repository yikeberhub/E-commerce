import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiTrash2,
  FiMapPin,
  FiShoppingBag,
  FiStar,
  FiBriefcase,
  FiDollarSign,
} from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { selectClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";

const API_URL = process.env.REACT_APP_API_URL;

const ORDER_STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  payment_processing: "bg-amber-50 text-amber-600",
  payment_failed: "bg-red-50 text-red-600",
  processing: "bg-primary-50 text-primary-600",
  shipped: "bg-primary-50 text-primary-600",
  delivered: "bg-emerald-50 text-emerald-600",
  completed: "bg-emerald-50 text-emerald-600",
  canceled: "bg-slate-100 text-slate-500",
  returned: "bg-slate-100 text-slate-500",
  refunded: "bg-slate-100 text-slate-500",
};

function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authTokens, user: currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const [userRes, ordersRes, vendorsRes, reviewsRes] = await Promise.all([
          fetch(`${API_URL}/admin_api/super-admin-dashboard/users/${id}/`, {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          }),
          fetch(`${API_URL}/orders/`, { headers: { Authorization: `Bearer ${authTokens.access}` } }),
          fetch(`${API_URL}/vendors/`, { headers: { Authorization: `Bearer ${authTokens.access}` } }),
          fetch(`${API_URL}/products/reviews/admin/`, { headers: { Authorization: `Bearer ${authTokens.access}` } }),
        ]);
        if (!userRes.ok) throw new Error("Failed to load user.");
        const userData = await userRes.json();
        setUser(userData);

        if (ordersRes.ok) {
          const allOrders = await ordersRes.json();
          setOrders(allOrders.filter((o) => o.user?.id === userData.id));
        }
        if (vendorsRes.ok) {
          const allVendors = await vendorsRes.json();
          setVendorProfile(allVendors.find((v) => v.user?.id === userData.id) || null);
        }
        if (reviewsRes.ok) {
          const allReviews = await reviewsRes.json();
          setReviews(allReviews.filter((r) => r.user?.id === userData.id));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const updateUser = async (payload) => {
    setActionError("");
    setUpdating(true);
    try {
      const response = await fetch(`${API_URL}/admin_api/super-admin-dashboard/users/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.errors ? JSON.stringify(data.errors) : "Failed to update user.");
      setUser((prev) => ({ ...prev, ...data }));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const deleteUser = async () => {
    setActionError("");
    setUpdating(true);
    try {
      const response = await fetch(`${API_URL}/admin_api/super-admin-dashboard/users/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to delete user.");
      navigate("/admin-dashboard/users");
    } catch (err) {
      setActionError(err.message);
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <RowSkeleton count={4} />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5 text-red-500 text-sm">
        {error || "User not found."}
      </div>
    );
  }

  const isSelf = user.id === currentUser?.id;

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => navigate("/admin-dashboard/users")}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-600 transition w-fit"
      >
        <FiArrowLeft className="text-sm" /> Back to Users
      </button>

      {actionError && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{actionError}</p>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <img
            src={user.profile_image}
            alt={user.username}
            className="w-16 h-16 rounded-full object-cover shrink-0 bg-slate-50"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900">
              {user.first_name || user.last_name ? `${user.first_name} ${user.last_name}`.trim() : user.username}
              {isSelf && <span className="ml-2 text-xs font-medium text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">You</span>}
            </h1>
            <p className="text-sm text-slate-500">@{user.username}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 mt-2">
              <span className="flex items-center gap-1.5"><FiMail className="text-slate-400" /> {user.email}</span>
              {user.phone_number && (
                <span className="flex items-center gap-1.5"><FiPhone className="text-slate-400" /> {user.phone_number}</span>
              )}
              <span className="flex items-center gap-1.5"><FiDollarSign className="text-slate-400" /> {user.balance} ETB balance</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={user.role}
              disabled={isSelf || updating}
              onChange={(e) => updateUser({ role: e.target.value })}
              className={`${selectClass} disabled:opacity-60`}
            >
              <option value="admin">Admin</option>
              <option value="vendor">Vendor</option>
              <option value="customer">Customer</option>
            </select>
            <select
              value={user.account_status}
              disabled={isSelf || updating}
              onChange={(e) => updateUser({ account_status: e.target.value })}
              className={`${selectClass} disabled:opacity-60`}
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deactivated">Deactivated</option>
            </select>
            {!isSelf &&
              (confirmDelete ? (
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => setConfirmDelete(false)} className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1.5">
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={deleteUser}
                    className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-2.5 py-1.5 rounded-lg transition"
                  >
                    Confirm
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 transition shrink-0"
                  aria-label="Delete user"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              ))}
          </div>
        </div>

        {user.addresses?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
              <FiMapPin className="text-slate-400" /> Addresses
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {user.addresses.map((addr) => (
                <div key={addr.id} className="text-sm text-slate-600 bg-slate-50 rounded-lg p-2.5">
                  <p className="font-medium text-slate-800">{addr.full_name} {addr.is_default && <span className="text-[10px] text-primary-600">(default)</span>}</p>
                  <p>{addr.street_address}, {addr.city}, {addr.region}</p>
                  <p>{addr.phone_number}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {vendorProfile && (
        <Link
          to={`/admin-dashboard/vendors/${vendorProfile.id}`}
          className="bg-white rounded-xl border border-slate-100 shadow-card p-4 flex items-center gap-3 hover:border-primary-200 transition"
        >
          <img src={vendorProfile.logo} alt={vendorProfile.title} className="w-10 h-10 rounded-full object-cover bg-slate-50" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <FiBriefcase className="text-primary-500" /> {vendorProfile.title}
            </p>
            <p className="text-xs text-slate-400">This user owns a vendor shop — view its dashboard</p>
          </div>
        </Link>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <FiShoppingBag className="text-primary-500" /> Orders ({orders.length})
        </h2>
        {orders.length ? (
          <div className="flex flex-col gap-2">
            {orders.map((o) => (
              <Link
                key={o.id}
                to={`/admin-dashboard/orders/${o.id}`}
                className="flex items-center justify-between text-sm bg-slate-50 hover:bg-slate-100 rounded-lg px-3 py-2 transition"
              >
                <span className="font-medium text-slate-800">#{o.id}</span>
                <span className="text-slate-500">{o.vendor?.title || "—"}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${ORDER_STATUS_STYLES[o.status] || "bg-slate-100 text-slate-500"}`}>
                  {o.status?.replace(/_/g, " ")}
                </span>
                <span className="text-slate-700">{o.total_price} ETB</span>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No orders yet" description="Orders placed by this user will show up here." />
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <FiStar className="text-primary-500" /> Reviews Written ({reviews.length})
        </h2>
        {reviews.length ? (
          <div className="flex flex-col gap-2">
            {reviews.map((r) => (
              <div key={r.id} className="text-sm bg-slate-50 rounded-lg px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">{r.product_title}</span>
                  <span className="text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </div>
                {r.comment && <p className="text-slate-600 mt-1">{r.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No reviews yet" description="Reviews written by this user will show up here." />
        )}
      </div>
    </div>
  );
}

export default AdminUserDetail;
