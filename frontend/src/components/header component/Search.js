import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Importing the search icon

function Search({ searchedValue, onSearch }) {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  return (
    <form className="flex items-center w-1/3 border border-gray rounded-md overflow-hidden shadow-md bg-white">
      <select
        value={selectedFilter}
        onChange={handleFilterChange}
        className="border-none py-2 px-3  text-gray focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
        <option value="Home">Home</option>
      </select>
      <span className="text-gray-500">|</span>
      <input
        type="search"
        value={searchedValue}
        onChange={(e) => onSearch(e.target.value)}
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
