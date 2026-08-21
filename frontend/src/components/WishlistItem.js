import React from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { FiShoppingBag, FiCheck } from "react-icons/fi";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/cartContext";

function WishlistItem({ wishlistItem }) {
  const { removeWishlistItem } = useWishlist();
  const { checkItemInCart } = useCart();
  const { newItem, addCartItem, removeCartItem } = useCart();

  const addedToCart = checkItemInCart(wishlistItem.product.id)["isAdded"];

  const handleAddToCart = () => {
    const checkedResult = checkItemInCart(wishlistItem.product.id);
    if (!checkedResult["isAdded"]) {
      addCartItem(wishlistItem.product.id, newItem.quantity);
    } else {
      removeCartItem(checkedResult["item"].id);
    }
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 bg-white rounded-xl border border-slate-100 shadow-card p-3">
      <Link to={`/product/${wishlistItem.product.id}`} className="shrink-0">
        <img
          src={wishlistItem.product.image}
          alt={wishlistItem.product.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
      </Link>

      <div className="flex-1 min-w-[140px]">
        <Link to={`/product/${wishlistItem.product.id}`}>
          <p className="text-sm font-medium text-slate-800 line-clamp-2 hover:text-primary-600 transition">
            {wishlistItem.product.title}
          </p>
        </Link>
        <p className="text-xs text-slate-500 mt-0.5">
          {wishlistItem.product.price} ETB
        </p>
      </div>

      <span
        className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
          wishlistItem.product.stock_quantity > 0
            ? "bg-emerald-50 text-emerald-600"
            : "bg-red-50 text-red-500"
        }`}
      >
        {wishlistItem.product.stock_quantity > 0
          ? "In stock"
          : "Out of stock"}
      </span>

      <button
        type="button"
        onClick={handleAddToCart}
        className={`flex items-center gap-1.5 text-xs font-medium border rounded-lg px-3 py-1.5 transition shrink-0 ${
          addedToCart
            ? "border-emerald-200 text-emerald-600 hover:border-emerald-300"
            : "border-slate-200 hover:border-primary-300 hover:text-primary-600"
        }`}
      >
        {addedToCart ? (
          <FiCheck className="text-sm" />
        ) : (
          <FiShoppingBag className="text-sm" />
        )}
        {!addedToCart ? "Add to cart" : "In cart"}
      </button>

      <button
        type="button"
        onClick={() => removeWishlistItem(wishlistItem.id)}
        title="Remove from wishlist"
        className="text-slate-400 hover:text-red-500 transition shrink-0"
      >
        <FaTimes />
      </button>
    </div>
  );
}

export default WishlistItem;
