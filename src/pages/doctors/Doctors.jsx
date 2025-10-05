import styled from 'styled-components';
import DoctorsCardContainer from './DoctorsCardContainer';

import {
  FunnelIcon,
  ListBulletIcon,
  PlusIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

const LayoutDoctors = styled.div`
  width: full;
  height: 100%;
  padding: 20px;
  background-color: #f5f6f8;
`;

const LayoutFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Doctors = () => {
  return (
    <LayoutDoctors>
      <LayoutFlex>
        <div className='flex items-center justify-center gap-x-3'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>
            Doctor grid
          </h2>

          <div className='flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium border rounded-md text-primary border-primary bg-primary-transparent'>
            <span>Total Doctor:</span>
            <span>565</span>
          </div>
        </div>

        <div className='flex items-center justify-center gap-x-4'>
          {/* Filter */}
          <div className='flex items-center justify-center p-2 text-sm font-medium bg-white border rounded-md border-grey-transparent shadow-1 gap-x-2 text-grey-900'>
            <FunnelIcon className='w-5 h-5' />
            <span>Filter</span>
          </div>

          <div className='flex items-center justify-center p-1 bg-white border rounded-md gap-x-2 border-grey-transparent shadow-1'>
            <span className='p-1'>
              <ListBulletIcon className='w-5 h-5' />
            </span>
            <span className='p-1 bg-light'>
              <Squares2X2Icon className='w-5 h-5' />
            </span>
          </div>

          {/* New doctors */}
          <button
            className=' py-[6px] px-[10px] bg-primary rounded-md flex items-center justify-center gap-x-2 text-white text-sm font-semibold'
            onClick={() => {}}
          >
            <PlusIcon className='w-5 h-5' />
            <span>New Doctor</span>
          </button>
        </div>
      </LayoutFlex>

      <DoctorsCardContainer />
    </LayoutDoctors>
  );
};

export default Doctors;
