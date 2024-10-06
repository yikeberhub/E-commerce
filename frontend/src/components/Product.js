import React, { useEffect, useState } from "react";
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
    <div className="sm:col-span-2 flex flex-col items-center px-0 border-green-300 rounded py-2 shadow-md w-full">
      <div className="border rounded-lg border-gray-200">
        <span className="bg-red-500 rounded-tl-md rounded-br-md px-2 py-1 shadow-md">
          {`-${product.get_percentage}% off!`}
        </span>
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            className="w-auto h-64 rounded-md mt-2 hover:w-full hover:h-72"
            alt="logo"
          />
          <p className="text-[#3e3e3f] text-lg">{product?.category?.title}</p>
          <p className="text-[#4d2d96] text-sm">{product?.title}</p>
          <p className="text-[#4d2d96] text-sm">{product?.specifications}</p>
        </Link>
        <p className="text-[#bb7cc0e9] text-sm">
          Rating✨✨✨ ({product.rating})
        </p>
        <p className="text-[#313432]">{product.vendor.title}</p>
        <div>
          <div className="flex flex-row justify-between items center border border-gray-200 px-2 py-2 my-2 rounded shadow-md font-bold">
            <span>${product.price}</span>
            <p className="border-gray-400 shadow-sm rounded px-0.5 hover:cursor-pointer">
              <span onClick={handleAddToCart}>
                {" "}
                {!addedToCart ? (
                  <span>
                    <img
                      src={AddCartIcon}
                      alt="add_cart"
                      className="w-6 h-6 rounded"
                    />
                  </span>
                ) : (
                  <span>
                    <img
                      src={RemoveCartIcon}
                      alt="rmv_cart_icon"
                      className="w-6 h-6 rounded"
                    />
                  </span>
                )}{" "}
              </span>
            </p>
            <p className="hover:cursor-pointer">
              <span onClick={handleAddToWishlist}>
                {" "}
                {!addedToWishlist ? (
                  <span>
                    <img
                      src={AddWishlistIcon}
                      className="w-6 h-6 rounded-full "
                      alt="add_wish_img"
                    />
                  </span>
                ) : (
                  <span>
                    {" "}
                    <img
                      src={RemoveWishlistIcon}
                      className="w-6 h-6 rounded-full "
                      alt="add_wish_img"
                    />
                  </span>
                )}
              </span>
            </p>
          </div>
          <span className="font-normal line-through">${product.old_price}</span>
        </div>
      </div>
    </div>
  );
};

export default Product;
