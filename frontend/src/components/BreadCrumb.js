// Breadcrumb.js
import React from "react";
import { Link } from "react-router-dom";
import { useBreadcrumb } from "../contexts/BreadCrumbContext";
import { FaHome, FaAngleRight } from "react-icons/fa";

const Breadcrumb = () => {
  const { breadcrumbs } = useBreadcrumb();

  return (
    <nav className="mb-4">
      <ol className="list-reset flex items-center text-grey-dark">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="flex items-center">
            {index === 0 && <FaHome className="mr-2" />}{" "}
            {/* Home icon only for the first breadcrumb */}
            <Link
              to={breadcrumb.path}
              className="text-blue-600 hover:underline"
            >
              {breadcrumb.label}
            </Link>
            {index < breadcrumbs.length - 1 && (
              <FaAngleRight className="mx-2" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
