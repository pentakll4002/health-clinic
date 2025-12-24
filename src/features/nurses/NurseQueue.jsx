import { useState } from 'react';
import styled from 'styled-components';
import ReceptionsCardContainer from '../receptionList/ReceptionsCardContainer';
import Spinner from '../../ui/Spinner';
import { useReceptionsToday } from '../receptionList/useReceptionsToday';
import Search from '../Search/Search';

const Layout = styled.div`
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

function NurseQueue() {
  const [searchParams] = useState({});
  const [searchKeyword, setSearchKeyword] = useState('');

  const { totalCount, isLoading } = useReceptionsToday({ ...searchParams });

  if (isLoading) return <Spinner />;

  return (
    <Layout>
      <LayoutFlex>
        <div className='flex items-center justify-center gap-x-3'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>Danh sách chờ</h2>
          <div className='flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium border rounded-md text-primary border-primary bg-primary-transparent'>
            <span>Tổng:</span>
            <span>{totalCount || 0}</span>
          </div>
          <div className='ml-4'>
            <Search onSearch={setSearchKeyword} />
          </div>
        </div>
      </LayoutFlex>

      <ReceptionsCardContainer searchParams={{ ...searchParams, keyword: searchKeyword, nurse_view: true }} />
    </Layout>
  );
}

export default NurseQueue;
