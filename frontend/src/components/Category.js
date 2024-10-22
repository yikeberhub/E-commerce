import React from "react";

const Category = ({ product }) => {
  return (
    <li className="flex flex-row justify-between items-center my-2 border border-gray py-2 rounded-sm px-2 ">
      <img
        src={product?.category?.image}
        className="w-6 h-6 rounded"
        alt="img"
      />
      <p className="px-2">{product?.category?.title}</p>
      <span className="bg-blue px-1  rounded-full">3</span>
    </li>
  );
};

export default Category;
