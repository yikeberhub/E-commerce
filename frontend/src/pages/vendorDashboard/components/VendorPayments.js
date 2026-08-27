import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiCreditCard, FiDollarSign, FiSend, FiX } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { inputClass, selectClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";

const API_URL = process.env.REACT_APP_API_URL;

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  completed: "bg-emerald-50 text-emerald-600",
  failed: "bg-red-50 text-red-600",
  refunded: "bg-slate-100 text-slate-500",
  paid: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-600",
};

const PAYOUT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "telebirr", label: "Telebirr" },
  { value: "cbe", label: "CBE" },
];

const emptyWithdrawalForm = {
  amount: "",
  payout_method: "bank_transfer",
  account_details: "",
};

function WithdrawalForm({ balance, onCancel, onSaved }) {
  const { authTokens } = useAuth();
  const [data, setData] = useState(emptyWithdrawalForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const amount = parseFloat(data.amount);
    if (!amount || amount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (balance != null && amount > Number(balance)) {
      setError("Amount exceeds your available balance.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/payments/withdrawals/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const firstError =
          errorData && Object.values(errorData).flat().filter(Boolean)[0];
        throw new Error(firstError || "Failed to submit withdrawal request.");
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-soft max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Request Withdrawal</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition"
            aria-label="Close"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form className="p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-500 text-xs bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Amount (ETB)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={balance ?? undefined}
              name="amount"
              value={data.amount}
              onChange={handleChange}
              required
              className={inputClass}
            />
            {balance != null && (
              <p className="text-xs text-slate-400 mt-1">
                Available: {Number(balance).toLocaleString()} ETB
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Payout Method
            </label>
            <select
              name="payout_method"
              value={data.payout_method}
              onChange={handleChange}
              className={selectClass}
            >
              {PAYOUT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Account / Phone Number
            </label>
            <input
              type="text"
              name="account_details"
              value={data.account_details}
              onChange={handleChange}
              required
              placeholder="Where should we send this?"
              className={inputClass}
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-500 hover:text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
            >
              {saving ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VendorPayments() {
  const { vendor, refetchVendor } = useOutletContext();
  const { authTokens } = useAuth();
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawals, setWithdrawals] = useState(null);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

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

  const fetchWithdrawals = async () => {
    try {
      setWithdrawalsLoading(true);
      const response = await fetch(`${API_URL}/payments/withdrawals/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to load withdrawal requests.");
      setWithdrawals(await response.json());
    } catch (err) {
      // Non-fatal — the payments table above still works.
    } finally {
      setWithdrawalsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleWithdrawalSaved = () => {
    setFormOpen(false);
    fetchWithdrawals();
    refetchVendor?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400">Available Balance</p>
          <p className="text-2xl font-bold text-slate-900 flex items-center gap-2 mt-1">
            <FiDollarSign className="text-primary-500" />
            {vendor?.balance != null ? `${Number(vendor.balance).toLocaleString()} ETB` : "—"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          disabled={!vendor?.balance}
          title={!vendor?.balance ? "No balance available to withdraw" : undefined}
          className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition shrink-0"
        >
          <FiSend className="text-xs" /> Request Withdrawal
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <h1 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FiSend className="text-primary-500" /> Withdrawal Requests
        </h1>

        {withdrawalsLoading ? (
          <RowSkeleton count={2} />
        ) : !withdrawals?.length ? (
          <EmptyState
            title="No withdrawal requests yet"
            description="Request a withdrawal to cash out your available balance."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {withdrawals.map((w) => (
              <div
                key={w.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 border border-slate-100 rounded-xl p-3 text-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800">
                    {Number(w.amount).toLocaleString()} ETB
                    <span className="text-xs text-slate-400 font-normal ml-2 capitalize">
                      {w.payout_method?.replace(/_/g, " ")} · {w.account_details}
                    </span>
                  </p>
                  {w.status === "rejected" && w.admin_note && (
                    <p className="text-xs text-red-500 mt-0.5">Note: {w.admin_note}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:shrink-0">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                      STATUS_STYLES[w.status] || "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {w.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(w.requested_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <h1 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FiCreditCard className="text-primary-500" /> Payments
        </h1>

        {loading ? (
          <RowSkeleton count={4} />
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : !payments?.length ? (
          <EmptyState
            title="No payments yet"
            description="Payments for your orders will show up here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-3 font-medium">Order</th>
                  <th className="py-2 pr-3 font-medium">Customer</th>
                  <th className="py-2 pr-3 font-medium">Method</th>
                  <th className="py-2 pr-3 font-medium">Amount</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-50 last:border-b-0">
                    <td className="py-2.5 pr-3 font-medium text-slate-800">
                      #{payment.order_id}
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600">{payment.customer}</td>
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
          </div>
        )}
      </div>

      {formOpen && (
        <WithdrawalForm
          balance={vendor?.balance}
          onCancel={() => setFormOpen(false)}
          onSaved={handleWithdrawalSaved}
        />
      )}
    </div>
  );
}

export default VendorPayments;
