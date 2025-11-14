import { FunnelIcon } from '@heroicons/react/24/outline';
import styled from 'styled-components';
import AddReception from '../features/receptionList/AddReception';
import ReiceptionList from '../features/receptionList/ReiceptionList';

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

const Reception = () => {
  return (
    <LayoutDoctors>
      <LayoutFlex>
        <div className='flex items-center justify-center gap-x-3'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>
            Danh sách tiếp nhận
          </h2>

          <div className='flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium border rounded-md text-primary border-primary bg-primary-transparent'>
            <span>Tổng hồ sơ:</span>
            <span>30</span>
          </div>
        </div>

        <div className='flex items-center justify-center gap-x-4'>
          {/* Filter */}
          <div className='flex items-center justify-center p-2 text-sm font-medium bg-white border rounded-md border-grey-transparent shadow-1 gap-x-2 text-grey-900'>
            <FunnelIcon className='w-5 h-5' />
            <span>Filter</span>
          </div>

          <AddReception />
        </div>
      </LayoutFlex>

      <ReiceptionList />
    </LayoutDoctors>
  );
};

export default Reception;
