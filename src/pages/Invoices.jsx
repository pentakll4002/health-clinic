import styled from 'styled-components';
import InvoicesContainer from '../features/invoices/InvoicesContainer';
import { useInvoices } from '../features/invoices/useInvoices';
import AddInvoice from '../features/invoices/AddInvoice';
import Spinner from '../ui/Spinner';
import { useState } from 'react';

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
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const {
    invoices,
    totalCount,
    isLoading,
  } = useInvoices({
    date_from: dateFrom,
    date_to: dateTo,
  });

  return (
    <LayoutInvoices>
      <LayoutFlex>
        <div className="flex items-center gap-x-3">
          <h2 className="text-xl font-bold text-grey-900">Hoá Đơn</h2>

          <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-md text-primary border-primary bg-primary-transparent">
            <span>Tổng hoá đơn:</span>
            <span>{totalCount}</span>
          </div>

          {/* FILTER NGÀY */}
          <div className="flex items-center gap-2 ml-4">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border px-2 py-1 rounded"
            />

            <span>→</span>

            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border px-2 py-1 rounded"
            />

            {(dateFrom || dateTo) && (
              <button
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                }}
                className="text-sm text-red-500 ml-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <AddInvoice />
      </LayoutFlex>

      {isLoading ? (
        <Spinner />
      ) : (
        <InvoicesContainer invoices={invoices} />
      )}
    </LayoutInvoices>
  );
};

export default Invoices;
