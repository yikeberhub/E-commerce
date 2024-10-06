import React from "react";
import Mobile from "../assets/products/earphones/boAt Rockerz 518 1.webp";

function ProductBanner() {
  return (
    <div className="container-md py-2 my-2 w-full px-auto h-auto">
      <div className=" flex flex-row  bg-gradient-to-r from-yellow-200 to-blue-300 w-full px-10 py-2 h-full shadow-md rounded-md">
        <div>
          <h1 className="text-6xl text-black font-semibold py-2 my-5 px-2 text-wrap ">
            Don't Miss Amazing Electronic Devices
          </h1>
          <p className="text-3xl font-semibold py-2 my-5">
            Sign up for new the daily newsletter
          </p>
          <div className="mb-20 mt-5 mr-20 flex flex-row">
            <input
              type="text"
              placeholder="Your email address..."
              className="py-2 px-2 outline-none border border-green-300 rounded-md mr-2 w-full"
            />
            <input
              type="submit"
              value="subscribe"
              className="bg-green-500 text-xl px-2 py-2 rounded-md hover:cursor-pointer"
            />
          </div>
        </div>
        <div className="mx-2 py-2 rounded-md">
          <img src={Mobile} alt="banner" className="w-auto h-64 " />
        </div>
      </div>
    </div>
  );
}

export default ProductBanner;
