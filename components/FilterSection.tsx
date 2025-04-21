"use client";
import { Settings2 } from "lucide-react";
import React, { useState } from "react";

const FilterSection = () => {
  const [openCategories, setOpenCategories] = useState(true);
  const [openSize, setOpenSize] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);

  return (
    <div className="w-[25%] p-6 border-r min-h-screen hidden md:block">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Settings2 /> Filters
      </h2>

      <div className="space-y-6">
        {/* Categories Filter */}
        <FilterGroup
          title="Categories"
          isOpen={openCategories}
          onToggle={() => setOpenCategories(!openCategories)}
        >
          {[
            "Glass Globe Linear Chandeliers",
            "Spiral Raindrop Chandeliers",
            "Crystal Ring Chandeliers",
          ].map((label) => (
            <CheckboxItem key={label} label={label} />
          ))}
        </FilterGroup>

        {/* Size Filter */}
        <FilterGroup
          title="Size"
          isOpen={openSize}
          onToggle={() => setOpenSize(!openSize)}
        >
          {["Small", "Medium", "Large"].map((label) => (
            <CheckboxItem key={label} label={label} />
          ))}
        </FilterGroup>

        {/* Price Filter */}
        <FilterGroup
          title="Price Range"
          isOpen={openPrice}
          onToggle={() => setOpenPrice(!openPrice)}
        >
          <input type="range" min="0" max="1000" className="w-full" />
          <div className="flex justify-between text-sm mt-2">
            <span>$0</span>
            <span>$1000</span>
          </div>
        </FilterGroup>
      </div>
    </div>
  );
};

const FilterGroup = ({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-semibold text-lg">{title}</h3>
      <button onClick={onToggle} className="text-gray-600">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d={isOpen ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
    {isOpen && <div className="space-y-2">{children}</div>}
  </div>
);

const CheckboxItem = ({ label }: { label: string }) => (
  <label className="flex items-center gap-2 text-sm">
    <input type="checkbox" /> {label}
  </label>
);

export default FilterSection;
