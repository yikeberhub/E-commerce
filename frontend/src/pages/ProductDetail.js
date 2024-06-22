import { React, useParam } from "react";
import Mobile from "../assets/products/mobile/SAMSUNG Galaxy A03 (Black, 32 GB) (3 GB RAM) 3.webp";
import { Link, useParams, useNavigate } from "react-router-dom";

const ProductDetail = ({ product }) => {
  const { id } = useParams();

  return (
    <div className="grid grid-cols-7 mt-4 border border-gray-200 p-6 px-20 mx-4">
      <div className="col-span-3 mx-2 px-4 border shadow-lg border-gray-300 rounded h-64">
        <img src={Mobile} className="w-auto h-60" />
      </div>
      <div className="col-span-2 px-4 border shadow-lg border-gray-300 rounded h-64">
        <div>
          <h1>Chocolate Bread</h1>

          <p className="text-[#4d2d96] text-sm">{product.name}</p>
          <p className="text-[#4d2d96] text-sm">{product.description}</p>

          <p className="text-[#bb7cc0e9] text-sm">Rating {product.rating}</p>
          <p className="text-[#313432]">{product.manufacturer}</p>
          <div>
            <div className="flex flex-row justify-between items center  border border-gray-200 px-2 py-2 my-2 rounded shaddow-md font-bold ">
              <span>${product.discounted_price}</span>
              <p className="border border-gray-200 shadow-sm rounded px-0.5 ">
                🛒 Add
              </p>
              <p>❤️</p>
            </div>
            <span className="font-normal line-through">
              ${product.actual_price}
            </span>
          </div>
        </div>
      </div>
      <div className="col-span-2 px-4 border shadow-lg border-gray-300 rounded h-64">
        delivery
      </div>
    </div>
  );
};

export default ProductDetail;
