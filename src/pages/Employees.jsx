import styled from 'styled-components';
import EmployeesContainer from '../features/employee/EmployeesContainer';
import Search from '../features/Search/Search';
import { FunnelIcon } from '@heroicons/react/24/outline';
import Spinner from '../ui/Spinner';
import { useEmployees } from '../features/employee/useEmployees';
import AddEmployee from '../features/employee/AddEmployee';
import { useSearchParams } from 'react-router-dom';

const Layout = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f5f6f8;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    color: #4f46e5;
    background: rgba(79, 70, 229, 0.1);
    border-radius: 8px;
  }
`;

function Employees() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { totalCount, isLoading } = useEmployees();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center w-full h-full'>
        <Spinner />
      </div>
    );
  }

  return (
    <Layout>
      <Header>
        <div className='flex items-center gap-4'>
          <Stat>
            <h2>Nhân viên</h2>
            <span className='badge'>
              <span>Tổng:</span>
              <strong>{totalCount ?? 0}</strong>
            </span>
          </Stat>
          <Search
            onSearch={(value) => {
              const next = new URLSearchParams(searchParams);
              const keyword = value.trim();

              next.delete('page');
              if (!keyword) {
                next.delete('search');
              } else {
                next.set('search', keyword);
              }
              setSearchParams(next);
            }}
          />
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex items-center justify-center p-2 text-sm font-medium bg-white border rounded-md border-grey-transparent shadow-1 gap-x-2 text-grey-900'>
            <FunnelIcon className='w-5 h-5' />
            <span>Bộ lọc</span>
          </div>
          <AddEmployee />
        </div>
      </Header>

      <EmployeesContainer />
    </Layout>
  );
}

export default Employees;

