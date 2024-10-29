// DiscountFilter.js
import React from "react";

const DiscountFilter = ({ selectedDiscount, onDiscountChange }) => {
  return (
    <div className="flex space-x-4 mb-4">
      <select
        value={selectedDiscount}
        onChange={(e) => onDiscountChange(e.target.value)}
        className="border p-2"
      >
        <option value="">All Discounts</option>
        <option value="0">No Discount</option>
        <option value="10">10% Off</option>
        <option value="20">20% Off</option>
        <option value="30">30% Off</option>
        <option value="50">50% Off</option>
      </select>
    </div>
  );
};

export default DiscountFilter;
