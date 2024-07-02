import "../data";

import React from "react";

function ListComp({ style, children }) {
  return <p className={style}>{children}</p>;
}

export default ListComp;
