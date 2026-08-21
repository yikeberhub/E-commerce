import React from "react";
import { selectClass } from "../../common/formStyles";

const DiscountFilter = ({ selectedDiscount, onDiscountChange }) => {
  return (
    <select
      value={selectedDiscount}
      onChange={(e) => onDiscountChange(e.target.value)}
      className={selectClass}
    >
      <option value="">All Discounts</option>
      <option value="0">No Discount</option>
      <option value="10">10% Off</option>
      <option value="20">20% Off</option>
      <option value="30">30% Off</option>
      <option value="50">50% Off</option>
    </select>
  );
};

export default DiscountFilter;
