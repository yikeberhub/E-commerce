import React from "react";
import Mobile from "../assets/products/earphones/boAt Rockerz 518 1.webp";

function ProductBanner() {
  return (
    <div className="container mx-auto py-4 my-4 px-4">
      <div className="flex flex-col md:flex-row bg-gradient-to-r from-green-100 to-blue-100 w-full p-6 rounded-lg shadow-lg">
        <div className="flex-1">
          <h1 className="text-5xl text-black font-bold mb-4">
            Don't Miss Amazing Electronic Devices
          </h1>
          <p className="text-2xl font-semibold mb-6">
            Sign up for the daily newsletter
          </p>
          <div className="flex flex-col md:flex-row mb-10">
            <input
              type="text"
              placeholder="Your email address..."
              className="py-2 px-4 border border-green-400 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-300 w-full md:w-2/3 mr-2"
            />
            <input
              type="submit"
              value="Subscribe"
              className="bg-green-600 text-xl text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 cursor-pointer w-full md:w-1/3"
            />
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center mt-4 md:mt-0">
          <img
            src={Mobile}
            alt="banner"
            className="w-full h-auto max-w-xs rounded-md"
          />
        </div>
      </div>
    </div>
  );
}

export default ProductBanner;
