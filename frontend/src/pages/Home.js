import { React, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductLists from "../components/ProductList";
import CategoryLists from "../components/CategoryLists";
import FilterType from "../components/FilterType";
import ProductBanner from "../components/ProductBanner";
import HomeNavLink from "../components/HomeNavLink";
import { ProductContext } from "../contexts/ProductContext";
import SummaryApi from "../common";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const { products, onSetProduct } = useContext(ProductContext);
  const { authTokens, fetchUserInfo } = useAuth();

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (authTokens.access) {
      fetchUserInfo();
    }
  }, [authTokens]);

  const getProducts = async () => {
    try {
      const response = await fetch(SummaryApi.allProduct.url, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("products:", data);
      const products = data || []; // Default to an empty array if products is undefined
      onSetProduct(products);
    } catch (error) {
      console.error("Error hello yike man", error);
    }
  };

  return (
    <div className="container-lg px-2  w-auto h-auto">
      <div className="px-2 pt-2 border border-gray-200 shadow-md rounded">
        <ul className="flex flex-row justify-between items-center mx-2 py-2 ">
          <select className=" bg-green-500 hover:bg-blue-400 outline-none shadow-sm border-yellow-200 px-2 py-2 rounded text-xg text-white font-bold">
            <option value="opt1">📱 Browse All Categories</option>
            <option value="opt1"> Browse All 2</option>
          </select>

          <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
            Deals
          </li>
          <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
            Home
          </li>
          <li>
            <select className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:pb-1  outline-none text-slate-500 hover:text-green-400">
              <option value="cat1">Category</option>
            </select>
          </li>
          <Link to={`products/`}>
            <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
              Shop
            </li>
          </Link>
          <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
            Vendors
          </li>
          <li>
            <select className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:pb-1  outline-none text-slate-500 hover:text-green-400">
              <option value="cat1">Mega Menu</option>
            </select>
          </li>
          <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
            Blog
          </li>
          <li>
            <select className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:pb-1  outline-none text-slate-500 hover:text-green-400">
              <option value="cat1">Pages</option>
            </select>
          </li>
          <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
            Contact
          </li>
          <div>
            <p>support center</p>
            <p>5646</p>
          </div>
        </ul>
      </div>
      <div className="grid grid-cols-6 ">
        <div className="col-span-1 sticky">
          <CategoryLists />
          <FilterType />
          <FilterType />
          <FilterType />
        </div>
        <div className="col-span-5   items-center justify-center px-2  border border-gray-200 shadow-md ">
          <ProductBanner />
          <HomeNavLink />
          <ProductLists products={products} />
          {console.log("products in home page:", products)}
        </div>
      </div>
    </div>
  );
}

export default Home;
