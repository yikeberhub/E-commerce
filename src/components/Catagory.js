import React from "react";

const Catagory = ({ product }) => {
  return (
    <li className="flex flex-row justify-between items-center my-2 border border-gray-200 py-2 rounded-sm px-2">
      <img src={product.image} className="w-4 h-4 rounded-md" alt="image" />
      <p className="px-2">{product.name}</p>
      <span className="bg-gray-500 px-1  rounded-full">{product.quantity}</span>
    </li>
  );
};

export default Catagory;
