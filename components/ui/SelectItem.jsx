"use client";

import { useSelectContext } from "./Select";

const SelectItem = ({ value, children }) => {
  const { onChange, setIsOpen, value: selectedValue } = useSelectContext();

  const handleClick = () => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
        selectedValue === value ? "bg-blue-50" : ""
      }`}
    >
      {children}
    </div>
  );
};

export default SelectItem;
