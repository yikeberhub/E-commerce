import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Importing the search icon

function Search({ searchedValue, onSearch }) {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  return (
    <form className="flex items-center w-1/3 border border-gray-300 rounded-md overflow-hidden shadow-md bg-white">
      <select
        value={selectedFilter}
        onChange={handleFilterChange}
        className="border-none py-2 px-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
        <option value="Home">Home</option>
      </select>
      <input
        type="search"
        value={searchedValue}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search for products..."
        className="outline-none py-2 px-3 flex-grow bg-gray-100 focus:outline-none"
      />
      <button
        type="submit" // Ensure the form submits on Enter, if desired
        className="flex items-center justify-center p-2 text-gray-600 hover:text-blue-600 transition duration-200"
      >
        <FaSearch />
      </button>
    </form>
  );
}

export default Search;
