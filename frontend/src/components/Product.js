import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/cartContext";
import { useWishlist } from "../contexts/WishlistContext";
import AddWishlistIcon from "../assets/icons/images/wishlist_gold.png";
import RemoveWishlistIcon from "../assets/icons/images/wishlist_purple.png";
import AddCartIcon from "../assets/icons/images/cart.png";
import RemoveCartIcon from "../assets/icons/images/cart_black_white.png";

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

  product = { ...product, get_percentage: 20 };

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
    <div className="sm:col-span-2 flex flex-col items-center border border-gray-200 rounded-lg shadow-md transition-transform hover:scale-105 duration-300 w-full p-4">
      <div className="relative w-full">
        <span className="absolute top-2 left-2 bg-red-500 text-white rounded-full px-2 py-1 text-sm shadow-md">
          {`-${product.get_percentage}% off!`}
        </span>
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            className="w-full h-64 rounded-md object-cover transition-transform duration-200 hover:scale-105"
            alt={product.title}
          />
          <p className="text-gray-700 text-lg font-semibold mt-2">
            {product?.category?.title}
          </p>
          <p className="text-blue-800 text-sm font-medium">{product?.title}</p>
          <p className="text-gray-600 text-xs">{product?.specifications}</p>
        </Link>
        <p className="text-yellow-500 text-sm mt-1">
          Rating✨✨✨ ({product.rating})
        </p>
        <p className="text-gray-700 text-sm">{product.vendor.title}</p>
        <div className="flex flex-row justify-between items-center border border-gray-300 rounded-md p-2 my-2 shadow-sm">
          <span className="text-lg font-bold text-green-600">
            ${product.price}
          </span>
          <span className="cursor-pointer" onClick={handleAddToCart}>
            <img
              src={addedToCart ? RemoveCartIcon : AddCartIcon}
              alt={addedToCart ? "Remove from Cart" : "Add to Cart"}
              className="w-6 h-6 rounded transition duration-200 hover:opacity-80"
            />
          </span>
          <span className="cursor-pointer" onClick={handleAddToWishlist}>
            <img
              src={addedToWishlist ? RemoveWishlistIcon : AddWishlistIcon}
              alt={addedToWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              className="w-6 h-6 rounded-full transition duration-200 hover:opacity-80"
            />
          </span>
        </div>
        <span className="text-gray-500 line-through text-sm">
          ${product.old_price}
        </span>
      </div>
    </div>
  );
};

export default Product;
