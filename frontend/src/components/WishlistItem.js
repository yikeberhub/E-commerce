import React, { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";

function WishlistItem({ product }) {
  const { onAddToCart, onRemoveWishListItem } = useContext(ProductContext);
  return (
    <tr className="py-2  my-1 w-full text-center border border-gray-200">
      <td className="pl-4">
        <img src={product.image} alt="prod-img" className="w-12 h-12 rounded" />
      </td>
      <td>{product.title}</td>
      <td>${product.price}</td>
      <td>{product.status ? `in stuck` : "not available"} </td>
      <td>
        <p
          className="border border-gray-200 shadow-sm rounded px-0.5  hover:cursor-pointer"
          onClick={(e) => onAddToCart(product)}
        >
          🛒 Add
        </p>
      </td>
      <td
        className="text-3xl hover:cursor-pointer"
        onClick={(e) => onRemoveWishListItem(product)}
      >
        &times;
      </td>
    </tr>
  );
}

export default WishlistItem;
