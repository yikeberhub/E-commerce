import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiCheck, FiHeart } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import { useCart } from "../contexts/cartContext";
import { useWishlist } from "../contexts/WishlistContext";

const StarRating = ({ rating = 0, count = 0 }) => (
  <div className="flex items-center gap-1 mt-1">
    <div className="flex text-amber-400 text-xs gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={i < Math.round(rating) ? "text-amber-400" : "text-slate-200"}
        />
      ))}
    </div>
    <span className="text-xs text-slate-400">({count})</span>
  </div>
);

const Product = ({ product }) => {
  const { newItem, checkItemInCart, addCartItem, removeCartItem } = useCart();
  const {
    addWishlistItem,
    removeWishlistItem,
    checkItemInWishlist,
    newWishlistItem,
  } = useWishlist();

  const addedToCart = checkItemInCart(product.id)["isAdded"];
  const addedToWishlist = checkItemInWishlist(product.id)["isAdded"];

  const handleAddToCart = () => {
    const checkedResult = checkItemInCart(product.id);
    if (!checkedResult["isAdded"]) {
      addCartItem(product.id, newItem.quantity);
    } else {
      removeCartItem(checkedResult["item"].id);
    }
  };

  const handleAddToWishlist = () => {
    const checkedResult = checkItemInWishlist(product.id);
    if (!checkedResult["isAdded"]) {
      addWishlistItem(product.id, newWishlistItem.quantity);
    } else {
      removeWishlistItem(checkedResult["item"].id);
    }
  };

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-soft hover:border-primary-100 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        {!!product.discount_percentage && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-rose-600 text-white rounded-md px-2 py-0.5 text-[11px] font-bold shadow-sm tracking-wide">
            -{product.discount_percentage.toFixed(0)}%
          </span>
        )}

        <button
          type="button"
          onClick={handleAddToWishlist}
          title={addedToWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
        >
          {addedToWishlist ? (
            <FaHeart className="text-rose-500 text-sm" />
          ) : (
            <FiHeart className="text-slate-500 text-sm" />
          )}
        </button>

        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt={product.title}
          />
        </Link>

        <button
          type="button"
          onClick={handleAddToCart}
          title={addedToCart ? "Remove from Cart" : "Add to Cart"}
          className={`absolute bottom-2.5 right-2.5 z-10 w-10 h-10 rounded-full shadow-md flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ${
            addedToCart
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-primary-600 hover:bg-primary-700"
          } text-white`}
        >
          {addedToCart ? (
            <FiCheck className="text-lg" />
          ) : (
            <FiShoppingBag className="text-base" />
          )}
        </button>
      </div>

      <Link
        to={`/product/${product.id}`}
        className="flex flex-col flex-1 p-3.5"
      >
        <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
          {product?.category?.title}
        </p>
        <p className="text-sm font-medium text-slate-800 mt-1 line-clamp-2 min-h-[2.5rem] group-hover:text-primary-700 transition-colors">
          {product?.title}
        </p>
        <StarRating
          rating={product.average_rating}
          count={product.number_of_reviews}
        />

        <div className="mt-auto pt-2.5 flex items-baseline gap-2">
          <span className="text-base font-bold text-slate-900">
            {Number(product.price).toLocaleString()} ETB
          </span>
          {product.old_price > product.price && (
            <span className="text-xs text-slate-400 line-through">
              {Number(product.old_price).toLocaleString()} ETB
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Product;
