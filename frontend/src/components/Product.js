import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";

const Product = ({ product }) => {
  const { onAddToCart, onAddWishlist } = useContext(ProductContext);
  console.log("product", product);

  product = { ...product, get_percentage: 20 };
  return (
    <div className="sm:col-span-2 flex flex-col items-center px-0   border-green-300 rounded py-2 shadow-md w-full">
      <div className=" border  rounded-lg  border-gray-200">
        <span className="bg-red-500 rounded-tl-md rounded-br-md px-2 py-1  shadow-md">
          {`-${product.get_percentage}% off!`}
        </span>
        <Link to={`product/${product.id}`}>
          <img
            src={product.image}
            className="w-auto h-64 rounded-md mt-2 hover:w-full hover:h-72"
            alt="logo"
          />

          <p className="text-[#3e3e3f] text-lg">{product.category.title}</p>
          <p className="text-[#4d2d96] text-sm">{product.title}</p>
          <p className="text-[#4d2d96] text-sm">{product.specifications}</p>
        </Link>
        <p className="text-[#bb7cc0e9] text-sm">
          Rating✨✨✨ ({product.rating})
        </p>
        <p className="text-[#313432]">{product.vendor.title}</p>
        <div>
          <div className="flex flex-row justify-between items center  border border-gray-200 px-2 py-2 my-2 rounded shaddow-md font-bold ">
            <span>${product.price}</span>
            <p
              className="border border-gray-200 shadow-sm rounded px-0.5  hover:cursor-pointer"
              onClick={(e) => onAddToCart(product)}
            >
              🛒 Add
            </p>
            <p
              className="hover:cursor-pointer"
              onClick={(e) => onAddWishlist(product)}
            >
              ❤️
            </p>
          </div>
          <span className="font-normal line-through">${product.old_price}</span>
        </div>
      </div>
    </div>
  );
};

export default Product;
