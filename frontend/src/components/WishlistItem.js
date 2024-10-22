import React from "react";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/cartContext";

import RemoveItemIcon from "../assets/icons/images/cart_black_white.png";
import AddItemtIcon from "../assets/icons/images/cart_blue.png";

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
    <tr className="py-2  my-1 w-full text-center border border-gray_light">
      <td className="pl-4">
        <img
          src={wishlistItem.product.image}
          alt="prod-img"
          className="w-12 h-12 rounded"
        />
      </td>
      <td>{wishlistItem.product.title}</td>
      <td>${wishlistItem.product.price}</td>
      <td>{wishlistItem.product.status ? `in stuck` : "not available"} </td>
      <td>
        <p
          className="border border-gray-200 shadow-sm rounded px-0.5  hover:cursor-pointer"
          onClick={(e) => handleAddToCart()}
        >
          {!addedToCart ? (
            <img
              src={AddItemtIcon}
              alt="add_to_cart_img"
              className="rounded-full w-6 h-6"
            />
          ) : (
            <img
              src={RemoveItemIcon}
              alt="cart_remove_img"
              className="rounded-full w-8 h-8"
            />
          )}
        </p>
      </td>
      <td
        className="text-3xl hover:cursor-pointer"
        onClick={(e) => removeWishlistItem(wishlistItem.id)}
      >
        &times;
      </td>
    </tr>
  );
}

export default WishlistItem;
