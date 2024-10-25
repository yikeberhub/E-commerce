import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../contexts/ProductContext";
import Logo from "./Logo";
import logo from "../../assets/icons/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import Search from "./Search";
import RightContent from "./RightContent";

const Header = () => {
  const { products, onFilterProducts } = useContext(ProductContext);
  const [isLoading, setIsLoading] = useState(false);
  const { searchedValue, setSearchedValue } = useContext(ProductContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchedValue) {
      handleSearch();
    } else {
      navigate("/");
    }
  }, [searchedValue]);

  const handleSearch = () => {
    const lowercaseSearchedValue = searchedValue.toLowerCase();
    console.log("searched is", lowercaseSearchedValue);
    if (lowercaseSearchedValue !== "") {
      const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(lowercaseSearchedValue)
      );

      onFilterProducts(filteredProducts);
      navigate(`search-product/?ld=${isLoading}`);
    }
  };

  return (
    <nav className="flex flex-row bg-bg_secondary items-center justify-between mx-1 mt-1 px-2 py-5 border-b border-gray">
      <Link to={"/"}>
        <Logo logo={logo} />
      </Link>
      <Search searchedValue={searchedValue} onSearch={setSearchedValue} />
      <RightContent />
    </nav>
  );
};

export default Header;
