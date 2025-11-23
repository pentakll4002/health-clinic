import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

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
    <div className="relative w-[320px] shadow-1 flex items-center">
      <MagnifyingGlassIcon
        className="absolute z-10 w-4 h-4 text-indigo-500 transition-colors duration-150 -translate-y-1/2 left-3 top-1/2 peer-focus:text-indigo-700"
      />
      <input
        className="w-full h-9 pl-9 pr-9 py-1.5 rounded-lg border border-grey-transparent bg-white focus:bg-indigo-50 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none shadow-1 hover:shadow-sm transition-all placeholder:text-gray-400 text-gray-800 text-sm font-normal"
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
          className="absolute text-gray-400 -translate-y-1/2 right-2 top-1/2 hover:text-red-500 focus:outline-none"
        >
          <XMarkIcon className='w-5 h-5' />
        </button>
      )}
    </div>
  );
};

export default Search;
