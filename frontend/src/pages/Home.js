import { React, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMobileAlt } from "react-icons/fa"; // Importing an icon
import ProductLists from "../components/ProductList";
import CategoryLists from "../components/CategoryLists";
import Promotions from "../components/Promotions";
import HomeNavLink from "../components/HomeNavLink";
import { ProductContext } from "../contexts/ProductContext";
import { useAuth } from "../contexts/AuthContext";
import FilterByPrice from "../components/filters/FilterByPrice";
import FilterByVendor from "../components/filters/FilterByVendor";
import FilterByCategory from "../components/filters/FilterByCategory";
import FilterByTags from "../components/filters/FilterByTags";
import FeaturedProducts from "../components/FeaturedProducts";
function Home() {
  const { products, loading, searchTerm, getProducts } =
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
  console.log("home page");

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2">
      <div className="lg:col-span-2  w-full lg:px-2 md:top-0 sm:col-span-1 md:col-span-1">
        <CategoryLists />
        <FilterByPrice />
        <FilterByVendor />
        <FilterByCategory />
        <FilterByTags />
      </div>
      <div className="sm:col-span-4 md:col-span-4 lg:col-span-7 items-center justify-center   shadow-md">
        {!searchTerm && <Promotions />}
        {!searchTerm && <FeaturedProducts />}
        <HomeNavLink />
        <ProductLists products={products} />
      </div>
    </div>
  );
}

export default Home;
