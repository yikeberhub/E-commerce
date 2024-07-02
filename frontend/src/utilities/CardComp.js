import React from "react";

function Card({ title, children }) {
  return (
    <div className="container px-auto py-2 mx-2 px-2 rounded shadow-md ">
      <h1 className="text-xl py-2 px-2 font-semibold text-slate-500">
        {title}
      </h1>

      {children}
    </div>
  );
}

export default Card;
