import { React, useContext, useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
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
import { ProductGridSkeleton } from "../common/Skeleton";
import Drawer from "../common/Drawer";

function Home() {
  const { products, loading, searchTerm, getProducts } =
    useContext(ProductContext);
  const { authTokens, fetchUserInfo } = useAuth();
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (authTokens.access) {
      fetchUserInfo();
    }
  }, [authTokens]);

  const filterPanels = (
    <>
      <CategoryLists />
      <FilterByPrice />
      <FilterByVendor />
      <FilterByCategory />
      <FilterByTags />
    </>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="hidden lg:flex lg:col-span-1 flex-col gap-4">
        {filterPanels}
      </aside>

      <div className="lg:col-span-3 flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="lg:hidden self-start flex items-center gap-1.5 text-sm font-medium bg-white shadow-card border border-slate-100 rounded-lg px-3 py-2 hover:border-primary-300 hover:text-primary-600 transition"
        >
          <FaFilter className="text-xs" /> Filters &amp; Categories
        </button>

        {!searchTerm && <Promotions />}
        {!searchTerm && <FeaturedProducts />}
        <HomeNavLink />
        {loading ? (
          <ProductGridSkeleton count={10} />
        ) : (
          <ProductLists products={products} />
        )}
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters & Categories"
        position="bottom"
      >
        <div className="flex flex-col gap-4">{filterPanels}</div>
      </Drawer>
    </div>
  );
}

export default Home;
