import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCreditCard, FiDollarSign, FiCheckCircle, FiClock, FiSearch } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { RowSkeleton, StatRowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";
import { inputClass, selectClass } from "../../../common/formStyles";
import Pagination from "./Pagination";

const API_URL = process.env.REACT_APP_API_URL;
const PAGE_SIZE = 15;

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  completed: "bg-emerald-50 text-emerald-600",
  failed: "bg-red-50 text-red-600",
  refunded: "bg-slate-100 text-slate-500",
};

function AdminPayments() {
  const { authTokens } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${API_URL}/payments/mine/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        if (!response.ok) throw new Error("Failed to load payments.");
        setPayments(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const summary = useMemo(() => {
    if (!payments) return { total: 0, completed: 0, pending: 0 };
    return payments.reduce(
      (acc, p) => {
        if (p.payment_status === "completed") {
          acc.total += Number(p.amount) || 0;
          acc.completed += 1;
        } else if (p.payment_status === "pending") {
          acc.pending += 1;
        }
        return acc;
      },
      { total: 0, completed: 0, pending: 0 }
    );
  }, [payments]);

  const filteredPayments = useMemo(() => {
    if (!payments) return [];
    const term = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (statusFilter !== "all" && p.payment_status !== statusFilter) return false;
      if (!term) return true;
      return (
        p.customer?.toLowerCase().includes(term) ||
        p.vendor?.toLowerCase().includes(term) ||
        String(p.order_id).includes(term)
      );
    });
  }, [payments, search, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE));
  const pagedPayments = filteredPayments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <StatRowSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <FiDollarSign /> Total Collected
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {summary.total.toLocaleString()} ETB
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <FiCheckCircle /> Completed Payments
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1">{summary.completed}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <FiClock /> Pending Payments
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1">{summary.pending}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FiCreditCard className="text-primary-500" /> Payments
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search payments..."
                className={`${inputClass} pl-8 w-48`}
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {loading ? (
          <RowSkeleton count={4} />
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : !filteredPayments.length ? (
          <EmptyState
            title="No payments found"
            description="Payments made across the marketplace will show up here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-3 font-medium">Order</th>
                  <th className="py-2 pr-3 font-medium">Customer</th>
                  <th className="py-2 pr-3 font-medium">Vendor</th>
                  <th className="py-2 pr-3 font-medium">Method</th>
                  <th className="py-2 pr-3 font-medium">Amount</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {pagedPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    onClick={() => navigate(`/admin-dashboard/payments/${payment.id}`)}
                    className="border-b border-slate-50 last:border-b-0 cursor-pointer hover:bg-slate-50/60 transition"
                  >
                    <td className="py-2.5 pr-3 font-medium text-slate-800">
                      #{payment.order_id}
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600">{payment.customer}</td>
                    <td className="py-2.5 pr-3 text-slate-600">{payment.vendor || "—"}</td>
                    <td className="py-2.5 pr-3 text-slate-600 capitalize">
                      {payment.payment_method}
                    </td>
                    <td className="py-2.5 pr-3 font-medium text-slate-800">
                      {payment.amount} {payment.currency?.toUpperCase()}
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                          STATUS_STYLES[payment.payment_status] || "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {payment.payment_status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-500">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={page} pageCount={pageCount} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPayments;
