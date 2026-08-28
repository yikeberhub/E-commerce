import React from "react";
import { Link } from "react-router-dom";

const Category = ({ category, subcategories }) => {
  return (
    <div>
      <Link
        to={`/categories/${category.id}`}
        className="flex flex-row items-center gap-2.5 py-1.5 px-1.5 rounded-md hover:bg-slate-50 transition"
      >
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
      </Link>
      {subcategories?.length > 0 && (
        <ul className="pl-9 flex flex-col">
          {subcategories.map((sub) => (
            <li key={sub.id}>
              <Link
                to={`/categories/${sub.id}`}
                className="flex items-center justify-between gap-2 py-1 text-xs text-slate-500 hover:text-primary-600 transition"
              >
                <span className="truncate">{sub.title}</span>
                <span className="shrink-0 text-slate-400">{sub.num_of_products}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Category;
