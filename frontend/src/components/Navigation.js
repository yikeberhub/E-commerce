import Header from "./header component/Header";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const search = location.pathname.includes("search-product");
  const home = location.pathname === "/";

  return (
    <div className="p-0  bg-gray-50 shadow-md ">
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
      <nav className="max-w-screen-lg  px-4 py-2 mb-2 ">
        <div className="flex items-center">
          <select className="rounded-sm border-none py-2 sm:px-3 bg-blue-500 text-white rounded-t focus:outline-none focus:ring-2 focus:ring-blue-500-200">
            <option value="All" className="rounded sm:text-sm ">
              All Categories
            </option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home">Home</option>
          </select>
          <ul className="flex sm:ml-4 sm:space-x-4 justify-between text-gray_light">
            <li>
              <Link
                to="/"
                className=" text-black hover:border-blue-500 hover:border-b hover:rounded-b px-3 py-2"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className=" text-blackr hover:border-blue-500 hover:border-b hover:rounded-b sm: px-3 py-2"
              >
                Products
              </Link>
            </li>
            <li>
              <select className="border-none bg-inherit outline-none sm:px-4  hover:bg-blue-500 hover:text-white  rounded focus:outline-none focus:ring-2 focus:ring-blue-500-300">
                <option value="vendors" disabled>
                  Vendors
                </option>
                <option value="/vendor1">Vendor 1</option>
                <option value="/vendor2">Vendor 2</option>
                <option value="/vendor3">Vendor 3</option>
              </select>
            </li>
            <li>
              <select className="border-none bg-inherit outline-none px-4  hover:text-white hover:bg-blue-500  text-black  rounded ">
                <option value="pages" disabled>
                  Pages
                </option>
                <option value="/page1">Page 1</option>
                <option value="/page2">Page 2</option>
                <option value="/page3">Page 3</option>
              </select>
            </li>
            <li>
              <Link
                to="/shop/"
                className="text-black hover:border-blue-500 hover:border-b hover:rounded-b px-3 py-2"
              >
                Shop
              </Link>
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
      <hr className="border-sm border-gray " />
    </div>
  );
};

export default Navigation;
