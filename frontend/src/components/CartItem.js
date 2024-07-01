import React from "react";

const CartItem = ({ product }) => {
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
      <td>remove</td>
    </tr>
  );
};

export default CartItem;
