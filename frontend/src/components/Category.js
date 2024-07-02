import React from "react";

const Category = ({ product }) => {
  return (
    <li className="flex flex-row justify-between items-center my-2 border border-gray-200 py-2 rounded-sm px-2">
      <img src={product.image} className="w-6 h-6 rounded-md" alt="img" />
      <p className="px-2">{product.category.title}</p>
      <span className="bg-gray-500 px-1  rounded-full">3</span>
    </li>
  );
};

export default Category;
