import React from "react";
import ListComp from "../../utilities/ListComp";
import Card from "../../utilities/CardComp";

import Mobile2 from "../../assets/products/mobile/realme Narzo 50 (Speed Blue, 64 GB) (4 GB RAM) 4.webp";
import Camera from "../../assets/products/mobile/realme Narzo 50 (Speed Blue, 64 GB) (4 GB RAM) 4.webp";
import Earphone from "../../assets/products/mobile/realme Narzo 50 (Speed Blue, 64 GB) (4 GB RAM) 4.webp";
import Mobile from "../../assets/products/mobile/realme Narzo 50 (Speed Blue, 64 GB) (4 GB RAM) 4.webp";

function FilterByCategory() {
  return (
    <div className="p-4">
      <Card title="By Category">
        <div className="flex flex-col space-y-3">
          {[
            { label: "Laptop", img: Mobile2 },
            { label: "Camera", img: Camera },
            { label: "Tablet", img: Mobile },
            { label: "Earphone", img: Earphone },
          ].map((item, index) => (
            <ListComp
              key={index}
              style={`text-lg py-2 px-2 border border-gray-200 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300`}
            >
              <p className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  name={item.label.toLowerCase()}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-8 h-8 rounded-md shadow-md"
                />
                <label className="ml-2 text-gray-800 font-semibold hover:text-blue-600 transition-colors duration-200">
                  {item.label}
                </label>
              </p>
            </ListComp>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default FilterByCategory;
