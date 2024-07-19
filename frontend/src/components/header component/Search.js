import React from "react";

function Search({ searchedValue, onSearch }) {
  return (
    <form className="flex flex-row items-center  w-1/3">
      <input
        type="search"
        value={searchedValue}
        onChange={(e) => {
          onSearch(e.target.value);
        }}
        placeholder="search product..."
        className="outline-yellow-300 sm:px-2 py-1 border border-green-300 rounded shadow-md w-full"
      />
    </form>
  );
}

export default Search;
