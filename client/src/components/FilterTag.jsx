import React from "react";
import { X } from "lucide-react";

const FilterTag = ({ label, onRemove, color }) => {
  return (
    <div
      className={`${color} flex items-center gap-1 px-2 py-0.5 rounded-full text-sm`}
    >
      <span className="capitalize">{label}</span>
      <button onClick={onRemove} className="hover:text-white-500 text-xs">
        <X size={16} />
      </button>
    </div>
  );
};

export default FilterTag;
