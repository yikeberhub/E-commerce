import "../data";

import React from "react";

function ListComp({ style, children }) {
  return <div className={style}>{children}</div>;
}

export default ListComp;
