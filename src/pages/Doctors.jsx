import styled from 'styled-components';
import DoctorsCardContainer from '../features/doctors/DoctorsCardContainer';

import { FunnelIcon } from '@heroicons/react/24/outline';
import AddDoctor from '../features/doctors/AddDoctor';
import { useDoctors } from '../features/doctors/useDoctors';
import Spinner from '../ui/Spinner';
import Search from '../features/Search/Search';

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
  const { totalCount, isLoading } = useDoctors();

  if (isLoading) return <Spinner />;

  return (
    <LayoutDoctors>
      <LayoutFlex>
        <div className='flex items-center justify-center gap-x-3'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>
            Bác sĩ
          </h2>

          <div className='flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium border rounded-md text-primary border-primary bg-primary-transparent'>
            <span>Tổng bác sĩ:</span>
            <span>{totalCount}</span>
          </div>
          <div className='ml-4'>
            <Search />
          </div>
        </div>

        <div className='flex items-center justify-center gap-x-4'>
          {/* Filter */}
          <div className='flex items-center justify-center p-2 text-sm font-medium bg-white border rounded-md border-grey-transparent shadow-1 gap-x-2 text-grey-900'>
            <FunnelIcon className='w-5 h-5' />
            <span>Filter</span>
          </div>

          {/* New doctors */}
          <AddDoctor />
        </div>
      </LayoutFlex>

      <DoctorsCardContainer />
    </LayoutDoctors>
  );
};

export default Doctors;
