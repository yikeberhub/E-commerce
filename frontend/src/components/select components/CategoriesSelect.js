import React, { useContext, useEffect } from "react";
import { ProductContext } from "../../contexts/ProductContext";
import { selectClass } from "../../common/formStyles";

const embeddedClass =
  "appearance-none cursor-pointer bg-transparent border-0 shadow-none pl-4 pr-8 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-0 bg-no-repeat bg-[right_0.6rem_center] bg-[length:12px] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394a3b8%22 stroke-width=%222.5%22><polyline points=%226 9 12 15 18 9%22/></svg>')]";

function CategoriesSelect({ embedded = false }) {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    fetchCategories,
  } = useContext(ProductContext);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const topLevel = categories?.filter((c) => !c.parent) || [];

  return (
    <select
      className={embedded ? embeddedClass : selectClass}
      onChange={(e) => handleCategoryChange(e.target.value)}
      value={selectedCategory}
    >
      <option value="All">All Categories</option>
      {topLevel.map((top) => (
        <optgroup key={top.id} label={top.title}>
          <option value={top.title}>All {top.title}</option>
          {categories
            .filter((c) => c.parent === top.id)
            .map((cat) => (
              <option key={cat.title} value={cat.title}>
                {cat.title}
              </option>
            ))}
        </optgroup>
      ))}
    </select>
  );
}

export default CategoriesSelect;
