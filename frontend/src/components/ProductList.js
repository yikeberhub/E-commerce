import { useContext } from "react";
import Product from "./Product";
import { ProductContext } from "../contexts/ProductContext";

const ProductLists = ({ products }) => {
  const { searchedProducts, onFilterProducts } = useContext(ProductContext);

  console.log("searched product:", searchedProducts);
  if (!searchedProducts.length) {
    return (
      <div className="grid sm:grid-cols-8 bg-gray-50 lg:grid-cols-10  sm:content-start gap-1 w-full ">
        {products.map((product, key) => (
          <Product product={product} key={key} />
        ))}
      </div>
    );
  }
  if (searchedProducts) {
    return (
      <div className="grid sm:grid-cols-8 bg-gray-50 lg:grid-cols-10  sm:content-start gap-1 w-full ">
        {searchedProducts.map((product, key) => (
          <Product product={product} key={key} />
        ))}
      </div>
    );
  }
};

export default ProductLists;
