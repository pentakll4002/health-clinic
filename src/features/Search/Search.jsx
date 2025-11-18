import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';

const Search = ({ onSearch }) => {
  const [value, setValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.trim() !== "") {
      if (onSearch) onSearch(value.trim());
    }
  };

  const handleReset = () => {
    setValue("");
    if (onSearch) onSearch("");
  };

  return (
    <div className="relative w-[220px] drop-shadow-lg flex items-center">
      <MagnifyingGlassIcon
        className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-indigo-500 peer-focus:text-indigo-700 transition-colors duration-150 z-10"
      />
      <input
        className="peer w-full h-9 pl-9 pr-9 py-1.5 rounded-lg border-2 border-transparent bg-white focus:bg-indigo-50 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none shadow-md hover:shadow-xl transition-all placeholder:text-gray-400 text-gray-800 text-sm font-normal"
        name="search"
        type="text"
        placeholder="Tìm kiếm..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {value !== "" && (
        <button
          tabIndex={-1}
          type="button"
          onClick={handleReset}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
        >
          <span className="text-lg">×</span>
        </button>
      )}
    </div>
  );
};

export default Search;
