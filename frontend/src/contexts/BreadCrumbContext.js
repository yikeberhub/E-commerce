// BreadcrumbContext.js
import React, { createContext, useContext, useState } from "react";

const BreadcrumbContext = createContext([]);

export const BreadcrumbProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const addBreadcrumb = (breadcrumb) => {
    setBreadcrumbs((prev) => [...prev, breadcrumb]);
  };

  const clearBreadcrumbs = () => {
    setBreadcrumbs([]);
  };

  return (
    <BreadcrumbContext.Provider
      value={{ breadcrumbs, addBreadcrumb, clearBreadcrumbs }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => {
  return useContext(BreadcrumbContext);
};
