import { ProductContext } from "../contexts/ProductContext";
import { useContext } from "react";
import Category from "./Category";
const FilterType = () => {
  const { products } = useContext(ProductContext);
  return (
    <div className="border border-gray-200 shadow-lg rounded mt-4 mx-2 px-2 ">
      <h3 className="px-2 font-bold text-gray-500 text-lg py-2  rounded  border-b border-green-500">
        Filter Type
      </h3>
      <ul className="">
        {products.map((product, key) => (
          <Category product={product} key={key} />
        ))}
      </ul>
    </div>
  );
};

export default FilterType;
