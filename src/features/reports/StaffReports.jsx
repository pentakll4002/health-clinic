import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import { useEmployees } from '../employee/useEmployees';

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 1024px) {
    grid-template-columns: 1.2fr 0.8fr;
  }
`;

function safeNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function calcEmployeeScore(employee) {
  // Placeholder scoring: có thể thay bằng API backend /reports/staff
  // Ưu tiên dùng số liệu nếu backend đã trả về, fallback về 0.
  const totalAppointments = safeNumber(employee?.totalAppointments || employee?.TongTiepNhan || employee?.tiepNhanCount);
  const totalMedicalForms = safeNumber(employee?.totalMedicalForms || employee?.TongPhieuKham || employee?.phieuKhamCount);
  const totalRevenue = safeNumber(employee?.totalRevenue || employee?.TongDoanhThu || employee?.revenue);

  return totalAppointments * 2 + totalMedicalForms * 3 + totalRevenue / 1_000_000;
}

export default function StaffReports() {
  const { isLoading, employees = [] } = useEmployees();
  const [search, setSearch] = useState('');

  const items = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const filtered = keyword
      ? employees.filter((e) => (e?.HoTenNV || '').toLowerCase().includes(keyword))
      : employees;

    return filtered
      .map((e) => ({
        ...e,
        _score: calcEmployeeScore(e),
      }))
      .sort((a, b) => (b._score || 0) - (a._score || 0));
  }, [employees, search]);

  const top3 = items.slice(0, 3);

  if (isLoading) {
    return (
      <Layout>
        <div className='flex items-center justify-center w-full h-full'>
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header>
        <div className='flex flex-col gap-1'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>Hiệu suất nhân viên</h2>
          <p className='text-sm text-grey-500'>Bảng tổng hợp nhanh để quản lý theo dõi năng suất theo thời gian.</p>
        </div>

        <div className='w-full max-w-xs'>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Tìm theo tên nhân viên...'
            className='w-full rounded-md border border-grey-transparent bg-white px-3 py-2 text-sm text-grey-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
          />
        </div>
      </Header>

      <Grid>
        <div className='bg-white rounded-lg border border-grey-transparent shadow-1 overflow-hidden'>
          <div className='px-5 py-4 border-b border-grey-transparent'>
            <p className='text-sm font-semibold text-grey-900'>Bảng xếp hạng (tạm tính)</p>
            <p className='text-xs text-grey-500'>*Số liệu hiện đang lấy từ danh sách nhân viên + placeholder scoring.</p>
          </div>

          {items.length === 0 ? (
            <div className='px-5 py-10 text-center text-grey-500'>Không có dữ liệu nhân viên.</div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-grey-transparent text-sm'>
                <thead className='bg-grey-50 text-xs uppercase text-grey-500'>
                  <tr>
                    <th className='px-4 py-3 text-left font-semibold'>Nhân viên</th>
                    <th className='px-4 py-3 text-left font-semibold'>Vai trò</th>
                    <th className='px-4 py-3 text-right font-semibold'>Điểm</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-grey-transparent bg-white text-grey-900'>
                  {items.map((e) => (
                    <tr key={e.ID_NhanVien}>
                      <td className='px-4 py-3 font-semibold'>{e.HoTenNV || '—'}</td>
                      <td className='px-4 py-3'>{e?.nhomNguoiDung?.TenNhom || e?.nhom_nguoi_dung?.TenNhom || '—'}</td>
                      <td className='px-4 py-3 text-right font-semibold text-primary'>
                        {Number(e._score || 0).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className='space-y-4'>
          <div className='bg-white rounded-lg border border-grey-transparent shadow-1 p-5'>
            <p className='text-sm font-semibold text-grey-900'>Top nhân viên</p>
            <div className='mt-4 space-y-3'>
              {top3.length === 0 ? (
                <p className='text-sm text-grey-500'>Chưa có dữ liệu.</p>
              ) : (
                top3.map((e, idx) => (
                  <div key={e.ID_NhanVien} className='flex items-center justify-between rounded-md border border-grey-transparent px-4 py-3'>
                    <div>
                      <p className='text-sm font-semibold text-grey-900'>#{idx + 1} {e.HoTenNV || '—'}</p>
                      <p className='text-xs text-grey-500'>{e?.nhomNguoiDung?.TenNhom || e?.nhom_nguoi_dung?.TenNhom || ''}</p>
                    </div>
                    <p className='text-sm font-bold text-primary'>{Number(e._score || 0).toFixed(1)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className='bg-white rounded-lg border border-grey-transparent shadow-1 p-5'>
            <p className='text-sm font-semibold text-grey-900'>Gợi ý tích hợp API</p>
            <p className='mt-2 text-sm text-grey-600'>
              Bạn có thể tạo endpoint Laravel: <span className='font-mono'>GET /api/reports/staff</span> trả về các KPI
              theo nhân viên (tổng tiếp nhận, tổng phiếu khám, tổng doanh thu, số bệnh nhân mới...).
            </p>
          </div>
        </div>
      </Grid>
    </Layout>
  );
}
