import React, { useContext } from "react";
import { AuthContext, useAuth } from "../../contexts/AuthContext";

function Logo({ logo }) {
  const { user } = useContext(AuthContext);
  // const { id, username, email } = user;
  return (
    <div className="flex flex-row sm:gap-2 items-center w-full">
      <img src={logo} className="w-8 h-8 hover:w-10 hover:h-10" alt="logo" />
      {/* <h1 className="text-3xl text-green-500 ">Electro Shop</h1> */}
      <p className="ml-3 font-semibold text-yellow-500">
        Welcome
        <span className="text-green-500 "></span>
      </p>
    </div>
  );
}

export default Logo;
