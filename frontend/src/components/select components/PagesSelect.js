import React from "react";
import { useNavigate } from "react-router-dom";
import { selectClass } from "../../common/formStyles";

const PagesSelect = () => {
  const navigate = useNavigate();

  const pages = [
    { id: "", title: "Home" },
    { id: "vendors", title: "Vendors" },
    { id: "products", title: "Products" },
    { id: "contact", title: "Contact Us" },
    { id: "categories", title: "Categories" },
  ];

  const handlePageSelect = (pageId) => {
    navigate(`/${pageId}`);
  };

  return (
    <select className={selectClass} onChange={(e) => handlePageSelect(e.target.value)}>
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
