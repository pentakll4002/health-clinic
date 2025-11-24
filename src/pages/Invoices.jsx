import styled from 'styled-components';
import InvoicesContainer from '../features/invoices/InvoicesContainer';
import { useInvoices } from '../features/invoices/useInvoices';
import AddInvoice from '../features/invoices/AddInvoice';
import Spinner from '../ui/Spinner';
import Search from '../features/Search/Search';
import { useState } from 'react';
import Filter from '../ui/Filter';

const LayoutInvoices = styled.div`
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

const Invoices = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const { totalCount, isLoading } = useInvoices({ keyword: searchKeyword });

  if (isLoading) return <Spinner />;

  return (
    <LayoutInvoices>
      <LayoutFlex>
        <div className='flex items-center justify-center gap-x-3'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>
            Hoá Đơn
          </h2>

          <div className='flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium border rounded-md text-primary border-primary bg-primary-transparent'>
            <span>Tổng hoá đơn:</span>
            <span>{totalCount}</span>
          </div>

          <div className='ml-4'>
            <Search onSearch={setSearchKeyword} />
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

          {/* New Invoice */}
          <AddInvoice />
        </div>
      </LayoutFlex>

      <InvoicesContainer searchKeyword={searchKeyword} />
    </LayoutInvoices>
  );
};

export default Invoices;


