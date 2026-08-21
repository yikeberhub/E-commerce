import { React, useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { FiHome, FiPrinter, FiCheckCircle, FiXCircle } from "react-icons/fi";

import ShopLogoImg from "../../../../assets/icons/shopLogo/shop_logo.jpg";
import { RowSkeleton } from "../../../../common/Skeleton";

const API_URL = process.env.REACT_APP_API_URL;

const PrintableReceipt = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return <p className="text-slate-500">No payment details available.</p>;
  }

  return (
    <div className="max-w-lg mx-auto">
      <img
        src={ShopLogoImg}
        alt="Logo"
        className="w-16 h-16 mx-auto mb-3 rounded-full object-cover"
      />
      <h1 className="text-xl font-bold text-center text-slate-900 mb-6">
        Payment Receipt
      </h1>

      {payments.map((entry) => {
        const payment = entry.payment;
        return (
          <div
            key={entry.transaction_id}
            className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400">
                #{entry.transaction_id}
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {payment.payment_status}
              </span>
            </div>
            <dl className="grid grid-cols-2 gap-y-1.5 text-sm">
              <dt className="text-slate-500">Amount</dt>
              <dd className="text-right font-semibold text-slate-800">
                {payment.amount} {payment.currency?.toUpperCase() || "ETB"}
              </dd>
              <dt className="text-slate-500">Payment Method</dt>
              <dd className="text-right text-slate-700">
                {payment.payment_method || "N/A"}
              </dd>
              <dt className="text-slate-500">Gateway</dt>
              <dd className="text-right text-slate-700">
                {payment.payment_gateway || "N/A"}
              </dd>
              <dt className="text-slate-500">Date</dt>
              <dd className="text-right text-slate-700">
                {payment.created_at
                  ? new Date(payment.created_at).toLocaleString()
                  : "N/A"}
              </dd>
            </dl>
          </div>
        );
      })}

      <p className="text-center text-sm text-primary-600 font-medium mt-2">
        Thank you for your purchase!
      </p>
    </div>
  );
};

const PaymentDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get("txt_ref");

  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | failed | error
  const [error, setError] = useState(null);
  const receiptRef = useRef(null);

  useEffect(() => {
    const fetchPaymentDetail = async () => {
      const storedTransactionIds = localStorage.getItem("transaction_ids");
      const transactionIds = storedTransactionIds
        ? JSON.parse(storedTransactionIds)
        : [];

      if (!transactionId || !transactionIds.length) {
        setError("No transaction reference found.");
        setStatus("error");
        return;
      }

      try {
        const transactionIdsString = transactionIds.join(",");
        const token = localStorage.getItem("access");
        const response = await fetch(
          `${API_URL}/payments/check_payment_status/${transactionId}/?transaction_ids=${transactionIdsString}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch payment details.");
        }

        const data = await response.json();
        const successfulPayments = (data.payments || []).filter(
          (payment) => payment.status === "completed"
        );

        if (successfulPayments.length > 0) {
          setPayments(successfulPayments);
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        setError(err.message);
        setStatus("error");
      } finally {
        localStorage.removeItem("transaction_ids");
      }
    };

    fetchPaymentDetail();
  }, []);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups for this website.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>
          <div id="printable-content">${receiptRef.current.innerHTML}</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  if (status === "loading") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <RowSkeleton count={2} />
      </div>
    );
  }

  if (status === "failed" || status === "error") {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-card p-8 text-center">
          <FiXCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900">
            {status === "failed" ? "Payment not confirmed" : "Something went wrong"}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {status === "failed"
              ? "We couldn't confirm this payment. If you were charged, it should reflect shortly — otherwise please try again."
              : error}
          </p>
          <Link
            to="/"
            className="inline-block mt-6 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
        <div className="text-center mb-6">
          <FiCheckCircle className="text-emerald-500 text-5xl mx-auto mb-3" />
          <h1 className="text-xl font-bold text-slate-900">
            Payment Successful
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Thank you — your order has been confirmed.
          </p>
        </div>

        <div ref={receiptRef} className="bg-slate-50 p-4 sm:p-6 rounded-lg">
          <PrintableReceipt payments={payments} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            to="/user-dashboard/orders"
            className="flex-1 flex items-center justify-center gap-2 border border-slate-200 hover:border-primary-300 hover:text-primary-600 text-slate-700 text-sm font-medium py-2.5 rounded-lg transition"
          >
            <FiHome /> View My Orders
          </Link>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2.5 rounded-lg transition"
          >
            <FiPrinter /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;
