import React from "react";
import { FiCheck } from "react-icons/fi";

const Checkbox = ({ checked, onChange, label, sublabel, icon }) => (
  <label className="flex items-center gap-2.5 py-1.5 px-1.5 rounded-md hover:bg-slate-50 cursor-pointer transition group">
    <span className="relative inline-flex shrink-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className="w-[18px] h-[18px] rounded-md border-2 border-slate-300 flex items-center justify-center
          peer-checked:bg-primary-600 peer-checked:border-primary-600
          peer-focus-visible:ring-2 peer-focus-visible:ring-primary-300
          transition-colors duration-150"
      >
        {checked && <FiCheck className="text-white text-xs" strokeWidth={3} />}
      </span>
    </span>
    {icon}
    <span className="text-sm text-slate-700 flex-1 truncate group-hover:text-slate-900">
      {label}
    </span>
    {sublabel}
  </label>
);

export default Checkbox;
