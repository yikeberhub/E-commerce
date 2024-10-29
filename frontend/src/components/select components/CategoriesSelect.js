import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../contexts/ProductContext";

function CategoriesSelect({ style }) {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    fetchCategories,
    onFilterProducts,
  } = useContext(ProductContext);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (category === "All") {
      onFilterProducts(products);
    } else {
      const filteredProducts = products.filter(
        (product) => product?.category?.title === category
      );
      onFilterProducts(filteredProducts);
    }
  };

  return (
    <select
      className={`sm:px-3 text-black focus:outline-none  ${style && style}`}
      onChange={(e) => handleCategoryChange(e.target.value)}
      value={selectedCategory}
    >
      <option value="All" className="text-black ">
        All Categories
      </option>
      {categories?.map((cat) => (
        <option key={cat.title} value={cat.title} className="text-black">
          {cat.title}
        </option>
      ))}
    </select>
  );
}

export default CategoriesSelect;
