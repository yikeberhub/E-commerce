import { React, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductLists from "../components/ProductList";
import CategoryLists from "../components/CategoryLists";
import FilterType from "../components/FilterType";
import ProductBanner from "../components/ProductBanner";
import HomeNavLink from "../components/HomeNavLink";
import { ProductContext } from "../contexts/ProductContext";
import SummaryApi from "../common";
import { UserContext } from "../contexts/UserContext";
import { CsrfContext } from "../contexts/CsrfContext";

function Home() {
  const { products, onSetProduct } = useContext(ProductContext);
  const { csrfToken, onSetToken } = useContext(CsrfContext);

  useEffect(() => {
    getProducts();
    // getUser();
  }, []);

  // const getUser = async () => {
  //   try {
  //     const dataResponse = await fetch(SummaryApi.getUser.url, {
  //       method: "POST",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-CSRFToken": csrfToken,
  //       },
  //       body: JSON.stringify({ email: "yike@example.com" }), // Adjust the email accordingly
  //     });

  //     const dataApi = await dataResponse.json();

  //     if (dataApi.success) {
  //       onSetUser(dataApi.user);
  //     } else if (dataApi.error) {
  //       console.log(dataApi.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user:", error);
  //   }
  // };

  const getProducts = async () => {
    const dataResponse = await fetch(SummaryApi.home.url);
    const data = await dataResponse.json();
    const products = data.products;
    const csrf_token = data.csrf_token;

    if (dataResponse.status === 200 && dataResponse.ok) {
      onSetProduct(products);
      onSetToken(csrf_token);
    }

    if (products.error) {
      console.log(products.message);
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
        </div>
      </div>
    </div>
  );
}

export default Home;
