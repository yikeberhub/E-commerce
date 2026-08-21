import React, { useContext, useEffect, useState } from "react";
import { FiTag } from "react-icons/fi";
import Card from "../../utilities/CardComp";
import Checkbox from "../../common/Checkbox";
import { ProductContext } from "../../contexts/ProductContext";

function FilterByVendor() {
  const { products, onFilterProducts } = useContext(ProductContext);
  const [checkedVendors, setCheckedVendors] = useState({});

  useEffect(() => {
    const vendors = [
      ...new Set(products.map((product) => product?.vendor?.title)),
    ].filter(Boolean);
    const initialChecked = vendors.reduce((acc, vendor) => {
      acc[vendor] = false;
      return acc;
    }, {});

    setCheckedVendors(initialChecked);
  }, [products]);

  const handleCheckboxChange = (vendor) => {
    setCheckedVendors((prev) => {
      const newChecked = { ...prev, [vendor]: !prev[vendor] };
      applyFilter(newChecked);
      return newChecked;
    });
  };

  const applyFilter = (checkedVendorsState) => {
    const selectedVendors = Object.keys(checkedVendorsState).filter(
      (vendor) => checkedVendorsState[vendor]
    );

    const filteredProducts =
      selectedVendors.length === 0
        ? products
        : products.filter((product) =>
            selectedVendors.includes(product?.vendor?.title)
          );

    onFilterProducts(filteredProducts);
  };

  return (
    <Card title="Vendor" icon={<FiTag />}>
      <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto pr-1">
        {Object.keys(checkedVendors).map((vendor) => (
          <Checkbox
            key={vendor}
            checked={checkedVendors[vendor]}
            onChange={() => handleCheckboxChange(vendor)}
            label={vendor}
          />
        ))}
      </div>
    </Card>
  );
}

export default FilterByVendor;
