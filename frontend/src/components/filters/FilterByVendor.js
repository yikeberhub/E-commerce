import { React, useState } from "react";
import ListComp from "../../utilities/ListComp";
import Card from "../../utilities/CardComp";

function FilterByVendor() {
  const [checkedVendors, setCheckedVendors] = useState({
    Samsung: false,
    Dell: false,
    Synix: false,
    Lg: false,
  });

  const handleCheckboxChange = (vendor) => {
    setCheckedVendors((prev) => ({
      ...prev,
      [vendor]: !prev[vendor],
    }));
  };

  return (
    <div>
      <Card title="By Vendor">
        {Object.keys(checkedVendors).map((vendor) => (
          <ListComp
            key={vendor}
            style="text-lg py-2 px-2 border rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <input
              type="checkbox"
              name={vendor}
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
