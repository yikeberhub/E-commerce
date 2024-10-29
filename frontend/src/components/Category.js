import React from "react";

const Category = ({ category }) => {
  return (
    <div className="flex flex-row justify-between items-center my-2 bg-white border border-gray-50 py-2 rounded-sm px-2 ">
      <img src={category?.image} className="w-6 h-6 rounded" alt="img" />
      <p className="px-2">{category?.title}</p>
      <span className="bg-blue-500 px-1  rounded-full">
        {category.num_of_products}
      </span>
    </div>
  );
};

export default Category;
