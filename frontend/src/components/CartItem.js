import React, { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";

const CartItem = ({ product }) => {
  const { onRemoveCartItem } = useContext(ProductContext);
  return (
    <tr className="py-2  my-1 w-full text-center border border-gray-200">
      <td className="pl-4">
        <img src={product.image} alt="prod-img" className="w-12 h-12 rounded" />
      </td>
      <td>{product.title}</td>
      <td>${product.price}</td>
      <td>9</td>
      <td>20000 fhtht thehtt </td>
      <td>refresh</td>
      <td
        className="text-3xl hover:cursor-pointer"
        onClick={(e) => onRemoveCartItem(product)}
      >
        &times;
      </td>
    </tr>
  );
};

export default CartItem;
