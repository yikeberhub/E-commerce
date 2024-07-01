import React from "react";
import { Link } from "react-router-dom";

const ProceedCheckout = () => {
  return (
    <div className="container-sm mx-auto pt-2 ">
      <div className="rounded-md border border-gray-100 h-auto px-10 mx-5 my-3 py-5 pt-3 font-snas font-semibold">
        <div className="border border-gray-300 rounded-t  py-2 px-4 flex flex-row justify-between">
          <span className="">Subtotal</span>
          <span>$900</span>
        </div>
        <div className="border border-gray-300   py-2 px-4 flex flex-row justify-between">
          <span className="">Shiping</span>
          <span>free</span>
        </div>
        <div className="border border-gray-300 rounded-b shadow-lg py-2 px-4 flex flex-row justify-between">
          <span className="">Total</span>
          <span>$900</span>
        </div>
        <div>
          <Link to={`product/${1}/checkout`} />
          <button className="bg-green-500 mt-2 w-full py-1 rounded text-white">
            Proceed to checkout
          </button>
          <Link />
        </div>
      </div>
    </div>
  );
};

export default ProceedCheckout;
