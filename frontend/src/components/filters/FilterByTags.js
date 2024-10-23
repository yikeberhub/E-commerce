import React from "react";
import ListComp from "../../utilities/ListComp";
import Card from "../../utilities/CardComp";

function FilterByPrice() {
  return (
    <div>
      <Card title="Popular Tags">
        <div className="grid grid-cols-2 gap-2">
          {["Rogas", "Lenovo", "Dell", "Samsung"].map((tag, index) => (
            <ListComp key={index}>
              <button className="flex w-fit items-center text-sm rounded-full px-2  text-white bg-green-500 border-gray-500 border-transparent hover:bg-green-700 transition-colors duration-200">
                <span className="text-2xl mr-2">&times;</span>
                <span>{tag}</span>
              </button>
            </ListComp>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default FilterByPrice;
