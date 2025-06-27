import { React, useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaHome } from "react-icons/fa"; // Import the home icon

import ShopLogoImg from "../../../../assets/icons/shopLogo/shop_logo.jpg";
const PrintableReceipt = ({ paymentDetail }) => {
  console.log("payment detail in printable component", paymentDetail);
  if (!paymentDetail || paymentDetail.length === 0) {
    return <p>No payment details available.</p>;
  }

  console.log("map started");
  paymentDetail?.map((paymentResponse, index) => {
    const paymentDetail = paymentResponse.payment;
    console.log("payment mapped is  is", index, paymentDetail.order);
  });
  console.log("map finished");

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <img
        src={ShopLogoImg}
        alt="Logo"
        className="w-32 mx-auto mb-4 rounded-full"
      />
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Payment Receipts{" "}
        <span>TransactionId {paymentDetail.transaction_id}</span>
      </h1>
      {paymentDetail?.map((paymentResponse, index) => {
        const paymentDetail = paymentResponse.payment;

        return (
          <div
            key={paymentResponse.payment.transaction_id}
            className="relative overflow-hidden mb-8 p-4 bg-gray-50 rounded-lg shadow-md"
          >
            <div className="absolute inset-0 opacity-30 flex items-center justify-center">
              <span className="text-2xl text-green-300 font-bold">
                Paid with {paymentDetail.payment?.payment_gateway || "N/A"}
              </span>
            </div>

            <h2 className="text-xl font-semibold mt-4 text-gray-800">
              PaymentId ID: {paymentResponse.transaction_id}
            </h2>
            <p className="mt-2 text-gray-700">
              <strong>User:</strong> {paymentDetail.order?.user?.email || "N/A"}
            </p>
            <p className="mt-2 text-gray-700">
              <strong>Amount:</strong> ${paymentDetail?.amount || "0.00"}
            </p>
            <p className="mt-2 text-gray-700">
              <strong>Payment Method:</strong>{" "}
              {paymentDetail.payment_method || "N/A"}
            </p>
            <p className="mt-2 text-gray-700">
              <strong>Payment Gateway:</strong>{" "}
              {paymentDetail.payment_gateway || "N/A"}
            </p>
            <p className="mt-2 text-gray-700">
              <strong>Status:</strong>{" "}
              {paymentDetail.payment_status || paymentResponse.status}
            </p>
            <p className="mt-2 text-gray-700">
              <strong>Date:</strong>{" "}
              {new Date(paymentDetail.created_at).toLocaleString() || "N/A"}
            </p>

            <div className="mt-4 text-center">
              <p className="font-medium text-lg text-blue-600">
                Thank you for your payment!
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const PaymentDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get("txt_ref");
  console.log("transaction id is:", transactionId);

  const [paymentDetail, setPaymentDetail] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef(null); // Reference for the receipt component
  const storedTransactionIds = localStorage.getItem("transaction_ids");
  console.log(
    "stored transaction_ids are  in payment detai is ",
    storedTransactionIds
  );
  useEffect(() => {
    const fetchPaymentDetail = async () => {
      const storedTransactionIds = localStorage.getItem("transaction_ids");
      console.log("transaction_ids are ", storedTransactionIds);
      const transactionIds = storedTransactionIds
        ? JSON.parse(storedTransactionIds)
        : [];

      if (!transactionIds.length) {
        setError("No transaction IDs found.");
        setLoading(false);
        return;
      }

      try {
        const transactionIdsString = transactionIds.join(",");
        const response = await fetch(
          `http://localhost:8000/payments/check_payment_status/${transactionId}/?transaction_ids=${transactionIdsString}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch payment details.");
        }

        const paymentResponses = await response.json();
        console.log("payment responses length", paymentResponses.length);
        if (paymentResponses.payments && paymentResponses.payments.length) {
          const successfulPayments = paymentResponses.payments.filter(
            (payment) => payment.status === "completed"
          );
          if (successfulPayments.length > 0) {
            setPaymentDetail(successfulPayments.map((payment) => payment));
          } else {
            setError("No successful payment details found.");
          }
        } else {
          setError("No payment details found in the response.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
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

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
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
        <div className="flex flex-row gap-x-4 items-center mb-4">
          <Link
            to="/"
            className="flex items-center text-blue-600 hover:underline"
          >
            <FaHome className="mr-1" /> {/* Home Icon */}
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Payment Receipt</h1>
        </div>
        <p className="text-gray-600 mt-2">Thank you for your payment!</p>
      </div>
      <div
        ref={receiptRef}
        className="bg-gray-50 p-6 rounded-lg shadow-lg mt-4"
      >
        <PrintableReceipt paymentDetail={paymentDetail} />
      </div>
      <button
        onClick={handlePrint}
        className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Print Receipt
      </button>
    </div>
  );
};

export default PaymentDetail;
