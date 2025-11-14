import { useState } from 'react';
import styled from 'styled-components';
import ReportsContainer from '../features/reports/ReportsContainer';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { useReports } from '../features/reports/useReports';
import AddReport from '../features/reports/AddReport';
import Select from '../ui/Select';

const LayoutReports = styled.div`
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

const Reports = () => {
  const [thang, setThang] = useState('');
  const [nam, setNam] = useState('');
  
  const { totalCount } = useReports({ thang: thang || undefined, nam: nam || undefined });

  // Tạo danh sách tháng (1-12)
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Tạo danh sách năm (năm hiện tại - 5 đến năm hiện tại + 1)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i);

  function handleResetFilter() {
    setThang('');
    setNam('');
  }

  return (
    <LayoutReports>
      <LayoutFlex>
        <div className='flex items-center justify-center gap-x-3'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>
            Báo Cáo Doanh Thu
          </h2>

          <div className='flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium border rounded-md text-primary border-primary bg-primary-transparent'>
            <span>Tổng báo cáo:</span>
            <span>{totalCount}</span>
          </div>
        </div>

        <div className='flex items-center justify-center gap-x-4'>
          {/* Filter */}
          <div className='flex items-center justify-center gap-x-2'>
            <div style={{ minWidth: '120px' }}>
              <Select
                value={thang}
                onChange={(e) => setThang(e.target.value)}
              >
                <option value=''>Tất cả tháng</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    Tháng {month}
                  </option>
                ))}
              </Select>
            </div>

            <div style={{ minWidth: '120px' }}>
              <Select
                value={nam}
                onChange={(e) => setNam(e.target.value)}
              >
                <option value=''>Tất cả năm</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </div>

            {(thang || nam) && (
              <button
                onClick={handleResetFilter}
                className='px-3 py-2 text-sm font-medium text-grey-700 bg-grey-100 border rounded-md border-grey-transparent hover:bg-grey-200'
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* New Report */}
          <AddReport />
        </div>
      </LayoutFlex>

      <ReportsContainer thang={thang || undefined} nam={nam || undefined} />
    </LayoutReports>
  );
};

export default Reports;

