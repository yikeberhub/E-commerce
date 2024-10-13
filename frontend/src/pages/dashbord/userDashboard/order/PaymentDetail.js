import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import ShopLogoImg from "../../../../assets/icons/shopLogo/shop_logo.jpg";

const PaymentDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get("trx_ref");

  const [paymentDetail, setPaymentDetail] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetail = async () => {
      if (!transactionId) {
        setError("Transaction ID is required.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/payments/check_payment_status?transaction_id=${transactionId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch payment details.");
        }

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setPaymentDetail(data.payment);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetail();
  }, [transactionId]);

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
        <style>
          body { font-family: Arial, sans-serif; }
          .receipt { max-width: 600px; margin: auto; padding: 20px; }
          h1, h2, p { margin: 5px 0; }
          .footer { margin-top: 20px; text-align: center; }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        <div class="receipt">
          <img src="${ShopLogoImg}" alt="Logo" style="width: 128px; margin-bottom: 20px;" />
          <h1>Payment Receipt</h1>
          <h2>Transaction ID: ${paymentDetail.transaction_id}</h2>
          <p><strong>User:</strong> ${
            paymentDetail.order?.user.username || "N/A"
          }</p>
          <p><strong>Amount:</strong> $${
            paymentDetail.order?.total_price || "0.00"
          }</p>
          <p><strong>Payment Method:</strong> ${
            paymentDetail.order?.payment_method
          }</p>
          <p><strong>Payment Gateway:</strong> ${
            paymentDetail.order?.payment_gateway
          }</p>
          <p><strong>Status:</strong> ${
            paymentDetail.payment_status || "N/A"
          }</p>
          <p><strong>Date:</strong> ${
            new Date(paymentDetail.created_at).toLocaleString() || "N/A"
          }</p>
          <div class="footer">
            <p>Thank you for your payment!</p>
          </div>
        </div>
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-10">{error}</div>;
  }

  if (!paymentDetail) {
    return (
      <div className="text-red-600 text-center py-10">
        No payment details found.
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-xl relative border border-gray-200">
      <div className="text-center mb-6">
        <img
          src={ShopLogoImg}
          alt="Logo"
          className="mx-auto mb-4 w-32 rounded-full shadow-md"
        />
        <h1 className="text-3xl font-bold text-gray-800">Payment Receipt</h1>
        <p className="text-gray-600 mt-2">Thank you for your payment!</p>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <span className="text-6xl font-bold text-gray-300">PAID</span>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg mt-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Transaction ID:{" "}
          <span className="text-blue-600">{paymentDetail.transaction_id}</span>
        </h2>
        <p className="mt-2">
          <strong>User:</strong> {paymentDetail.order?.user.username || "N/A"}
        </p>
        <p className="mt-2">
          <strong>Amount:</strong>{" "}
          <span className="text-green-600">
            ${paymentDetail.order?.total_price || "0.00"}
          </span>
        </p>
        <p className="mt-2">
          <strong>Payment Method:</strong> {paymentDetail.order?.payment_method}
        </p>
        <p className="mt-2">
          <strong>Payment Gateway:</strong>{" "}
          {paymentDetail.order?.payment_gateway}
        </p>
        <p className="mt-2">
          <strong>Status:</strong>{" "}
          <span className="text-yellow-600">
            {paymentDetail.payment_status || "N/A"}
          </span>
        </p>
        <p className="mt-2">
          <strong>Date:</strong>{" "}
          {new Date(paymentDetail.created_at).toLocaleString() || "N/A"}
        </p>
      </div>
      <button
        onClick={() => handlePrint}
        className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Print Receipt
      </button>
    </div>
  );
};

export default PaymentDetail;
