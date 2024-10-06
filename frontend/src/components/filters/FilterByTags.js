import React from "react";
import ListComp from "../../utilities/ListComp";
import Card from "../../utilities/CardComp";

function FilterByPrice() {
  return (
    <div>
      <Card title="Popular Tags">
        <div className="grid grid-col grid-cols-2">
          <ListComp style={`my-2`}>
            <button className="text-lg rounded-full px-3 py-1 my-2 text-green-600 border ">
              <span className="text-2xl mr-2">&times;</span> <span>Rogas</span>
            </button>
          </ListComp>
          <ListComp style={`my-2`}>
            <button className="text-lg rounded-full px-3 py-1 text-green-600 border">
              <span className="text-2xl mr-2">&times;</span> <span>Lenovo</span>
            </button>
          </ListComp>
          <ListComp style={`my-2`}>
            <button className="text-lg rounded-full px-3 py-1 text-green-600 border">
              <span className="text-2xl mr-2">&times;</span> <span>Dell</span>
            </button>
          </ListComp>
          <ListComp style={`my-2`}>
            <button className="text-lg rounded-full px-3 py-1 text-green-600 border">
              <span className="text-2xl mr-2">&times;</span>{" "}
              <span>Samsung</span>
            </button>
          </ListComp>
        </div>
      </Card>
    </div>
  );
}

export default FilterByPrice;
