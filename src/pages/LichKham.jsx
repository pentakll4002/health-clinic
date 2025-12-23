import { useState } from 'react';
import styled from 'styled-components';
import LichKhamContainer from '../features/lichKham/LichKhamContainer';
import AddLichKham from '../features/lichKham/AddLichKham';
import LichKhamCalendar from '../features/lichKham/LichKhamCalendar';

const LayoutLichKham = styled.div`
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

const Tabs = styled.div`
  display: inline-flex;
  padding: 2px;
  border-radius: 999px;
  background-color: #e5e7eb;
`;

const TabButton = styled.button`
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background-color: ${(props) => (props.active ? '#ffffff' : 'transparent')};
  color: ${(props) => (props.active ? '#111827' : '#6b7280')};
  font-weight: 500;
`;

const LichKham = () => {
  const [filterStatus, setFilterStatus] = useState('');
  const [activeView, setActiveView] = useState('list'); // 'list' | 'calendar'
  const [selectedDate, setSelectedDate] = useState('');

  const handleSelectDate = (dateStr) => {
    setSelectedDate(dateStr);
    setActiveView('list');
  };

  return (
    <LayoutLichKham>
      <LayoutFlex>
        <div className='flex items-center justify-center gap-x-3'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>
            Lịch khám của tôi
          </h2>
          <Tabs>
            <TabButton
              type='button'
              active={activeView === 'list'}
              onClick={() => setActiveView('list')}
            >
              Danh sách
            </TabButton>
            <TabButton
              type='button'
              active={activeView === 'calendar'}
              onClick={() => setActiveView('calendar')}
            >
              Lịch tháng
            </TabButton>
          </Tabs>
        </div>

        <div className='flex items-center justify-center gap-x-4'>
          {activeView === 'list' && (
            <>
              {/* Filter by status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='px-3 py-2 border border-grey-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm'
              >
                <option value=''>Tất cả</option>
                <option value='ChoXacNhan'>Chờ xác nhận</option>
                <option value='DaXacNhan'>Đã xác nhận</option>
                <option value='Huy'>Đã hủy</option>
              </select>

              {selectedDate && (
                <button
                  type='button'
                  onClick={() => setSelectedDate('')}
                  className='px-2 py-1 text-xs text-grey-600 hover:text-grey-900'
                >
                  Xóa lọc ngày ({selectedDate})
                </button>
              )}
            </>
          )}

          {/* Add appointment button */}
          <AddLichKham />
        </div>
      </LayoutFlex>

      {activeView === 'calendar' ? (
        <LichKhamCalendar onSelectDate={handleSelectDate} />
      ) : (
        <LichKhamContainer filterStatus={filterStatus || undefined} />
      )}
    </LayoutLichKham>
  );
};

export default LichKham;


