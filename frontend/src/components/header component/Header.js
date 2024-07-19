import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../contexts/ProductContext";
import Logo from "./Logo";
import logo from "../../assets/icons/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import Search from "./Search";
import RightContent from "./RightContent";

const Header = () => {
  const { products, onFilterProducts } = useContext(ProductContext);
  const [searchedValue, setSearchedValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    handleSearch();
  }, [searchedValue]);

  const handleSearch = () => {
    const lowercaseSearchedValue = searchedValue.toLowerCase();
    if (lowercaseSearchedValue !== "") {
      const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(lowercaseSearchedValue)
      );

      onFilterProducts(filteredProducts);
      navigate(`search-product/?ld=${isLoading}`);
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="flex flex-row items-center justify-between mx-1 mt-1 px-2 py-5 shadow-md border border-gray-300">
      <Link to={"/"}>
        <Logo logo={logo} />
      </Link>
      <Search searchedValue={searchedValue} onSearch={setSearchedValue} />
      <RightContent />
    </nav>
  );
};

export default Header;
