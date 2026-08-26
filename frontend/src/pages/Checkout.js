import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiTruck, FiCreditCard, FiCheckCircle } from "react-icons/fi";
import OrderComponent from "./dashbord/userDashboard/order/OrderComponent";
import ChapaImg from "../assets/icons/images/chapa_logo.jpg";
import EditAddress from "./dashbord/userDashboard/address/EditAddress";
import { useAuth } from "../contexts/AuthContext";
import { RowSkeleton } from "../common/Skeleton";
import EmptyState from "../common/EmptyState";

const API_URL = process.env.REACT_APP_API_URL;

const PaymentOption = ({ active, onClick, icon, title, description }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-start gap-3 text-left border rounded-xl p-3.5 transition ${
      active
        ? "border-primary-500 bg-primary-50/50 ring-1 ring-primary-500"
        : "border-slate-200 hover:border-primary-200"
    }`}
  >
    <span
      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
        active ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-500"
      }`}
    >
      {icon}
    </span>
    <span>
      <span className="block text-sm font-medium text-slate-800">
        {title}
      </span>
      <span className="block text-xs text-slate-500 mt-0.5">
        {description}
      </span>
    </span>
  </button>
);

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();

  const orderIdsParam = searchParams.get("order_ids");
  const orderIdParam = searchParams.get("order_id");
  const orderIds = orderIdsParam
    ? orderIdsParam.split(",").filter(Boolean)
    : orderIdParam
    ? [orderIdParam]
    : [];

  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!user || !orderIds.length) {
      setLoading(false);
      return;
    }
    fetchOrderDetails();
  }, [user]);

  const fetchOrderDetails = async () => {
    try {
      const fetchedOrders = await Promise.all(
        orderIds.map(async (orderId) => {
          const response = await fetch(`${API_URL}/orders/${orderId}/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) throw new Error("Failed to fetch order details.");
          return await response.json();
        })
      );
      setOrderDetails(fetchedOrders);
    } catch (error) {
      setPlaceError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyAddressToOrder = async (orderId, addressId) => {
    const response = await fetch(`${API_URL}/orders/${orderId}/update/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address_id: addressId }),
    });
    if (!response.ok) throw new Error("Failed to set the shipping address.");
    return response.json();
  };

  const initiatePayment = async () => {
    let totalAmount = 0;
    const transactionIds = [];

    for (const order of orderDetails) {
      const orderTotalPrice = parseFloat(order.total_price);
      if (isNaN(orderTotalPrice) || !order.payment) continue;
      totalAmount += orderTotalPrice;
      transactionIds.push(order.payment.transaction_id);
    }

    if (!transactionIds.length) {
      throw new Error("No payable orders found.");
    }

    const defaultAddress =
      user.addresses?.find((addr) => addr.is_default) || user.addresses?.[0];

    // Registration never collects first/last name, so user.first_name is
    // empty for most accounts — Chapa requires one, so fall back to the
    // shipping address's full name (always required), then the username.
    const [addressFirstName, ...addressRest] = (defaultAddress?.full_name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const paymentData = {
      total_amount: totalAmount,
      first_name: user.first_name || addressFirstName || user.username,
      last_name: user.last_name || addressRest.join(" "),
      email: user.email,
      phone_number: defaultAddress?.phone_number,
    };

    const response = await fetch(`${API_URL}/payments/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) throw new Error("Failed to initiate payment.");
    const paymentResponse = await response.json();

    if (paymentResponse.data?.checkout_url) {
      localStorage.setItem("transaction_ids", JSON.stringify(transactionIds));
      window.location.href = paymentResponse.data.checkout_url;
    } else {
      throw new Error("Checkout URL not found in payment response.");
    }
  };

  const handlePlaceOrder = async () => {
    setPlaceError("");

    if (!user.addresses?.length) {
      setPlaceError("Please add a shipping address before placing your order.");
      return;
    }

    const defaultAddress =
      user.addresses.find((addr) => addr.is_default) || user.addresses[0];

    setPlacing(true);
    try {
      await Promise.all(
        orderDetails.map((order) =>
          applyAddressToOrder(order.id, defaultAddress.id)
        )
      );

      if (paymentMethod === "cash") {
        setOrderConfirmed(true);
      } else {
        await initiatePayment();
      }
    } catch (error) {
      setPlaceError(error.message);
    } finally {
      setPlacing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-4">
        <RowSkeleton count={3} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          title="Please log in to check out"
          description="Sign in to view and complete your order."
          action={
            <Link
              to="/login"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Log in
            </Link>
          }
        />
      </div>
    );
  }

  if (!orderIds.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          title="Nothing to check out"
          description="Add items to your cart and proceed to checkout to see your order summary here."
          action={
            <Link
              to="/products"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Browse products
            </Link>
          }
        />
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <FiCheckCircle className="text-emerald-500 text-5xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">Order placed!</h1>
        <p className="text-slate-500 mt-2">
          Pay with cash when your order is delivered. You can track its
          status from your account.
        </p>
        <Link
          to="/user-dashboard/orders"
          className="inline-block mt-6 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
        >
          View my orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column */}
        <div className="w-full lg:w-2/5 flex flex-col gap-4">
          {user.addresses?.length ? (
            <EditAddress
              id={(user.addresses.find((a) => a.is_default) || user.addresses[0]).id}
              use
            />
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <p className="text-sm text-slate-600 mb-3">
                You don't have a saved address yet. Add one to continue.
              </p>
              <EditAddress create setOpenedCreateAddress={() => {}} />
            </div>
          )}

          <div className="bg-white rounded-xl shadow-card p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Payment Method
            </h2>
            <div className="flex flex-col gap-2">
              <PaymentOption
                active={paymentMethod === "online"}
                onClick={() => setPaymentMethod("online")}
                icon={<img src={ChapaImg} alt="" className="w-5 h-5 rounded-sm object-cover" />}
                title="Pay Online (Chapa)"
                description="Telebirr, CBE and other Chapa-supported methods."
              />
              <PaymentOption
                active={paymentMethod === "cash"}
                onClick={() => setPaymentMethod("cash")}
                icon={<FiTruck />}
                title="Cash on Delivery"
                description="Pay in cash when your order arrives."
              />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-3/5 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-card p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Your Order
            </h2>
            <div className="flex flex-col gap-5">
              {orderDetails.map((order) => (
                <div key={order.id}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-600">
                      From{" "}
                      <span className="text-primary-600 font-medium">
                        {order?.vendor?.title}
                      </span>
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {order.total_price} ETB
                    </p>
                  </div>
                  <OrderComponent order={order} />
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-100">
              <span className="text-sm font-semibold text-slate-800">
                Total
              </span>
              <span className="text-lg font-bold text-primary-600">
                {orderDetails
                  .reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0)
                  .toLocaleString()}{" "}
                ETB
              </span>
            </div>
          </div>

          {placeError && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
              {placeError}
            </p>
          )}

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={placing}
            className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-60"
          >
            <FiCreditCard />
            {placing
              ? "Placing order..."
              : paymentMethod === "cash"
              ? "Place Order"
              : "Place Order & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
