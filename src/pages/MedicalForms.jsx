import styled from 'styled-components';
import MedicalFormsContainer from '../features/medicalForm/MedicalFormsContainer';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { usePhieuKhamList } from '../features/medicalForm/usePhieuKhamList';
import Spinner from '../ui/Spinner'
import Search from '../features/Search/Search';
import { useState } from 'react';

const LayoutMedicalForms = styled.div`
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

const MedicalForms = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const { totalCount, isLoading } = usePhieuKhamList({ keyword: searchKeyword });

  if (isLoading) return <Spinner />;

  return (
    <LayoutMedicalForms>
      <LayoutFlex>
        <div className='flex items-center justify-center gap-x-3'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>
            Phiếu Khám
          </h2>

          <div className='flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium border rounded-md text-primary border-primary bg-primary-transparent'>
            <span>Tổng phiếu khám:</span>
            <span>{totalCount}</span>
          </div>

          <div className='ml-4'>
            <Search onSearch={setSearchKeyword} />
          </div>
        </div>

        <div className='flex items-center justify-center gap-x-4'>
          {/* Filter */}
          <div className='flex items-center justify-center p-2 text-sm font-medium bg-white border rounded-md border-grey-transparent shadow-1 gap-x-2 text-grey-900'>
            <FunnelIcon className='w-5 h-5' />
            <span>Filter</span>
          </div>
        </div>
      </LayoutFlex>

      <MedicalFormsContainer searchKeyword={searchKeyword} />
    </LayoutMedicalForms>
  );
};

export default MedicalForms;

