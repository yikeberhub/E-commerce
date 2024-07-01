import React, { useContext } from "react";
import Category from "./Category";
import { ProductContext } from "../contexts/ProductContext";

const CategoryLists = () => {
  const { products } = useContext(ProductContext);
  return (
    <div className=" border border-gray-200 shadow-lg rounded mt-4 mx-2 px-2 mb-4">
      <h3 className="px-2 font-bold text-gray-500 text-lg py-2  rounded  border-b border-green-500">
        Catagories
      </h3>
      <ul className="">
        {products.map((product, key) => (
          <Category product={product} key={key} />
        ))}
      </ul>
    </div>
  );
};

export default CategoryLists;
