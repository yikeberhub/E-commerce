import React from "react";
import { useNavigate } from "react-router-dom";

const PagesSelect = () => {
  const navigate = useNavigate();

  // Manually defined pages
  const pages = [
    { id: "", title: "Home" },
    { id: "vendors", title: "Vendors" },
    { id: "products", title: "Products" },
    { id: "contact-us", title: "Contact Us" },
  ];

  const handlePageSelect = (pageId) => {
    if (pageId) {
      navigate(`/${pageId}`);
    }
  };

  return (
    <select
      className="rounded border px-2 py-1"
      onChange={(e) => handlePageSelect(e.target.value)}
    >
      <option value="">Select a page</option>
      {pages.map((page) => (
        <option key={page.id} value={page.id}>
          {page.title}
        </option>
      ))}
    </select>
  );
};

export default PagesSelect;
