import React, { useContext, useState } from "react";
import ProductLists from "../components/ProductList";
import { ProductContext } from "../contexts/ProductContext";
import { useLoaderData } from "react-router-dom";
import Loader from "../common/Loader";

function SearchProduct() {
  const { searchedProducts } = useContext(ProductContext);
  const isLoading = useLoaderData();
  console.log("state", isLoading);

  return (
    <div>
      <ProductLists products={searchedProducts} />
    </div>
  );
}

export default SearchProduct;
