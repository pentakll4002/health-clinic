import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import DrugCardContainer from '../features/drug/DrugCardContainer';
import DrugReportsContainer from '../features/drug/DrugReportsContainer';
import { FunnelIcon } from '@heroicons/react/24/outline';
import AddDrug from '../features/drug/AddDrug';
import AddDrugReport from '../features/drug/AddDrugReport';
import { useDrugs } from '../features/drug/useDrugs';
import { useDrugReports } from '../features/drug/useDrugReports';
import Select from '../ui/Select';
import { useQuery } from '@tanstack/react-query';
import { getDrugs } from '../features/drug/APIDrugs';
import Spinner from '../ui/Spinner';
import Search from '../features/Search/Search';

const LayoutDrugs = styled.div`
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

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e7e8eb;
`;

const Tab = styled.button`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.active ? '#3b82f6' : '#6b7280'};
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  cursor: pointer;
  margin-bottom: -2px;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.active ? '#3b82f6' : '#374151'};
  }
`;

const Drugs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'drugs';
  const [activeTab, setActiveTab] = useState(tabFromUrl); // 'drugs' or 'reports'
  const [thang, setThang] = useState('');
  const [nam, setNam] = useState('');
  const [idThuoc, setIdThuoc] = useState('');

  // Sync tab with URL params
  useEffect(() => {
    const tab = searchParams.get('tab') || 'drugs';
    setActiveTab(tab);
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const newSearchParams = new URLSearchParams(searchParams);
    if (tab === 'reports') {
      newSearchParams.set('tab', 'reports');
    } else {
      newSearchParams.delete('tab');
    }
    setSearchParams(newSearchParams);
  };

  const { totalCount, isLoading } = useDrugs();
  if (isLoading) return <Spinner />;

  const { totalCount: reportsCount } = useDrugReports({
    thang: thang || undefined,
    nam: nam || undefined,
    id_thuoc: idThuoc || undefined,
  });

  const { data: drugsData } = useQuery({
    queryKey: ['drugs-list'],
    queryFn: () => getDrugs(1, 100),
  });

  const drugs = drugsData?.data || [];

  // Tạo danh sách tháng (1-12)
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Tạo danh sách năm (năm hiện tại - 5 đến năm hiện tại + 1)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i);

  function handleResetFilter() {
    setThang('');
    setNam('');
    setIdThuoc('');
  }

  return (
    <LayoutDrugs>
      <TabContainer>
        <Tab
          active={activeTab === 'drugs'}
          onClick={() => handleTabChange('drugs')}
        >
          Danh Sách Thuốc
        </Tab>
        <Tab
          active={activeTab === 'reports'}
          onClick={() => handleTabChange('reports')}
        >
          Báo Cáo Sử Dụng Thuốc
        </Tab>
      </TabContainer>

      {activeTab === 'drugs' ? (
        <>
          <LayoutFlex>
            <div className='flex items-center justify-center gap-x-3'>
              <h2 className='text-xl font-bold leading-6 text-grey-900'>
                Quản Lý Thuốc
              </h2>

              <div className='flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium border rounded-md text-primary border-primary bg-primary-transparent'>
                <span>Tổng thuốc:</span>
                <span>{totalCount}</span>
              </div>

              <div className='ml-4'>
                <Search />
              </div>
            </div>

            <div className='flex items-center justify-center gap-x-4'>
              {/* Filter */}
              <div className='flex items-center justify-center p-2 text-sm font-medium bg-white border rounded-md border-grey-transparent shadow-1 gap-x-2 text-grey-900'>
                <FunnelIcon className='w-5 h-5' />
                <span>Filter</span>
              </div>

              {/* New drug */}
              <AddDrug />
            </div>
          </LayoutFlex>

          <DrugCardContainer />
        </>
      ) : (
        <>
          <LayoutFlex>
            <div className='flex items-center justify-center gap-x-3'>
              <h2 className='text-xl font-bold leading-6 text-grey-900'>
                Báo Cáo Sử Dụng Thuốc
              </h2>

              <div className='flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium border rounded-md text-primary border-primary bg-primary-transparent'>
                <span>Tổng báo cáo:</span>
                <span>{reportsCount}</span>
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

                <div style={{ minWidth: '150px' }}>
                  <Select
                    value={idThuoc}
                    onChange={(e) => setIdThuoc(e.target.value)}
                  >
                    <option value=''>Tất cả thuốc</option>
                    {drugs.map((drug) => (
                      <option key={drug.ID_Thuoc} value={drug.ID_Thuoc}>
                        {drug.TenThuoc}
                      </option>
                    ))}
                  </Select>
                </div>

                {(thang || nam || idThuoc) && (
                  <button
                    onClick={handleResetFilter}
                    className='px-3 py-2 text-sm font-medium text-grey-700 bg-grey-100 border rounded-md border-grey-transparent hover:bg-grey-200'
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>

              {/* New Report */}
              <AddDrugReport />
            </div>
          </LayoutFlex>

          <DrugReportsContainer
            thang={thang || undefined}
            nam={nam || undefined}
            id_thuoc={idThuoc || undefined}
          />
        </>
      )}
    </LayoutDrugs>
  );
};

export default Drugs;

