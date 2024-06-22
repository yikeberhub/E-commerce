import React from "react";
import Catagory from "./Catagory";

const CatagoryLists = ({ products }) => {
  return (
    <div className="col-span-1 border border-gray-200 shadow-lg rounded mt-4 mx-2 px-2 ">
      <h3 className="px-2 font-bold text-gray-500 text-lg py-2  rounded  border-b border-green-500">
        Catagories
      </h3>
      <ul className="">
        {products.map((product, key) => (
          <Catagory product={product} key={key} />
        ))}
      </ul>
    </div>
  );
};

export default CatagoryLists;
