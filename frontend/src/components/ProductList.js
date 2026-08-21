import { useContext } from "react";
import Product from "./Product";
import { ProductContext } from "../contexts/ProductContext";

const ProductLists = ({ products: productsProp }) => {
  const { products, filteredProducts } = useContext(ProductContext);

  const items =
    productsProp ?? (filteredProducts?.length ? filteredProducts : products);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 w-full">
      {items.map((product, key) => (
        <Product product={product} key={product.id ?? key} />
      ))}
    </div>
  );
};

export default ProductLists;
