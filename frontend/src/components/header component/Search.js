import React, { useState, useEffect, useContext } from "react";
import { FaSearch } from "react-icons/fa"; // Importing the search icon
import { ProductContext } from "../../contexts/ProductContext";
import CategoriesSelect from "../select components/CategoriesSelect";

function Search() {
  const {
    products,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    onFilterProducts,
  } = useContext(ProductContext);

  useEffect(() => {
    const filteredProducts = products.filter((product) => {
      const matchesTitle = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      if (selectedCategory !== "All") {
        const matchesCategory = product.category?.title === selectedCategory;
        return matchesTitle && matchesCategory;
      }
      return matchesTitle;
    });

    onFilterProducts(filteredProducts);
  }, [searchTerm, selectedCategory, products]);

  const handleFilterChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form className="flex items-center w-1/3 border border-gray rounded-md overflow-hidden shadow-md bg-white">
      <CategoriesSelect />
      <span className="text-gray-500">|</span>
      <input
        type="search"
        value={searchTerm}
        onChange={handleFilterChange}
        placeholder="Search for products..."
        className="outline-none py-2 px-3 flex-grow bg-light text-gray-500 focus:outline-none placeholder-gray-300"
      />
      <button
        type="submit"
        className="flex items-center justify-center p-2 text-gray hover:text-blue transition duration-200"
      >
        <FaSearch />
      </button>
    </form>
  );
}

export default Search;
