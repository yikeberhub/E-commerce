// Breadcrumb.js
import React from "react";
import { Link } from "react-router-dom";
import { useBreadcrumb } from "../contexts/BreadCrumbContext";

const Breadcrumb = () => {
  const { breadcrumbs } = useBreadcrumb();

  return (
    <nav className="mb-4">
      <ol className="list-reset flex text-grey-dark">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index}>
            <Link
              to={breadcrumb.path}
              className="text-blue-600 hover:underline"
            >
              {breadcrumb.label}
            </Link>
            {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
