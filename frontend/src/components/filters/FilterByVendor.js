import React, { useContext, useEffect, useState } from "react";
import ListComp from "../../utilities/ListComp";
import Card from "../../utilities/CardComp";
import { ProductContext } from "../../contexts/ProductContext";

function FilterByVendor() {
  const { products, onFilterProducts } = useContext(ProductContext);
  const [checkedVendors, setCheckedVendors] = useState({});

  useEffect(() => {
    const vendors = [
      ...new Set(products.map((product) => product?.vendor?.title)),
    ];
    console.log("checked vendors", checkedVendors);
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
    // Get selected vendors
    const selectedVendors = Object.keys(checkedVendorsState).filter(
      (vendor) => checkedVendorsState[vendor]
    );

    console.log("selected vebdors,", selectedVendors);

    const filteredProducts =
      selectedVendors.length === 0
        ? products
        : products.filter((product) =>
            selectedVendors.includes(product?.vendor?.title)
          );

    handleFilter(filteredProducts);
  };

  const handleFilter = (filteredProducts) => {
    onFilterProducts(filteredProducts);
  };

  return (
    <div>
      <Card title="By Vendor">
        {Object.keys(checkedVendors).map((vendor) => (
          <ListComp
            key={vendor}
            style={`text-lg py-2 px-2 border rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300`}
          >
            <input
              type="checkbox"
              name={vendor.title}
              checked={checkedVendors[vendor]}
              onChange={() => handleCheckboxChange(vendor)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-gray-800 font-medium">{vendor}</label>
          </ListComp>
        ))}
      </Card>
    </div>
  );
}

export default FilterByVendor;
