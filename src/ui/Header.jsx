
import User from './User';
import { Link } from 'react-router-dom';

import {
  BellIcon,
  CalendarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

import { ChartSg } from '../constants/Global';
import Search from '../features/Search/Search';

const Header = () => {
  return (
    <header className='flex w-full h-[52px] px-6 py-2 flex-col justify-center items-start gap-[10px] border-b border-grey-transparent bg-white'>
      <div className='flex justify-between items-center flex-[1_0_0] self-stretch'>
        <Search />

        <div className='flex items-center gap-4'>
          <button className='flex items-center h-[32px] py-[6px] px-[10px] rounded-md bg-button--header text-white text-[13px] font-semibold gap-1'>
            <span>AI Assistance</span>
            <ChartSg />
          </button>

          <div className='flex items-center gap-2'>
            <Link to='/' className='p-[8px] rounded-[20px] shadow-1 bg-light'>
              <CalendarIcon className='w-6 h-6 ' />
            </Link>

            <Link
              to='/'
              className='p-[8px] rounded-[20px] shadow-1 bg-white border-grey-transparent border'
            >
              <Cog6ToothIcon className='w-6 h-6 ' />
            </Link>

            <Link
              to='/'
              className='p-[8px] rounded-[20px] shadow-1 bg-white border border-grey-transparent'
            >
              <BellIcon className='w-6 h-6 ' />
            </Link>
          </div>

          <User />
        </div>
      </div>
    </header>
  );
};

export default Header;
