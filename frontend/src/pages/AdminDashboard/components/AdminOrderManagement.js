import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { selectClass, inputClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";
import Pagination from "./Pagination";

const PAGE_SIZE = 10;

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

function AdminOrderManagement() {
  const { authTokens } = useAuth();
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/orders/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        if (!response.ok) throw new Error("Failed to load orders.");
        setOrders(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    const term = search.trim().toLowerCase();
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    if (to) to.setHours(23, 59, 59, 999);
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      const created = new Date(o.created_at);
      if (from && created < from) return false;
      if (to && created > to) return false;
      if (!term) return true;
      return (
        o.user?.username?.toLowerCase().includes(term) ||
        o.vendor?.title?.toLowerCase().includes(term) ||
        String(o.id).includes(term)
      );
    });
  }, [orders, statusFilter, search, dateFrom, dateTo]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search, dateFrom, dateTo]);

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const pagedOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FiShoppingBag className="text-primary-500" /> Orders
        </h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition w-44"
          />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={`${inputClass} w-36`}
            aria-label="From date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={`${inputClass} w-36`}
            aria-label="To date"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={selectClass}
          >
            <option value="all">All statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <RowSkeleton count={4} />
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : !filteredOrders.length ? (
        <EmptyState
          title="No orders found"
          description="Orders placed across the marketplace will show up here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {pagedOrders.map((order) => (
            <Link
              key={order.id}
              to={`/admin-dashboard/orders/${order.id}`}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-slate-100 rounded-xl hover:border-primary-200 hover:bg-slate-50/60 transition"
            >
              <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
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
                  <p className="text-xs text-slate-400">Vendor</p>
                  <p className="font-medium text-slate-800 truncate">
                    {order.vendor?.title || "—"}
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

              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize sm:shrink-0 ${
                  STATUS_STYLES[order.status] || "bg-slate-100 text-slate-500"
                }`}
              >
                {order.status?.replace(/_/g, " ")}
              </span>
            </Link>
          ))}
          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </div>
      )}
    </div>
  );
}

export default AdminOrderManagement;
