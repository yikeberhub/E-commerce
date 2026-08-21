import React from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const ProceedCheckout = ({ itemsTotalPrice, shipingPrice, cart }) => {
  const navigate = useNavigate();
  const totalPrice = itemsTotalPrice + shipingPrice;
  const token = localStorage.getItem("access");

  const handleCheckout = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/checkout/`, {
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
      navigate(`/checkout/summary?order_ids=${data.order_ids.join(",")}`);
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-5 sticky top-4">
      <h2 className="text-sm font-semibold text-slate-800 mb-3 pb-2 border-b border-slate-100">
        Order Summary
      </h2>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Subtotal</span>
          <span className="text-slate-800 font-medium">
            {itemsTotalPrice} ETB
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Shipping</span>
          {shipingPrice === 0 ? (
            <span className="text-emerald-600 font-medium">Free</span>
          ) : (
            <span className="text-slate-800 font-medium">
              {shipingPrice} ETB
            </span>
          )}
        </div>
        <div className="flex justify-between pt-2 mt-1 border-t border-slate-100 text-base">
          <span className="font-semibold text-slate-800">Total</span>
          <span className="font-bold text-primary-600">
            {totalPrice} ETB
          </span>
        </div>
      </div>
      <button
        className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleCheckout}
        disabled={!cart?.items?.length}
      >
        Proceed to checkout
      </button>
    </div>
  );
};

export default ProceedCheckout;
