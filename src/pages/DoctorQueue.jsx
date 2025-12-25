import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Spinner from '../ui/Spinner';
import Search from '../features/Search/Search';
import { useReceptionsToday } from '../features/receptionList/useReceptionsToday';
import DoctorQueueList from '../features/doctorWorkflow/DoctorQueueList';

const LayoutDoctorQueue = styled.div`
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

const DoctorQueue = () => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const params = useMemo(() => {
    return {
      ngay: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0],
    };
  }, []);

  const { receptions, isLoading, totalCount, refetch } = useReceptionsToday(params);

  if (isLoading) return <Spinner />;

  return (
    <LayoutDoctorQueue>
      <LayoutFlex>
        <div className='flex items-center justify-center gap-x-3'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>Danh sách chờ khám</h2>

          <div className='flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium border rounded-md text-primary border-primary bg-primary-transparent'>
            <span>Tổng:</span>
            <span>{totalCount || 0}</span>
          </div>

          <div className='ml-4'>
            <Search onSearch={setSearchKeyword} />
          </div>
        </div>
      </LayoutFlex>

      <DoctorQueueList receptions={receptions} keyword={searchKeyword} onRefresh={refetch} />
    </LayoutDoctorQueue>
  );
};

export default DoctorQueue;
