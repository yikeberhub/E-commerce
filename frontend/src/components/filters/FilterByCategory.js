import React from "react";
import ListComp from "../../utilities/ListComp";
import Card from "../../utilities/CardComp";

import Mobile2 from "../../assets/products/mobile/realme Narzo 50 (Speed Blue, 64 GB) (4 GB RAM) 4.webp";
import Camera from "../../assets/products/mobile/realme Narzo 50 (Speed Blue, 64 GB) (4 GB RAM) 4.webp";
import Earphone from "../../assets/products/mobile/realme Narzo 50 (Speed Blue, 64 GB) (4 GB RAM) 4.webp";
import Mobile from "../../assets/products/mobile/realme Narzo 50 (Speed Blue, 64 GB) (4 GB RAM) 4.webp";

function FilterByCategory() {
  return (
    <div>
      <Card title="By Category">
        <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
          <p className="flex flex-row items-center gap-3">
            <input type="checkbox" name="vendor" />
            <img src={Mobile2} alt="img" className="w-7 h-7 rounded-md" />
            <label className="ml-2">Laptop</label>
          </p>
        </ListComp>
        <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
          <p className="flex flex-row items-center gap-3">
            <input type="checkbox" name="vendor" />
            <img src={Camera} alt="img" className="w-7 h-7 rounded-md" />
            <label className="ml-2">Camera</label>
          </p>
        </ListComp>
        <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
          <p className="flex flex-row items-center gap-3">
            <input type="checkbox" name="vendor" />
            <img src={Mobile} alt="img" className="w-7 h-7 rounded-md" />
            <label className="ml-2">Tablet</label>
          </p>
        </ListComp>
        <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
          <p className="flex flex-row items-center gap-3">
            <input type="checkbox" name="vendor" />
            <img src={Earphone} alt="img" className="w-7 h-7 rounded-md" />
            <label className="ml-2">Earphone</label>
          </p>
        </ListComp>
      </Card>
    </div>
  );
}

export default FilterByCategory;
