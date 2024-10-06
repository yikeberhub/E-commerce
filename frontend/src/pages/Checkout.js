import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Checkout = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

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

  return (
    <div className="container m-1 p-2 ">
      <div>
        <p>checkout page</p>
        <h2>Order Details</h2>
        {orderDetails && (
          <div>
            <p>Order Id:{orderDetails.id}</p>
            <p>Total price:{orderDetails.total_price}</p>
            <h3>Items</h3>
            <ul>
              {orderDetails.items.map((item) => (
                <li key={item.product.id}>
                  {item.product.title}(Quantity:{item.quantity})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
