import React from "react";
import { Link } from "react-router-dom";

import Mobile from "../assets/products/mobile/SAMSUNG Galaxy A03 (Black, 32 GB) (3 GB RAM) 3.webp";
import Earphone from "../assets/products/earphones/boAt Rockerz 103 Pro 3.webp";
import Mobile2 from "../assets/products/mobile/realme Narzo 50 (Speed Blue, 64 GB) (4 GB RAM) 4.webp";
import Camera from "../assets/products/camera/DIGITEK® (DTR 260 GT) Gorilla Tripod-Mini 33 CM (13 Inch) Tripod for Mobile Phone with Phone Mount & Remote, Flexible Gorilla Stand for DSLR & Action Cameras 2.jpg";

const Product = ({ product, onAddToCart, onAddToWishlist }) => {
  return (
    <div className="sm:col-span-2 flex flex-col items-center px-0 border  border-green-300 rounded pt-2 shadow-md w-full">
      <div className="px-2 py-2 border rounded shadow-md border-gray-200">
        <span className="bg-gray-300 px-2 rounded shadow-md">
          {`${product.discount} off!`}
        </span>
        <img
          src={product.image}
          className="w-auto h-64 rounded-md"
          alt="logo"
        />
        <Link to={`product/${product.id}`}>
          <p className="text-[#4d2d96] text-sm">{product.name}</p>
          <p className="text-[#4d2d96] text-sm">{product.description}</p>
        </Link>
        <p className="text-[#bb7cc0e9] text-sm">Rating {product.rating}</p>
        <p className="text-[#313432]">{product.manufacturer}</p>
        <div>
          <div className="flex flex-row justify-between items center  border border-gray-200 px-2 py-2 my-2 rounded shaddow-md font-bold ">
            <span>${product.discounted_price}</span>
            <p
              className="border border-gray-200 shadow-sm rounded px-0.5 "
              onClick={(e) => onAddToCart(product)}
            >
              🛒 Add
            </p>
            <p onClick={(e) => onAddToWishlist(product)}>❤️</p>
          </div>
          <span className="font-normal line-through">
            ${product.actual_price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product;
