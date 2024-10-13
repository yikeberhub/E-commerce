import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import OrderComponent from "./dashbord/userDashboard/order/OrderComponent";
import PaypalImg from "../assets/icons/images/paypal_icon.png";
import ChapaImg from "../assets/icons/images/chapa_logo.jpg";
import EditAddress from "./dashbord/userDashboard/address/EditAddress";
import { useAuth } from "../contexts/AuthContext";

const PreviewOrder = ({ updatedOrder }) => {
  const { user } = useAuth();
  console.log("order preview component:", updatedOrder);
  const token = localStorage.getItem("access");

  const handlePayment = async () => {
    try {
      const response = await fetch("http://localhost:8000/payments/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 1000,
          email: user.email,
          order_id: updatedOrder.id,
          first_name: updatedOrder.address.full_name,
          last_name: "misganaw",
          phone_number: "0946472687",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Payment initiated:", data);
        window.location.href = data.data.checkout_url;
      } else {
        console.error("Payment initiation failed:", data);
      }
    } catch (error) {
      console.error("unable to process payment", error);
    }
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Order Preview
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
                <div key={index} className="bg-white rounded-lg p-2">
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
        <div className="bg-gray-100 rounded-lg p-2">
          <p className="font-semibold">Payment Method:</p>
          <p>{updatedOrder.payment_method}</p>
          <p className="font-semibold">Payment Gateway:</p>
          <p>{updatedOrder.payment_gateway}</p>
          {updatedOrder.payment && (
            <>
              <p className="font-semibold">Payment ID:</p>
              <p>{updatedOrder.payment.id}</p>
            </>
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
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [paymentGateway, setPaymentGetway] = useState("chapa");
  const [updatedOrder, setUpdatedOrder] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  console.log("user addresses", user.addresses);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/orders/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch order details.");
      }
      const data = await response.json();
      setOrderDetails(data);
      console.log("Order data found:", data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const updateOrder = async () => {
    console.log("Order ID:", orderId);
    const address = user.addresses.find((address) => address.is_default);
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
            payment_method: paymentMethod,
            payment_gateway: paymentGateway,
            amount: orderDetails.total_price,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update order details.");
      }
      const data = await response.json();
      setUpdatedOrder(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const calculateTotal = (price, quantity) => price * quantity;

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePaymentGatewayChange = (e) => {
    setPaymentGetway(e.target.value);
  };

  if (!orderDetails) return <div>Loading...</div>;

  return (
    <div className="container m-auto mb-28">
      <h1 className="text-2xl font-mono font-bold py-2 mx-2">Checkout</h1>
      <div className="flex flex-row min-w-full">
        <div className="w-3/5 px-2 py-2">
          <EditAddress
            id={user.addresses.find((addr) => addr.is_default).id}
            use={true}
          />

          <div className="mt-10 w-full shadow-md shadow-gray-400 rounded-md text-gray-600 font-serif mb-4">
            <h2 className="text-xl ml-4 py-2 font-mono">
              Select Payment Method
            </h2>
            <div className="flex flex-row gap-2">
              <form className="flex flex-col gap-2 bg-gray-50 rounded-md shadow-red-400 px-2 mx-4 py-2 w-auto">
                {/* Payment Method Radio Buttons */}
                <div>
                  <input
                    type="radio"
                    onChange={handlePaymentMethodChange}
                    value="bank"
                    checked={paymentMethod === "bank"}
                    name="payment_method"
                    className="mx-2"
                  />
                  <label>Direct Bank Transfer</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === "cash"}
                    className="mx-2"
                    onChange={handlePaymentMethodChange}
                    value="cash"
                  />
                  <label>Cash on Delivery</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === "online"}
                    className="mx-2"
                    onChange={handlePaymentMethodChange}
                    value="online"
                  />
                  <label>Online Gateway</label>
                </div>
              </form>
              <div className="bg-gray-50">
                {paymentMethod === "cash" && (
                  <h2 className="text-gray-700">Cash on Delivery</h2>
                )}
                {paymentMethod === "bank" && <div>Using Bank</div>}
                {paymentMethod === "online" && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Choose Payment Gateway
                    </h3>
                    <div className="flex flex-col items-center space-y-2 mb-4">
                      {/* Payment Gateway Radio Buttons */}
                      <div className="flex flex-row items-center space-x-2">
                        <input
                          type="radio"
                          id="chapa"
                          checked={paymentGateway === "chapa"}
                          onChange={handlePaymentGatewayChange}
                          name="payment"
                          value="chapa"
                          className="form-radio text-blue-600 h-5 w-5"
                        />
                        <label htmlFor="chapa" className="text-gray-700">
                          Chapa
                        </label>
                        <img
                          src={ChapaImg}
                          alt="Chapa Logo"
                          className="h-8 rounded-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={paymentGateway === "paypal"}
                          onChange={handlePaymentGatewayChange}
                          id="paypal"
                          name="payment"
                          value="paypal"
                          className="form-radio text-blue-600 h-5 w-5"
                        />
                        <label htmlFor="paypal" className="text-gray-700">
                          PayPal
                        </label>
                        <img
                          src={PaypalImg}
                          alt="PayPal Logo"
                          className="h-8"
                        />
                      </div>
                      <div className="flex flex-row items-center space-x-4 justify-between">
                        <button className="mt-4 mb-4 bg-blue-600 text-white px-4 py-1 rounded hover:bg-green-600">
                          Pay Now
                        </button>
                        <button
                          className="mt-4 mb-4 bg-green-600 text-white px-4 py-1 rounded hover:bg-blue-600"
                          onClick={() => {
                            updateOrder();
                            setShowPreview((prev) => !prev);
                          }}
                        >
                          {showPreview ? (
                            <span>Hide Order</span>
                          ) : (
                            <span>Preview</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-2/5 px-2 border border-gray-200 rounded-md shadow-md shadow-gray-600">
          <div className="flex flex-row items-center justify-between text-gray-600 py-2 px-2 text-lg font-semibold">
            <h1 className="font-mono text-xl text-gray-700">Your Order</h1>
            <p>Total price: {orderDetails.total_price}</p>
          </div>
          <Link to={"/cart/"}>
            <button className="btn-primary">Go Back to Cart</button>
          </Link>
          {orderDetails && !showPreview && (
            <div>
              <OrderComponent
                order={orderDetails}
                calculateTotal={calculateTotal}
              />
            </div>
          )}
          {orderDetails && updatedOrder && showPreview && (
            <div>
              <PreviewOrder updatedOrder={updatedOrder} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
