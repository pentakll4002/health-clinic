import User from './User';
import { Link } from 'react-router-dom';

import {
  BellIcon,
  CalendarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';


const Header = () => {
  return (
    <header className='flex w-full h-[52px] px-6 py-2 flex-col justify-center items-end gap-[10px] border-b border-grey-transparent bg-white'>
      <div className='flex justify-end items-center flex-[1_0_0] self-stretch'>
        <div className='flex items-center gap-4'>
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
