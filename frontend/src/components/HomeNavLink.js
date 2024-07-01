import React from "react";

function HomeNavLink() {
  return (
    <div className="flex flex-row justify-between mx-2 container-md my-2 py-2">
      <h1 className="text-2xl font-semibold py-2 px-2">Popular Products</h1>
      <ul className="flex flex-row justify-between items-center mx-2 py-2 gap-2">
        <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
          All
        </li>

        <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
          Computers & Mobiles
        </li>

        <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
          Cameras
        </li>
        <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
          Watches
        </li>
        <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
          Earphones
        </li>
      </ul>
    </div>
  );
}

export default HomeNavLink;
