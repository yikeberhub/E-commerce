import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiXCircle,
  FiUser,
  FiBriefcase,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { selectClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";

const API_URL = process.env.REACT_APP_API_URL;

const STATUS_STYLES = {
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

const ALL_STATUSES = Object.keys(STATUS_STYLES);
const CANCELABLE_STATUSES = new Set(["pending", "payment_processing", "processing"]);

function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authTokens } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/orders/${id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to load order.");
      setOrder(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus) => {
    setActionError("");
    setUpdating(true);
    try {
      const response = await fetch(`${API_URL}/orders/${id}/status/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.detail || "Failed to update order status.");
      setOrder((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const cancelOrder = async () => {
    setActionError("");
    setUpdating(true);
    try {
      const response = await fetch(`${API_URL}/orders/cancel/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.detail || "Failed to cancel order.");
      setOrder((prev) => ({ ...prev, status: "canceled" }));
      setConfirmCancel(false);
    } catch (err) {
      setActionError(err.message);
    } finally {
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

  if (error || !order) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5 text-red-500 text-sm">
        {error || "Order not found."}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => navigate("/admin-dashboard/orders")}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-600 transition w-fit"
      >
        <FiArrowLeft className="text-sm" /> Back to Orders
      </button>

      {actionError && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{actionError}</p>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Order #{order.id}</h1>
            <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] || "bg-slate-100 text-slate-500"}`}>
              {order.status?.replace(/_/g, " ")}
            </span>
            {CANCELABLE_STATUSES.has(order.status) &&
              (confirmCancel ? (
                <div className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2">
                  <span className="text-sm text-red-600">Cancel this order?</span>
                  <button type="button" onClick={() => setConfirmCancel(false)} className="text-sm font-medium text-slate-500 hover:text-slate-700 px-2 py-1">
                    Keep
                  </button>
                  <button type="button" disabled={updating} onClick={cancelOrder} className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-3 py-1.5 rounded-lg transition">
                    Yes, cancel
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmCancel(true)} className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-lg py-2 px-4 transition">
                  <FiXCircle className="text-sm" /> Cancel
                </button>
              ))}
            <select
              value={order.status}
              disabled={updating}
              onChange={(e) => updateStatus(e.target.value)}
              className={`${selectClass} disabled:opacity-60`}
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Link to={`/admin-dashboard/users/${order.user?.id}`} className="bg-white rounded-xl border border-slate-100 shadow-card p-4 hover:border-primary-200 transition">
          <h2 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
            <FiUser className="text-primary-500" /> Customer
          </h2>
          <p className="text-sm font-medium text-slate-800">{order.user?.first_name} {order.user?.last_name || order.user?.username}</p>
          <p className="text-xs text-slate-500">{order.user?.email}</p>
          {order.user?.phone_number && <p className="text-xs text-slate-500">{order.user.phone_number}</p>}
        </Link>

        {order.vendor && (
          <Link to={`/admin-dashboard/vendors/${order.vendor.id}`} className="bg-white rounded-xl border border-slate-100 shadow-card p-4 hover:border-primary-200 transition">
            <h2 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <FiBriefcase className="text-primary-500" /> Vendor
            </h2>
            <p className="text-sm font-medium text-slate-800">{order.vendor.title}</p>
            <p className="text-xs text-slate-500">{order.vendor.email}</p>
          </Link>
        )}

        {order.address && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <FiMapPin className="text-primary-500" /> Shipping Address
            </h2>
            <p className="text-sm text-slate-700">{order.address.street_address}, {order.address.city}, {order.address.region}</p>
            <p className="text-xs text-slate-500">{order.address.phone_number}</p>
          </div>
        )}

        {order.payment && (
          order.payment.id ? (
            <Link to={`/admin-dashboard/payments/${order.payment.id}`} className="bg-white rounded-xl border border-slate-100 shadow-card p-4 hover:border-primary-200 transition">
              <h2 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                <FiCreditCard className="text-primary-500" /> Payment
              </h2>
              <p className="text-sm font-medium text-slate-800 capitalize">{order.payment.payment_status}</p>
              <p className="text-xs text-slate-500">{order.payment.payment_method} · {order.payment.amount} {order.payment.currency?.toUpperCase()}</p>
            </Link>
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                <FiCreditCard className="text-primary-500" /> Payment
              </h2>
              <p className="text-sm font-medium text-slate-800 capitalize">{order.payment.payment_status}</p>
              <p className="text-xs text-slate-500">{order.payment.payment_method} · {order.payment.amount} {order.payment.currency?.toUpperCase()}</p>
            </div>
          )
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Items</h2>
        <div className="flex flex-col gap-2">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-slate-50 rounded-lg p-2.5">
              <img src={item.product?.image} alt={item.product?.title} className="w-10 h-10 rounded-md object-cover shrink-0 bg-white" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 truncate">{item.product?.title}</p>
                <p className="text-xs text-slate-500">{item.product?.price} ETB × {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-3 pt-3 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-800">Total: {order.total_price} ETB</p>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetail;
