import styled from 'styled-components';
import DoctorsCardContainer from '../features/doctors/DoctorsCardContainer';

import { FunnelIcon } from '@heroicons/react/24/outline';
import AddDoctor from '../features/doctors/AddDoctor';
import { useDoctors } from '../features/doctors/useDoctors';
import Spinner from '../ui/Spinner';
import Search from '../features/Search/Search';
import Filter from '../ui/Filter';

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
          <Filter
            filterField='status'
            options={[
              { value: 'Tất cả', label: 'All' },
              { value: '', label: '' },
              { value: '', label: '' },
              { value: '', label: '' },
            ]}
          />

          {/* New doctors */}
          <AddDoctor />
        </div>
      </LayoutFlex>

      <DoctorsCardContainer />
    </LayoutDoctors>
  );
};

export default Doctors;
