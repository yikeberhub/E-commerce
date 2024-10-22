import React from "react";

function Card({ title, children }) {
  return (
    <div className="container my-2 px-2 rounded-md bg-gray-200 text-black shadow-sm">
      <h1 className="text-xl py-2 px-2 font-semibold ">{title}</h1>

      {children}
    </div>
  );
}

export default Card;
