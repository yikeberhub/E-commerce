import React, { useEffect, useMemo, useState } from "react";
import { FiSend, FiDollarSign, FiClock, FiCheckCircle, FiSearch, FiX } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { RowSkeleton, StatRowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";
import { inputClass, selectClass } from "../../../common/formStyles";
import Pagination from "./Pagination";

const API_URL = process.env.REACT_APP_API_URL;
const PAGE_SIZE = 15;

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  paid: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-600",
};

function AdminPayouts() {
  const { authTokens } = useAuth();
  const [withdrawals, setWithdrawals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [actionError, setActionError] = useState("");

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/payments/withdrawals/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to load withdrawal requests.");
      setWithdrawals(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const summary = useMemo(() => {
    if (!withdrawals) return { pendingTotal: 0, pendingCount: 0, paidTotal: 0 };
    return withdrawals.reduce(
      (acc, w) => {
        const amount = Number(w.amount) || 0;
        if (w.status === "pending") {
          acc.pendingTotal += amount;
          acc.pendingCount += 1;
        } else if (w.status === "paid") {
          acc.paidTotal += amount;
        }
        return acc;
      },
      { pendingTotal: 0, pendingCount: 0, paidTotal: 0 }
    );
  }, [withdrawals]);

  const filteredWithdrawals = useMemo(() => {
    if (!withdrawals) return [];
    const term = search.trim().toLowerCase();
    return withdrawals.filter((w) => {
      if (statusFilter !== "all" && w.status !== statusFilter) return false;
      if (!term) return true;
      return w.vendor_title?.toLowerCase().includes(term);
    });
  }, [withdrawals, search, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredWithdrawals.length / PAGE_SIZE));
  const pagedWithdrawals = filteredWithdrawals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateStatus = async (id, newStatus, adminNote = "") => {
    setActionError("");
    setUpdatingId(id);
    try {
      const response = await fetch(`${API_URL}/payments/withdrawals/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, admin_note: adminNote }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to update withdrawal request.");
      }
      const updated = await response.json();
      setWithdrawals((prev) => prev.map((w) => (w.id === id ? updated : w)));
      setRejectingId(null);
      setRejectNote("");
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <StatRowSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <FiClock /> Pending Requests
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1">{summary.pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <FiDollarSign /> Pending Amount
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {summary.pendingTotal.toLocaleString()} ETB
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <FiCheckCircle /> Total Paid Out
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {summary.paidTotal.toLocaleString()} ETB
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FiSend className="text-primary-500" /> Payouts
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by vendor..."
                className={`${inputClass} pl-8 w-48`}
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {actionError && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">{actionError}</p>
        )}

        {loading ? (
          <RowSkeleton count={4} />
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : !filteredWithdrawals.length ? (
          <EmptyState
            title="No withdrawal requests found"
            description="Vendor payout requests will show up here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {pagedWithdrawals.map((w) => {
              const isUpdating = updatingId === w.id;
              return (
                <div
                  key={w.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 border border-slate-100 rounded-xl p-3 text-sm"
                >
                  <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="col-span-2 sm:col-span-1 min-w-0">
                      <p className="text-xs text-slate-400">Vendor</p>
                      <p className="font-medium text-slate-800 truncate">{w.vendor_title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Amount</p>
                      <p className="font-medium text-slate-800">
                        {Number(w.amount).toLocaleString()} ETB
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">Payout To</p>
                      <p className="font-medium text-slate-800 capitalize truncate">
                        {w.payout_method?.replace(/_/g, " ")} · {w.account_details}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Requested</p>
                      <p className="font-medium text-slate-800">
                        {new Date(w.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:shrink-0">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                        STATUS_STYLES[w.status] || "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {w.status}
                    </span>
                    {w.status === "pending" && (
                      <>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => updateStatus(w.id, "paid")}
                          className="text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 px-3 py-1.5 rounded-lg transition"
                        >
                          Mark Paid
                        </button>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => {
                            setRejectingId(w.id);
                            setRejectNote("");
                          }}
                          className="text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 px-3 py-1.5 rounded-lg transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>

                  {rejectingId === w.id && (
                    <div className="w-full flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2 sm:col-span-full">
                      <input
                        type="text"
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        placeholder="Reason for rejecting (optional)"
                        className={`${inputClass} flex-1`}
                      />
                      <button
                        type="button"
                        onClick={() => setRejectingId(null)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1.5"
                        aria-label="Cancel"
                      >
                        <FiX />
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => updateStatus(w.id, "rejected", rejectNote)}
                        className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-3 py-1.5 rounded-lg transition shrink-0"
                      >
                        {isUpdating ? "Rejecting..." : "Confirm Reject"}
                      </button>
                    </div>
                  )}

                  {w.status === "rejected" && w.admin_note && (
                    <p className="w-full text-xs text-red-500 sm:col-span-full">
                      Note: {w.admin_note}
                    </p>
                  )}
                </div>
              );
            })}
            <Pagination page={page} pageCount={pageCount} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPayouts;
