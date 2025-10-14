import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Search = () => {
  return (
    <div className='relative w-[250px]'>
      <MagnifyingGlassIcon className='absolute w-5 h-5 -translate-y-1/2 text-grey-300 left-3 top-1/2' />

      <input
        className='w-full h-8 pl-10 pr-3 py-[6px] rounded-md border border-grey-transparent bg-white shadow-1 placeholder:text-grey-300 text-sm placeholder:text-sm text-dark'
        name='search'
        type='text'
        placeholder='Search'
      />
    </div>
  );
};

export default Search;
