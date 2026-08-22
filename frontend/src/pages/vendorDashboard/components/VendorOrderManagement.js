import React, { useEffect, useState } from "react";
import { FiShoppingBag, FiChevronDown, FiXCircle } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { selectClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";

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

const NEXT_ACTION = {
  pending: { status: "processing", label: "Start Processing" },
  payment_processing: { status: "processing", label: "Start Processing" },
  processing: { status: "shipped", label: "Mark Shipped" },
  shipped: { status: "delivered", label: "Mark Delivered" },
  delivered: { status: "completed", label: "Mark Completed" },
};

const CANCELABLE_STATUSES = new Set(["pending", "payment_processing", "processing"]);

function VendorOrderManagement() {
  const { authTokens } = useAuth();
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [actionError, setActionError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/orders/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to load orders.");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    setActionError("");
    setUpdatingId(orderId);
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.detail || "Failed to update order status.");
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const cancelOrder = async (orderId) => {
    setActionError("");
    setUpdatingId(orderId);
    try {
      const response = await fetch(`${API_URL}/orders/cancel/${orderId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.detail || "Failed to cancel order.");
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "canceled" } : o))
      );
      setConfirmCancelId(null);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders?.filter((o) => o.status === statusFilter);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FiShoppingBag className="text-primary-500" /> Orders
        </h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selectClass}
        >
          <option value="all">All statuses</option>
          {Object.keys(STATUS_STYLES).map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {actionError && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">
          {actionError}
        </p>
      )}

      {loading ? (
        <RowSkeleton count={4} />
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : !filteredOrders?.length ? (
        <EmptyState
          title="No orders found"
          description="Orders placed for your products will show up here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredOrders.map((order) => {
            const nextAction = NEXT_ACTION[order.status];
            const isExpanded = expandedId === order.id;

            return (
              <div
                key={order.id}
                className="border border-slate-100 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="w-full flex flex-col sm:flex-row sm:items-center gap-3 p-3 text-left hover:bg-slate-50/60 transition"
                >
                  <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Order</p>
                      <p className="font-medium text-slate-800">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Customer</p>
                      <p className="font-medium text-slate-800 truncate">
                        {order.user?.username || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Date</p>
                      <p className="font-medium text-slate-800">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Total</p>
                      <p className="font-medium text-slate-800">
                        {order.total_price} ETB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:shrink-0">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                        STATUS_STYLES[order.status] || "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {order.status?.replace(/_/g, " ")}
                    </span>
                    <FiChevronDown
                      className={`text-slate-400 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 p-3 bg-slate-50/50 flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Customer contact</p>
                        <p className="text-slate-700">{order.user?.email}</p>
                        {order.user?.phone_number && (
                          <p className="text-slate-700">{order.user.phone_number}</p>
                        )}
                      </div>
                      {order.address?.city && (
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Ship to</p>
                          <p className="text-slate-700">
                            {order.address.street_address}, {order.address.city},{" "}
                            {order.address.region}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 bg-white rounded-lg border border-slate-100 p-2.5"
                        >
                          <img
                            src={item.product?.image}
                            alt={item.product?.title}
                            className="w-10 h-10 rounded-md object-cover shrink-0 bg-slate-50"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-800 truncate">
                              {item.product?.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.product?.price} ETB × {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {CANCELABLE_STATUSES.has(order.status) && (
                        <button
                          type="button"
                          onClick={() => setConfirmCancelId(order.id)}
                          className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-lg py-2 px-4 transition"
                        >
                          <FiXCircle className="text-sm" /> Cancel
                        </button>
                      )}
                      {nextAction && (
                        <button
                          type="button"
                          disabled={updatingId === order.id}
                          onClick={() => updateStatus(order.id, nextAction.status)}
                          className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg py-2 px-4 transition"
                        >
                          {updatingId === order.id ? "Updating..." : nextAction.label}
                        </button>
                      )}
                    </div>

                    {confirmCancelId === order.id && (
                      <div className="flex items-center justify-between gap-3 bg-red-50 rounded-lg px-3 py-2.5">
                        <p className="text-sm text-red-600">
                          Cancel this order? This can't be undone.
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setConfirmCancelId(null)}
                            className="text-sm font-medium text-slate-500 hover:text-slate-700 px-2 py-1"
                          >
                            Keep order
                          </button>
                          <button
                            type="button"
                            disabled={updatingId === order.id}
                            onClick={() => cancelOrder(order.id)}
                            className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-3 py-1.5 rounded-lg transition"
                          >
                            {updatingId === order.id ? "Canceling..." : "Yes, cancel"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VendorOrderManagement;
