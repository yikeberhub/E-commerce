import { React } from "react";
import { Link } from "react-router-dom";

import Product from "./Product";
import CartItem from "./CartItem";
import ProceedCheckout from "./ProceedCheckout";

const CartLists = ({ addedProducts }) => {
  return (
    <div className="col-span-5 grid grid-cols-6 border border-gray-200 shadow-md ">
      <div className="col-span-4 px-2">
        <h1 className="text-3xl mx-2 py-2">Your Cart</h1>
        <div className="bg-gray-50 h-64">
          <table className="table-auto w-full  shadow-lg">
            <thead>
              <tr className="bg-gray-200 border  border-spacing-x-32">
                <th className="">product</th>
                <th className="">Title</th>
                <th className="">Unit price</th>
                <th className="">Quantity</th>
                <th className="">Subtotal</th>
                <th className="">Refresh</th>
                <th className="">Remove</th>
              </tr>
            </thead>
            <tbody>
              {addedProducts.map((product, key) => (
                <CartItem product={Product} key={key} />
              ))}
            </tbody>
          </table>
          <div className="flex flex-row items-center justify-between px-2 py-2">
            <Link to={`/`}>
              <button className="bg-green-500 mt-2 py-1 px-2 rounded text-white">
                Continue shoping
              </button>
            </Link>
            <button className="bg-green-500 mt-1  py-2 px-2 rounded text-white">
              Update cart
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-2  mb-2">
        <ProceedCheckout />
      </div>
    </div>
  );
};

export default CartLists;
