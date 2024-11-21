"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";

const SelectContext = createContext({
  value: "",
  onChange: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

export const Select = ({ value, onValueChange, children, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef();

  useEffect(() => {
    const handleClickOutside = event => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider
      value={{
        value,
        onChange: onValueChange,
        isOpen,
        setIsOpen,
      }}
    >
      <div
        ref={selectRef}
        className={`relative ${
          disabled ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children, className }) => {
  const { setIsOpen, isOpen } = useSelectContext();

  return (
    <button
      type="button"
      className={`flex items-center justify-between w-full px-3 py-2 border rounded-md ${className}`}
      onClick={e => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
    >
      {children}
    </button>
  );
};

export const SelectContent = ({ children }) => {
  const { isOpen } = useSelectContext();

  if (!isOpen) return null;

  return (
    <div className="absolute z-50 w-full mt-1 bg-black border rounded-md shadow-lg">
      {children}
    </div>
  );
};

export const SelectItem = ({ children, value }) => {
  const { onChange, setIsOpen } = useSelectContext();

  return (
    <div
      className="px-3 py-2 hover:bg-gray-600 cursor-pointer"
      onClick={e => {
        e.stopPropagation();
        onChange(value);
        setIsOpen(false);
      }}
    >
      {children}
    </div>
  );
};

export const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a Select wrapper");
  }
  return context;
};
