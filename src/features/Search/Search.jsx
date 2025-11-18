import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Search = () => {
  return (
    <div className="relative w-[320px] drop-shadow-lg">
      <MagnifyingGlassIcon
        className="absolute w-5 h-5 left-4 top-1/2 -translate-y-1/2 text-indigo-500 peer-focus:text-indigo-700 transition-colors duration-150 z-10"
      />
      <input
        className="peer w-220 h-8 pl-12 pr-4 py-2 rounded-xl border-2 border-transparent bg-white focus:bg-indigo-50 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none shadow-md hover:shadow-xl transition-all placeholder:text-gray-400 text-gray-800 text-base font-medium"
        name="search"
        type="text"
        placeholder="Tìm kiếm..."
      />
    </div>
  );
};

export default Search;
