import React, { useContext, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
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
    <form
      className="flex items-center w-full max-w-xl bg-white border border-slate-200 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-primary-400 focus-within:border-primary-400 transition overflow-hidden"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="hidden sm:block border-r border-slate-200">
        <CategoriesSelect embedded />
      </div>
      <input
        type="search"
        value={searchTerm}
        onChange={handleFilterChange}
        placeholder="Search for products..."
        className="outline-none py-2.5 px-4 flex-grow bg-transparent text-sm text-slate-700 placeholder-slate-400"
      />
      <button
        type="submit"
        className="flex items-center justify-center w-10 h-10 mr-1 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition shrink-0"
      >
        <FaSearch className="text-sm" />
      </button>
    </form>
  );
}

export default Search;
