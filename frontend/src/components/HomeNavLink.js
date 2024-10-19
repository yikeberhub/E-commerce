import React from "react";

function HomeNavLink() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mx-2 container-md my-4 py-4">
      <h1 className="text-3xl font-bold text-gray-800 py-2">
        Popular Products
      </h1>
      <ul className="flex flex-row justify-between items-center mx-2 py-2 gap-4">
        {["All", "Computers & Mobiles", "Cameras", "Watches", "Earphones"].map(
          (item, index) => (
            <li
              key={index}
              className="text-lg hover:text-xl hover:cursor-pointer hover:border-b-2 hover:border-b-yellow-400 hover:rounded-b-md font-semibold px-2 py-2 text-gray-600 transition-all duration-200 ease-in-out"
            >
              {item}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default HomeNavLink;
