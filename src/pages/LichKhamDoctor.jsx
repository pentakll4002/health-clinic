import styled from 'styled-components';
import LichKhamTableContainer from '../features/lichKham/LichKhamTableContainer';
import { useState } from 'react';

const LayoutDoctorLichKham = styled.div`
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

const RangeSelect = styled.select`
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`;

// Trang lịch khám chỉ để bác sĩ xem (read only)
function LichKhamDoctor() {
  const [range, setRange] = useState('today'); // today | 7 | 30

  const today = new Date();

  let filterRange = null;
  if (range === 'today') {
    const key = today.toISOString().split('T')[0];
    filterRange = { from: key, to: key };
  } else if (range === '7') {
    const from = today.toISOString().split('T')[0];
    const toDate = new Date(today);
    toDate.setDate(toDate.getDate() + 7);
    const to = toDate.toISOString().split('T')[0];
    filterRange = { from, to };
  } else if (range === '30') {
    const from = today.toISOString().split('T')[0];
    const toDate = new Date(today);
    toDate.setDate(toDate.getDate() + 30);
    const to = toDate.toISOString().split('T')[0];
    filterRange = { from, to };
  }

  return (
    <LayoutDoctorLichKham>
      <LayoutFlex>
        <h2 className='text-xl font-bold leading-6 text-grey-900'>Lịch khám đã xác nhận</h2>
        <div className='flex items-center gap-3'>
          <span className='text-sm text-grey-600'>Khoảng thời gian:</span>
          <RangeSelect value={range} onChange={(e) => setRange(e.target.value)}>
            <option value='today'>Hôm nay</option>
            <option value='7'>7 ngày tới</option>
            <option value='30'>30 ngày tới</option>
          </RangeSelect>
        </div>
      </LayoutFlex>
      {/* Chỉ hiển thị lịch khám đã xác nhận, readonly, KHÔNG render thao tác! */}
      <LichKhamTableContainer filterStatus='DaXacNhan' filterRange={filterRange} />
    </LayoutDoctorLichKham>
  );
}

export default LichKhamDoctor;


