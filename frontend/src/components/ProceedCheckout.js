import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ProceedCheckout = ({ itemsTotalPrice, shipingPrice, cart }) => {
  const navigate = useNavigate();
  const totalPrice = itemsTotalPrice + shipingPrice;
  const token = localStorage.getItem("access");
  console.log("token", token);

  const handleCheckout = async () => {
    try {
      const response = await fetch("http://localhost:8000/orders/checkout/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ total_price: totalPrice }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok!");
      }
      const data = await response.json();
      console.log("checkout successfull!", data.order_id);
      navigate(`/checkout/${data.order_id}`);
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  };

  return (
    <div className="container-sm mx-auto pt-2 ">
      <div className="rounded-md border border-gray-100 h-auto px-10 mx-5 my-3 py-5 pt-3 font-snas font-semibold shadow-lg">
        <div className="border border-gray-300 rounded-t  py-2 px-4 flex flex-row justify-between">
          <span className="">Subtotal</span>
          <span>${itemsTotalPrice}</span>
        </div>
        <div className="border border-gray-300   py-2 px-4 flex flex-row justify-between">
          <span className="">Shiping</span>
          {shipingPrice === 0 ? (
            <span>free</span>
          ) : (
            <span>$ {shipingPrice}</span>
          )}
        </div>
        <div className="border border-gray-300 rounded-b shadow-lg py-2 px-4 flex flex-row justify-between">
          <span className="">Total</span>
          <span>${totalPrice}</span>
        </div>
        <div>
          <button
            className="bg-green-500 mt-2 w-full py-1 rounded text-white"
            onClick={handleCheckout}
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProceedCheckout;
