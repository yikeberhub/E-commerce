import { React, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMobileAlt } from "react-icons/fa"; // Importing an icon
import ProductLists from "../components/ProductList";
import CategoryLists from "../components/CategoryLists";
import ProductBanner from "../components/ProductBanner";
import HomeNavLink from "../components/HomeNavLink";
import { ProductContext } from "../contexts/ProductContext";
import { useAuth } from "../contexts/AuthContext";
import FilterByPrice from "../components/filters/FilterByPrice";
import FilterByVendor from "../components/filters/FilterByVendor";
import FilterByCategory from "../components/filters/FilterByCategory";
import FilterByTags from "../components/filters/FilterByTags";

function Home() {
  const { products, loading, getProducts } = useContext(ProductContext);
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
    <div className="container-lg mx-auto px-4">
      <div className="px-4 pt-2 border border-gray-200 shadow-md rounded mb-4">
        <ul className="flex flex-col sm:flex-row justify-between items-center py-2">
          <li>
            <select className="border-none py-2 px-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home</option>
            </select>
          </li>
          <Link to={`products/`}>
            <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
              Shop
            </li>
          </Link>
          {/* Other navigation items */}
        </ul>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="col-span-1 md:sticky md:top-0">
          <CategoryLists />
          <FilterByPrice />
          <FilterByVendor />
          <FilterByCategory />
          <FilterByTags />
        </div>
        <div className="col-span-4 items-center justify-center px-2 border border-gray-200 shadow-md">
          <ProductBanner />
          <HomeNavLink />
          <ProductLists products={products} />
        </div>
      </div>
    </div>
  );
}

export default Home;
