import React, { useContext } from "react";
import ProductLists from "../components/ProductList";
import { ProductContext } from "../contexts/ProductContext";

function SearchProduct() {
  const { searchedProducts } = useContext(ProductContext);

  return (
    <div>
      <ProductLists products={searchedProducts} />
    </div>
  );
}

export default SearchProduct;
