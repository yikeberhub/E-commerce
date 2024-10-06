import React, { useState } from "react";
import ListComp from "../../utilities/ListComp";
import Card from "../../utilities/CardComp";

function FilterByTags() {
  const [price, setPrice] = useState(0);
  return (
    <div>
      <Card title="By Price">
        <ListComp>
          <input
            onChange={(e) => setPrice(e.target.value)}
            type="range"
            min={1000}
            value={price}
            max={100000}
            className="w-full"
          />
          <p className="flex flex-row items-center justify-between">
            <span>from: $0.0 </span>
            <span>to:${price}.0</span>
          </p>
        </ListComp>

        <ListComp style={`my-2`}>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="`outline-none rounded-md bg-white border border-gray-500 px-2 text-green-500 py-2 my-2  w-full "
            placeholder="0"
          />
          <button
            type="submit"
            className="bg-blue-500 rounded-md px-2 py-2 mt-2 text-xl font-semibold text-white w-full"
          >
            filter
          </button>
        </ListComp>
      </Card>
    </div>
  );
}

export default FilterByTags;
