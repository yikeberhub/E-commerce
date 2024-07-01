import { React, useContext } from "react";
import { Link } from "react-router-dom";

import Product from "../components/Product";
import CartItem from "../components/CartItem";
import ProceedCheckout from "../components/ProceedCheckout";
import { ProductContext } from "../contexts/ProductContext";
const CartLists = () => {
  const { addToCart } = useContext(ProductContext);
  console.log("products:", addToCart);
  return (
    <div className="col-span-5 grid grid-cols-6 border border-gray-200 shadow-md ">
      <div className="col-span-4 px-2">
        <h1 className="text-3xl mx-2 py-2">Your Cart</h1>
        <p>There are {addToCart.length} products in cart.</p>
        <div className="bg-gray-50 h-64">
          <table className="border border-separate border-spacing-2   border-gray-200 w-full  table-auto md:table-fixed">
            <thead>
              <tr className="bg-gray-200 w-full">
                <th>product</th>
                <th>Title</th>
                <th>Unit price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Refresh</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {addToCart.map((product, key) => (
                <CartItem product={product} key={key} />
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
