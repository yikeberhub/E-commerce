import { React, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductLists from "../components/ProductList";
import CategoryLists from "../components/CategoryLists";
import ProductBanner from "../components/ProductBanner";
import HomeNavLink from "../components/HomeNavLink";
import { ProductContext } from "../contexts/ProductContext";
import SummaryApi from "../common";
import { useAuth } from "../contexts/AuthContext";
import FilterByPrice from "../components/filters/FilterByPrice";
import FilterByVendor from "../components/filters/FilterByVendor";
import FilterByCategory from "../components/filters/FilterByCategory";
import FilterByTags from "../components/filters/FilterByTags";

function Home() {
  const { products, loading, getProducts, SetProduct } =
    useContext(ProductContext);
  const { authTokens, fetchUserInfo } = useAuth();

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (authTokens.access) {
      fetchUserInfo();
    }
  }, [authTokens]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-lg px-2 w-auto h-auto">
      <div className="px-2 pt-2 border border-gray-200 shadow-md rounded">
        <ul className="flex flex-row justify-between items-center mx-2 py-2 ">
          <select className="bg-green-500 hover:bg-blue-400 outline-none shadow-sm border-yellow-200 px-2 py-2 rounded text-xg text-white font-bold">
            <option value="opt1">📱 Browse All Categories</option>
            <option value="opt1"> Browse All 2</option>
          </select>
          <Link to={`products/`}>
            <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
              Shop
            </li>
          </Link>
          {/* Other navigation items */}
        </ul>
      </div>
      <div className="grid grid-cols-6">
        <div className="col-span-1 sticky">
          <CategoryLists />
          <FilterByPrice />
          <FilterByVendor />
          <FilterByCategory />
          <FilterByTags />
        </div>
        <div className="col-span-5 items-center justify-center px-2 border border-gray-200 shadow-md">
          <ProductBanner />
          <HomeNavLink />
          <ProductLists products={products} />
        </div>
      </div>
    </div>
  );
}

export default Home;
