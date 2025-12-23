import { useState } from 'react';
import styled from 'styled-components';
import ReceptionsCardContainer from '../features/receptionList/ReceptionsCardContainer';
import { FunnelIcon } from '@heroicons/react/24/outline';
import PatientSearchForm from '../features/patients/PatientSearchForm';
import { useReceptionsToday } from '../features/receptionList/useReceptionsToday';
import Spinner from '../ui/Spinner';
import Search from '../features/Search/Search';

const LayoutPatients = styled.div`
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

const PatientsToday = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    // Filter theo ngày hôm nay (local timezone)
    ngay: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0],
  });
  
  const { totalCount, isLoading } = useReceptionsToday({ ...searchParams });
  
  if (isLoading) return <Spinner />;

  function handleSearch(params) {
    setSearchParams({ ...params, ngay: params.ngay || new Date().toISOString().split('T')[0] });
    setIsSearchOpen(false);
  }

  function handleReset() {
    setSearchParams({
      ngay: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0],
    });
    setIsSearchOpen(false);
  }

  function toggleSearch() {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchParams({ ngay: new Date().toISOString().split('T')[0] });
    }
  }

  return (
    <LayoutPatients>
      <LayoutFlex>
        <div className='flex items-center justify-center gap-x-3'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>
            Bệnh Nhân Trong Ngày
          </h2>

          <div className='flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium border rounded-md text-primary border-primary bg-primary-transparent'>
            <span>Tổng bệnh nhân hôm nay:</span>
            <span>{totalCount || 0}</span>
          </div>

          <div className='ml-4'>
            <Search onSearch={setSearchKeyword} />
          </div>
        </div>

        <div className='flex items-center justify-center gap-x-4'>
          {/* Filter */}
          <button
            onClick={toggleSearch}
            className={`flex items-center justify-center p-2 text-sm font-medium border rounded-md shadow-1 gap-x-2 ${
              isSearchOpen
                ? 'bg-primary text-white border-primary'
                : 'bg-white border-grey-transparent text-grey-900'
            }`}
          >
            <FunnelIcon className='w-5 h-5' />
            <span>Tra cứu</span>
          </button>
        </div>
      </LayoutFlex>

      <PatientSearchForm
        isOpen={isSearchOpen}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <ReceptionsCardContainer searchParams={{ ...searchParams }} />
    </LayoutPatients>
  );
};

export default PatientsToday;


