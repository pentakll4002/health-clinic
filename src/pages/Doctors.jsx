import styled from 'styled-components';
import { useState } from 'react';
import classNames from '../utils/classNames';
import DoctorsCardContainer from '../features/doctors/DoctorsCardContainer';

import {
  FunnelIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import AddDoctor from '../features/doctors/AddDoctor';

const LayoutDoctors = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f5f6f8;
`;

const LayoutFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Doctors = () => {
  const [layout, setLayout] = useState('grid');

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
            <button
              className={classNames(
                'p-1 cursor-pointer ',
                layout === 'list' ? 'bg-light' : ''
              )}
              onClick={() => {
                setLayout('list');
              }}
            >
              <ListBulletIcon className='w-5 h-5' />
            </button>
            <button
              className={classNames(
                'p-1 cursor-pointer ',
                layout === 'grid' ? 'bg-light' : ''
              )}
              onClick={() => {
                setLayout('grid');
              }}
            >
              <Squares2X2Icon className='w-5 h-5' />
            </button>
          </div>

          {/* New doctors */}
          <AddDoctor />
        </div>
      </LayoutFlex>

      <DoctorsCardContainer layout={layout} />
    </LayoutDoctors>
  );
};

export default Doctors;
