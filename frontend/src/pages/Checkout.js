import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import OrderComponent from "./dashbord/userDashboard/order/OrderComponent";
import PaypalImg from "../assets/icons/images/paypal_icon.png";
import ChapaImg from "../assets/icons/images/chapa_logo.jpg";
import EditAddress from "./dashbord/userDashboard/address/EditAddress";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../common/Spinner";

import { processPayment } from "../api/payment";
import { updateOrderStatus } from "../api/orders";
import { updateVendorPayment } from "../api/vendors";
import { generateReceipt } from "../api/receipts";

const PreviewOrder = ({
  updatedOrder,
  paymentGateway,
  paymentMethod,
  handlePayment,
  onClose,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  console.log("order preview component:", updatedOrder);
  const token = localStorage.getItem("access");

  // if (loading) return <Spinner />;
  if (!updatedOrder) return <div>loading</div>;
  return (
    <div className=" absolute w-full r-4 t-6 bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Order Preview{" "}
        <sapn
          className="hover:cursor-pointer hover:bg-white bg-gray-200 rounded-full"
          onClick={() => onClose(false)}
        >
          ❌
        </sapn>
      </h2>

      <div className="overflow-auto mb-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200 border-b">
              <th className="text-left py-2 px-3 text-gray-700 font-semibold">
                Field
              </th>
              <th className="text-left py-2 px-3 text-gray-700 font-semibold">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Order ID", value: updatedOrder.id },
              { label: "Status", value: updatedOrder.status },
              {
                label: "Total Price",
                value: `$${updatedOrder.total_price}`,
              },
              {
                label: "Created At",
                value: new Date(updatedOrder.created_at).toLocaleDateString(),
              },
              {
                label: "Last Updated",
                value: new Date(updatedOrder.updated_at).toLocaleDateString(),
              },
            ].map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3 font-semibold">{row.label}</td>
                <td className="py-2 px-3">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          Customer Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { label: "Full Name", value: updatedOrder.address.full_name },
            { label: "Phone", value: updatedOrder.address.phone_number },
            { label: "Email", value: updatedOrder.user.email },
          ].map((info, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-2">
              <p className="font-semibold text-sm text-gray-600">
                {info.label}:
              </p>
              <p className="text-sm">{info.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          Shipping Address
        </h3>
        <div className="bg-gray-100 rounded-lg p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { label: "Kebele", value: updatedOrder.address.kebele },
              { label: "City", value: updatedOrder.address.city },
              { label: "Region", value: updatedOrder.address.region },
              { label: "Kebele", value: updatedOrder.address.kebele },
              updatedOrder.address.postal_code && {
                label: "Postal Code",
                value: updatedOrder.address.postal_code,
              },
              updatedOrder.address.delivery_instruction && {
                label: "Delivery Instructions",
                value: updatedOrder.address.delivery_instruction,
              },
            ]
              .filter(Boolean)
              .map((address, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-2 grid grid-cols-3"
                >
                  <p className="font-semibold text-sm text-gray-600">
                    {address.label}:
                  </p>
                  <p className="text-sm">{address.value}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          Payment Info
        </h3>
        <div className="bg-gray-100 rounded-lg p-2 flex flex-col space-y-2">
          <div className="flex justify-between">
            <p className="font-semibold">Payment Method:</p>
            <p>{paymentMethod}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold">Payment Gateway:</p>
            <p>{paymentGateway}</p>
          </div>
          {updatedOrder.payment && (
            <div className="flex justify-between">
              <p className="font-semibold">Payment ID:</p>
              <p>{updatedOrder.payment.transaction_id}</p>
            </div>
          )}
        </div>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 mt-4 w-full transition duration-300"
        onClick={() => {
          handlePayment();
        }}
      >
        Confirm Payment
      </button>
    </div>
  );
};

const Checkout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { orderIds } = location.state || {};
  const [orderDetails, setOrderDetails] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [paymentGateway, setPaymentGateway] = useState("chapa");
  const [updatedOrders, setUpdatedOrders] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchOrderDetails();
  }, [orderIds]);

  const handlePayment = async () => {
    if (orderDetails) {
      initiatePayment();
    }
  };
  const initiatePayment = async () => {
    if (!orderDetails.length) {
      console.error("No order details available for payment initiation.");
      return;
    }

    let totalAmount = 0;
    const transactionIds = [];

    orderDetails.forEach((order) => {
      if (order && order.total_price) {
        totalAmount += order.total_price;
        transactionIds.push(order.payment.transaction_id);
      } else {
        console.error(`Order ID ${order.id} is missing total_price`);
      }
    });

    const paymentData = {
      total_amount: totalAmount,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.addresses[0]["phone_number"],
    };
    console.log("payment data", paymentData);

    try {
      const response = await fetch("http://localhost:8000/payments/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) throw new Error("Failed to initiate payment.");

      const paymentResponse = await response.json();
      console.log("Payment initiated successfully:", paymentResponse);

      // Make sure to check if the response contains the checkout_url
      if (paymentResponse.data && paymentResponse.data.checkout_url) {
        localStorage.setItem("transaction_ids", JSON.stringify(transactionIds));

        window.location.href = paymentResponse.data.checkout_url;
      } else {
        console.error("Checkout URL not found in payment response.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error.message);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const fetchedOrders = await Promise.all(
        orderIds.map(async (orderId) => {
          const response = await fetch(
            `http://localhost:8000/orders/${orderId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch order details.");
          return await response.json();
        })
      );
      setOrderDetails(fetchedOrders);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const updateOrder = async (orderId) => {
    const address = user.addresses.find((addr) => addr.is_default);
    try {
      const response = await fetch(
        `http://localhost:8000/orders/${orderId}/update/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address_id: address.id,
            amount: orderDetails.find((order) => order.id === orderId)
              .total_price,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update order details.");
      const data = await response.json();
      setUpdatedOrders((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handlePreviewClick = async (orderId) => {
    await updateOrder(orderId);
    await setSelectedOrderId(orderId);
    setShowPreview(true);
  };

  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);
  const handlePaymentGatewayChange = (e) => setPaymentGateway(e.target.value);

  const handleCheckout = async () => {
    const orderIds = orderDetails.map((order) => order.id);
    const totalAmount = orderDetails.reduce(
      (sum, order) => sum + order.total_price,
      0
    );

    try {
      const paymentResponse = await processPayment(totalAmount);

      if (paymentResponse.success) {
        await Promise.all(
          orderDetails.map((order) =>
            updateOrderStatus(order.id, "paid", paymentResponse.transaction_id)
          )
        );
        await Promise.all(
          orderDetails.map((order) =>
            updateVendorPayment(order.vendor.id, order.total_price)
          )
        );
        orderDetails.forEach((order) =>
          generateReceipt(
            order.id,
            order.vendor.id,
            paymentResponse.transaction_id
          )
        );

        alert(
          "Payment successful! Receipts have been generated for each vendor."
        );
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  if (!orderDetails.length) return <Spinner />;

  return (
    <div className="flex flex-col lg:flex-row m-auto mb-28 space-y-4 lg:space-y-0 lg:space-x-8">
      {/* Left Column */}
      <div className="w-full lg:w-2/5 px-4 py-4">
        <EditAddress
          id={user.addresses.find((addr) => addr.is_default).id}
          use={true}
        />

        <div className="mt-10 shadow-md rounded-md text-gray-600 font-serif">
          <h2 className="text-xl py-2 font-mono ml-4">Select Payment Method</h2>
          <div className="flex flex-row space-x-4 bg-gray-50 px-4 py-4 rounded-md">
            <form className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  onChange={handlePaymentMethodChange}
                  value="cash"
                  checked={paymentMethod === "cash"}
                  name="payment_method"
                  className="mr-2"
                />
                Cash on Delivery
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  onChange={handlePaymentMethodChange}
                  value="online"
                  checked={paymentMethod === "online"}
                  name="payment_method"
                  className="mr-2"
                />
                Online Gateway
              </label>
            </form>

            {paymentMethod === "online" && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">
                  Choose Payment Gateway
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="chapa"
                      checked={paymentGateway === "chapa"}
                      onChange={handlePaymentGatewayChange}
                      name="payment"
                      value="chapa"
                      className="form-radio text-blue-600 h-5 w-5"
                    />
                    <span>Chapa</span>
                    <img
                      src={ChapaImg}
                      alt="Chapa Logo"
                      className="h-8 rounded-sm"
                    />
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="paypal"
                      checked={paymentGateway === "paypal"}
                      onChange={handlePaymentGatewayChange}
                      name="payment"
                      value="paypal"
                      className="form-radio text-blue-600 h-5 w-5"
                    />
                    <span>PayPal</span>
                    <img src={PaypalImg} alt="PayPal Logo" className="h-8" />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col w-full lg:w-3/5 px-4 border border-gray-200 rounded-md shadow-md">
        <h1 className="font-mono text-xl text-gray-700 mb-4">
          Your Orders from
        </h1>
        {orderDetails.map((order) => (
          <div key={order.id} className="mb-4">
            <h2 className="text-gray-700 text-lg">
              <span>Order ID: {order.id} from </span>
              <span className="text-blue-500">{order?.vendor?.title}</span>
            </h2>
            <p className="text-gray-600">Total price: {order.total_price}</p>
            <OrderComponent order={order} />
            <button
              className="text-blue-500 underline"
              onClick={() => {
                handlePreviewClick(order.id);
              }}
            >
              {showPreview && selectedOrderId === order.id
                ? "Hide Order"
                : "Preview Order"}
            </button>
          </div>
        ))}

        {showPreview && selectedOrderId && (
          <PreviewOrder
            updatedOrder={
              updatedOrders.find(
                (updOrder) => updOrder.id === selectedOrderId
              ) || orderDetails.find((order) => order.id === selectedOrderId)
            }
            onClose={setShowPreview}
            handlePayment={handlePayment}
            paymentGateway={paymentGateway}
            paymentMethod={paymentMethod}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;
