import React from "react";

function Logo({ logo }) {
  return (
    <div className="flex flex-row sm:gap-2 items-center w-full">
      <img src={logo} className="w-8 h-8 hover:w-10 hover:h-10" alt="logo" />
      <h1 className="text-green-500 text-3xl">Electro Shop</h1>
    </div>
  );
}

export default Logo;
