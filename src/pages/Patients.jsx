import { useState } from 'react';
import styled from 'styled-components';
import PatientsCardContainer from '../features/patients/PatientsCardContainer';
import { FunnelIcon } from '@heroicons/react/24/outline';
import AddPatient from '../features/patients/AddPatient';
import PatientSearchForm from '../features/patients/PatientSearchForm';
import { usePatients } from '../features/patients/usePatients';

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

const Patients = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  
  // Lấy totalCount để hiển thị (React Query sẽ cache nên không có vấn đề gì)
  const { totalCount } = usePatients(searchParams);

  function handleSearch(params) {
    setSearchParams(params);
    setIsSearchOpen(false);
  }

  function handleReset() {
    setSearchParams({});
    setIsSearchOpen(false);
  }

  function toggleSearch() {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchParams({});
    }
  }

  return (
    <LayoutPatients>
      <LayoutFlex>
        <div className='flex items-center justify-center gap-x-3'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>
            Bệnh Nhân
          </h2>

          <div className='flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium border rounded-md text-primary border-primary bg-primary-transparent'>
            <span>Tổng bệnh nhân:</span>
            <span>{totalCount || 0}</span>
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


          {/* New patient */}
          <AddPatient />
        </div>
      </LayoutFlex>

      <PatientSearchForm
        isOpen={isSearchOpen}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <PatientsCardContainer searchParams={searchParams} />
    </LayoutPatients>
  );
};

export default Patients;
