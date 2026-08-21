import React from "react";

const Category = ({ category }) => {
  return (
    <div className="flex flex-row items-center gap-2.5 py-1.5 px-1.5 rounded-md hover:bg-slate-50 transition">
      <img
        src={category?.image}
        className="w-7 h-7 rounded object-cover shrink-0"
        alt={category?.title}
      />
      <p className="text-sm text-slate-700 flex-1 truncate">
        {category?.title}
      </p>
      <span className="text-xs font-medium text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-full shrink-0">
        {category.num_of_products}
      </span>
    </div>
  );
};

export default Category;
