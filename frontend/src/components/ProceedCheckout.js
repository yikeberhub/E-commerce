import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ProceedCheckout = ({ itemsTotalPrice, shipingPrice, cart }) => {
  const navigate = useNavigate();
  const totalPrice = itemsTotalPrice + shipingPrice;
  const token = localStorage.getItem("access");

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
      console.log("checkout successfull!", data.id);
      navigate(`/checkout/${data.id}`);
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  };

  return (
    <div className="container-sm mx-auto pt-2 ">
      <div className="rounded-md border bg-gray-10 border-blue-200 shadow-gray shadow-sm h-auto px-4 w-auto mx-4 my-3 py-5 pt-3 font-snas font-semibold ">
        <div className="w-full px-auto mx-auto">
          <div className="border border-gray rounded-t  py-2 px-4 flex flex-row  justify-between">
            <span className="text-gray_lighter">Subtotal</span>
            <span className="text-green-400">${itemsTotalPrice}.00</span>
          </div>
          <div className="border border-gray   py-2 px-4 flex flex-row justify-between">
            <span className="text-gray_lighter">Shiping</span>
            {shipingPrice === 0 ? (
              <span className="text-purple-500">free</span>
            ) : (
              <span className="text-yellow">$ {shipingPrice}</span>
            )}
          </div>
          <div className="border border-gray rounded-b shadow-lg py-2 px-4 flex flex-row justify-between">
            <span className="">Total</span>
            <span className="text-blue-700">${totalPrice}.00</span>
          </div>
          <div className="w-auto">
            <button
              className="bg-blue-500 mt-2 w-full py-1 rounded text-white hover:bg-blue-700"
              onClick={handleCheckout}
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProceedCheckout;
