import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import OrderComponent from "./dashbord/userDashboard/order/OrderComponent";
import OrderDetail from "./dashbord/userDashboard/order/OrderDetail";

const Checkout = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const token = localStorage.getItem("access");

  const fetchOrderDetails = async () => {
    console.log("order id", orderId);
    try {
      const response = await fetch(`http://localhost:8000/orders/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Faild to fetch order details.");
      }
      const data = await response.json();
      setOrderDetails(data);
      console.log("data found", data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const calculateTotal = (price, quantity) => price * quantity;

  const handleSetPaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
  };

  if (!orderDetails) return <div>Loading...</div>;

  return (
    <div className="container m-auto mb-28">
      <h1 className="text-2xl font-serif font-bold text-gray-700 py-2">
        Checkout
      </h1>
      <div className=" flex flex-row min-w-full">
        <div className="w-1/2 px-2 py-2">
          <form>
            <input
              type="text"
              className="border border-gray-300 rounded-sm py-2 px-2 placeholder-black"
              placeholder="Enter coupon"
            />
            <h1 className="text-xl my-2 ">Billing Details</h1>
            <div className="flex flex-row gap-2 min-w-full">
              <input
                type="username"
                className="w-1/2 border border-gray-300 rounded-sm py-2 px-2 placeholder-black"
                placeholder="your name."
              />
              <input
                type="phone_numberr"
                className="w-1/2 border border-gray-300 rounded-sm py-2 px-2 placeholder-black"
                placeholder="your phone number."
              />
            </div>
            <input
              type="text"
              name="address"
              className="w-1/2 border border-gray-300 rounded-sm my-2 py-2 px-2 placeholder-black"
              placeholder="Enter your address"
            />
          </form>
          <div className="mt-10 w-full shadow-md shadow-gray-400 rounded-md  text-gray-600  h-52">
            <h2 className="text-xl ml-4 py-2"> Select Payment Method</h2>
            <div className="flex flex-row gap-2">
              <form className="flex flex-col gap-2 bg-gray-50 rounded-md shadow-red-400 px-2 mx-4 py-2 w-auto">
                <div>
                  <input
                    type="radio"
                    onChange={(e) => handleSetPaymentMethod(e)}
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
                    onChange={(e) => handleSetPaymentMethod(e)}
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
                    onChange={(e) => handleSetPaymentMethod(e)}
                    value="online"
                  />
                  <label>Online Gateway</label>
                </div>
              </form>
              <div className="bg-gray-50">
                {paymentMethod === "cash" && (
                  <div>
                    <h2 className="text-gray-700">cash in delivery</h2>
                  </div>
                )}
                {paymentMethod === "bank" && (
                  <div>
                    <h2 className="text-gray-700">Bank transfer</h2>
                  </div>
                )}
                {paymentMethod === "online" && (
                  <div>
                    <h2 className="text-gray-700">Online Gateway</h2>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2  px-2 border border-gray-200 rounded-md shadow-md shadow-gray-600">
          <div className="flex flex-row items-center justify-between text-gray-600 py-2 px-2 text-lg font-semibold">
            <h1>Your Order</h1>
            <p>Total price:{orderDetails.total_price}</p>
          </div>
          <Link to={"/cart/"}>
            <button className="bg-green-500 py-2 px-2 text-white rounded-md ">
              Go Back to Cart
            </button>
          </Link>
          {orderDetails && (
            <div>
              <OrderComponent
                order={orderDetails}
                calculateTotal={calculateTotal}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
