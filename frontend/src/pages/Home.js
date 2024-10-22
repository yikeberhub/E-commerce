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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="col-span-1 md:sticky md:top-0">
          <CategoryLists />
          <FilterByPrice />
          <FilterByVendor />
          <FilterByCategory />
          <FilterByTags />
        </div>
        <div className="col-span-4 items-center justify-center px-2  shadow-md">
          <ProductBanner />
          <HomeNavLink />
          <ProductLists products={products} />
        </div>
      </div>
    </div>
  );
}

export default Home;
