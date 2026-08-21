import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import { useCart } from "../contexts/cartContext";

const CartItem = ({ cartItem, calculateItemPrice }) => {
  const { removeCartItem, updateCartItem, clearCart } = useCart();
  const [quantity, setNewQuantity] = useState(cartItem.quantity);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    calculateItemPrice();
  }, [quantity, removeCartItem, clearCart, updateCartItem]);

  const subTotal = quantity * cartItem.product.price;

  const increaseQuantity = () => {
    setNewQuantity((prev) => prev + 1);
    setIsUpdated(true);
  };
  const decreaseQuantity = () => {
    setNewQuantity((prev) => (prev > 1 ? prev - 1 : prev));
    setIsUpdated(true);
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 bg-white rounded-xl border border-slate-100 shadow-card p-3">
      <img
        src={cartItem?.product?.image}
        alt={cartItem.product.title}
        className="w-16 h-16 rounded-lg object-cover shrink-0"
      />

      <div className="flex-1 min-w-[140px]">
        <p className="text-sm font-medium text-slate-800 line-clamp-2">
          {cartItem.product.title}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {cartItem.product.price} ETB
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={decreaseQuantity}
          className="w-7 h-7 rounded-full border border-slate-200 text-slate-500 hover:border-primary-300 hover:text-primary-600 flex items-center justify-center transition"
        >
          <FaMinus className="text-[10px]" />
        </button>
        <span className="w-6 text-center text-sm font-medium text-slate-700">
          {quantity}
        </span>
        <button
          type="button"
          onClick={increaseQuantity}
          className="w-7 h-7 rounded-full border border-slate-200 text-slate-500 hover:border-primary-300 hover:text-primary-600 flex items-center justify-center transition"
        >
          <FaPlus className="text-[10px]" />
        </button>
      </div>

      <div className="text-sm font-semibold text-slate-900 w-20 text-right shrink-0">
        {subTotal} ETB
      </div>

      {isUpdated && (
        <button
          type="button"
          onClick={() => {
            updateCartItem(cartItem.id, quantity);
            setIsUpdated(false);
          }}
          className="text-xs font-medium text-primary-600 hover:text-primary-700 shrink-0"
        >
          Update
        </button>
      )}

      <button
        type="button"
        onClick={() => removeCartItem(cartItem.id)}
        title="Remove"
        className="text-slate-400 hover:text-red-500 transition shrink-0"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default CartItem;
