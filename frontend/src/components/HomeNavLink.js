import React, { useContext, useEffect } from "react";
import { ProductContext } from "../contexts/ProductContext";

function HomeNavLink() {
  const { categories, fetchCategories, selectedCategory, setSelectedCategory } =
    useContext(ProductContext);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="bg-white rounded-xl shadow-card px-4 sm:px-5 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">Popular Products</h2>
        <ul className="flex flex-row flex-wrap items-center gap-2 -mx-1">
          {[
            "All",
            ...categories.filter((c) => !c.parent).map((c) => c.title),
          ].map((category) => (
            <li key={category}>
              <button
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={`text-sm font-medium px-3 py-1.5 rounded-full transition ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HomeNavLink;
