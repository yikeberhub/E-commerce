import { useContext, useEffect, useState } from "react";
import Header from "./header component/Header";
import { Link, useLocation } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";
import VendorSelect from "./select components/VendorSelect";
import PagesSelect from "./select components/PagesSelect";
import CategoriesSelect from "./select components/CategoriesSelect";

const customStyle = "border border-gray-200 py-1 rounded-md  ";

const Navigation = () => {
  const { products, categories, fetchCategories, onFilterProducts } =
    useContext(ProductContext);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const location = useLocation();
  const search = location.pathname.includes("products");
  const home = location.pathname === "/";

  useEffect(() => {
    fetchCategories();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (category === "All") {
      onFilterProducts(products);
    } else {
      const filteredProducts = products.filter(
        (product) => product?.category?.title === category
      );
      onFilterProducts(filteredProducts);
    }
  };

  return (
    <div className="p-0 bg-gray-50 shadow-md ">
      <div className="text-gray_lightest">
        <div className="flex flex-col md:flex-row justify-between mx-4 container-md text-gray-600 ">
          <ul className="flex flex-row justify-between items-center pt-2 pb-1 gap-4">
            <li className="text-sm hover:text-md hover:cursor-pointer hover:border-b hover:border-b-yellow-400 font-semibold text-gray_lighter transition duration-300 hover:text-green-400">
              About us |
            </li>
            <li className="text-sm hover:text-md hover:cursor-pointer hover:border-b hover:border-b-yellow-400 font-semibold text-gray_lighter transition duration-300 hover:text-green">
              My Account |
            </li>
            <li className="text-sm hover:text-md hover:cursor-pointer hover:border-b hover:border-b-yellow-400 font-semibold text-gray_lighter transition duration-300 hover:text-green-400">
              Wishlist |
            </li>
          </ul>

          <p className="font-semibold text-sm pt-2 pb-1 text-center md:text-left">
            Today is 25% off on all products!
          </p>

          <ul className="flex flex-row justify-between items-center pt-2 pb-1 gap-4">
            <li className="text-sm hover:text-md hover:cursor-pointer hover:border-b hover:border-b-yellow-400 font-semibold text-gray_lighter transition duration-300 hover:text-green-400">
              Need help? Call us
            </li>
            <li className="text-sm font-semibold text-gray_lighter">
              +2511946472687
            </li>
            <li className="text-sm">
              <select className="bg-card border border-gray rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="en">English</option>
              </select>
            </li>
            <li className="text-sm">
              <select className="bg-card border border-gray rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="en">ETB</option>
                <option value="en">USD</option>
              </select>
            </li>
          </ul>
        </div>
        <hr className="border-gray" />
        {(home || search) && <Header />}
      </div>

      <nav className="max-w-screen-lg px-4 py-2 mb-2">
        <div className="flex items-center">
          <CategoriesSelect style={customStyle} />
          <ul className="flex sm:ml-4 sm:space-x-4 justify-between items-centers text-gray_light">
            <li>
              <Link
                to="/"
                className="text-black hover:border-blue-500 hover:border-b hover:rounded-b px-3 py-2"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-black hover:border-blue-500 hover:border-b hover:rounded-b sm:px-3 py-2"
              >
                Shop
              </Link>
            </li>
            <li>
              <VendorSelect />
            </li>
            <li>
              <PagesSelect />
            </li>

            <li>
              <Link
                to="/contact"
                className="text-black hover:border-blue-500 hover:border-b hover:rounded-b px-3 py-2"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <hr className="border-sm border-gray" />
    </div>
  );
};

export default Navigation;
