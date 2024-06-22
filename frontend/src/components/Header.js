import React, { useEffect, useState } from "react";

import Logo from "../assets/icons/logo.svg";
import AccountIcon from "../assets/icons/user.svg";

const Header = ({
  products,
  onFilterProducts,
  addToCart,
  wishlists,
  onSetShowCartList,
  onSetShowWishlist,
}) => {
  const [searchedValue, setSearchedValue] = useState("");
  const [showSearches, setShowSearches] = useState(false);
  // const [searchedProducts, setSearchedProducts] = useState(roducts);

  useEffect(() => {
    console.log("effect value", searchedValue);
    handleFilter(searchedValue);
  }, [searchedValue]);

  const handleOnchange = () => {
    console.log("value", searchedValue);

    // searchedValue && handleFilter();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredProducts = products.filter(
      (product) => product.name === searchedValue
    );

    onFilterProducts(filteredProducts);
  };

  const handleFilter = (searchedValue) => {
    if (searchedValue !== "") {
      console.log("searched value", searchedValue);

      let data = searchedValue ? "Samsung galaxy S10 pro" : "";
      const filteredProducts = products.filter(
        (product) => product.name === searchedValue
      );

      console.log("filtered products", filteredProducts);
      onFilterProducts(filteredProducts);
    }
  };

  return (
    <div className="flex flex-row items-center overflow-x-scroll  sm:justify-between sm:px-2 py-5 border border-gray-200 shadow-md ">
      <div className="flex flex-row sm:gap-2 items-center">
        <img src={Logo} className="w-8 h-8 hover:w-10 hover:h-10" alt="logo" />
        <h1 className="text-green-500 text-3xl">Electro Shop</h1>
      </div>
      <form
        className="flex flex-row items-center"
        onSubmit={(e) => handleSubmit(e)}
      >
        <input
          type="search"
          value={searchedValue}
          onChange={(e) => {
            setSearchedValue(e.target.value);
          }}
          placeholder="search product..."
          className="outline-yellow-300 sm:px-2 py-1 border border-green-300 rounded shadow-md"
        />
      </form>
      <div className="flex flex-row sm:gap-4 items-center">
        <div className="border border-gray-300 sm:px-2 rounded  py-1 shadow-md">
          <p>Your Location</p>
          <p></p>
        </div>
        <div
          className="border border-gray-300 px-2 rounded py-2  shadow-md  relative"
          onClick={(e) => onSetShowCartList()}
        >
          <small className="bottom-5 left-6 absolute text-xs px-1 rounded-full border bg-green-500">
            {addToCart?.length}
          </small>
          <p>🛒cart</p>
        </div>
        <div className="border border-gray-300 px-2 rounded py-2  shadow-md  relative">
          <small className="bottom-5 left-6 absolute text-xs px-1 rounded-full border bg-green-500">
            {wishlists?.length}
          </small>
          <p onClick={(e) => onSetShowWishlist()}>💟wishlist</p>
        </div>
        <div className="border border-gray-300 sm:px-2 rounded  py-1 shadow-md flex flex-row items-center gap-2">
          <img src={AccountIcon} alt="accountIcon" className="w-6 h-6 " />
          <p>Account</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
