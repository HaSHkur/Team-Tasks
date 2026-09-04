import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchInput: React.FC<Props> = ({ value, onChange, className = "" }) => {
  const [localVal, setLocalVal] = useState(value);

  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  // Debounce search update to avoid excessive URL updates while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localVal !== value) {
        onChange(localVal);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [localVal, value, onChange]);

  const handleClear = () => {
    setLocalVal("");
    onChange("");
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        placeholder="Search tasks..."
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        aria-label="Search tasks"
        className="w-full pl-9 pr-8 py-1.5 text-sm bg-gray-100 border border-transparent rounded-md text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
      />
      {localVal && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search query"
          className="absolute right-2 p-1 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

