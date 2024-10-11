import { React, useState } from "react";
import ListComp from "../../utilities/ListComp";
import Card from "../../utilities/CardComp";

function FilterByVendor() {
  const [checked, setChecked] = useState(false);

  return (
    <div>
      <Card title="By vendor">
        <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
          <input
            type="checkbox"
            name="vendor"
            value={checked}
            onChange={(e) => setChecked((prev) => !prev)}
          />
          <label className="ml-2">Samsung</label>
        </ListComp>
        <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
          <input
            type="checkbox"
            name="vendor"
            value={checked}
            onChange={(e) => setChecked((prev) => !prev)}
          />
          <label className="ml-2">Dell</label>
        </ListComp>
        <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
          <input
            type="checkbox"
            name="vendor"
            value={checked}
            onChange={(e) => setChecked((prev) => !prev)}
          />
          <label className="ml-2">Synix</label>
        </ListComp>
        <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
          <input
            type="checkbox"
            name="vendor"
            value={checked}
            onChange={(e) => setChecked((prev) => !prev)}
          />
          <label className="ml-2">Lg</label>
        </ListComp>
      </Card>
    </div>
  );
}

export default FilterByVendor;
