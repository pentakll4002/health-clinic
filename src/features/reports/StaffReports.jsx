import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import Select from '../../ui/Select';
import { useStaffPerformance } from './useStaffPerformance';

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

function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount || 0));
}

function formatNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function BarChart({ items, metricKey, title }) {
  const top = items.slice(0, 8);
  const maxValue = Math.max(1, ...top.map((x) => formatNumber(metricKey === 'score' ? x.score : x.kpis?.[metricKey])));

  return (
    <div className='bg-white rounded-lg border border-grey-transparent shadow-1 p-5'>
      <p className='text-sm font-semibold text-grey-900'>{title}</p>
      {top.length === 0 ? (
        <p className='mt-3 text-sm text-grey-500'>Chưa có dữ liệu.</p>
      ) : (
        <div className='mt-4 flex items-end gap-3 h-44'>
          {top.map((e) => {
            const raw = metricKey === 'score' ? e.score : e.kpis?.[metricKey];
            const value = formatNumber(raw);
            const heightPct = Math.round((value / maxValue) * 100);

            return (
              <div key={e.ID_NhanVien} className='flex-1 flex flex-col items-center justify-end gap-2'>
                <div className='w-full bg-grey-100 rounded-md overflow-hidden border border-grey-transparent'>
                  <div
                    className='w-full bg-primary'
                    style={{ height: `${Math.max(6, Math.round((heightPct / 100) * 160))}px` }}
                    title={`${e.HoTenNV}: ${value}`}
                  />
                </div>
                <p className='text-[11px] text-grey-600 text-center leading-tight line-clamp-2'>{e.HoTenNV}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function StaffReports() {
  const [thang, setThang] = useState('');
  const [nam, setNam] = useState('');
  const [search, setSearch] = useState('');

  const { isLoading, items: rawItems } = useStaffPerformance({
    thang: thang ? Number(thang) : undefined,
    nam: nam ? Number(nam) : undefined,
  });

  // tháng/năm filter
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i);

  const items = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const filtered = keyword
      ? rawItems.filter((e) => (e?.HoTenNV || '').toLowerCase().includes(keyword))
      : rawItems;

    return [...filtered].sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [rawItems, search]);

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
          <p className='text-sm text-grey-500'>Số liệu lấy từ hệ thống (tiếp nhận, phiếu khám, hoá đơn, nhập kho).</p>
        </div>

        <div className='flex items-center gap-2'>
          <div style={{ minWidth: '120px' }}>
            <Select value={thang} onChange={(e) => setThang(e.target.value)}>
              <option value=''>Tất cả tháng</option>
              {months.map((m) => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </Select>
          </div>
          <div style={{ minWidth: '120px' }}>
            <Select value={nam} onChange={(e) => setNam(e.target.value)}>
              <option value=''>Tất cả năm</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Select>
          </div>
          <div className='w-full max-w-xs'>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Tìm theo tên nhân viên...'
              className='w-full rounded-md border border-grey-transparent bg-white px-3 py-2 text-sm text-grey-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
            />
          </div>
        </div>
      </Header>

      <Grid>
        <div className='bg-white rounded-lg border border-grey-transparent shadow-1 overflow-hidden'>
          <div className='px-5 py-4 border-b border-grey-transparent'>
            <p className='text-sm font-semibold text-grey-900'>Bảng xếp hạng</p>
            <p className='text-xs text-grey-500'>Điểm tổng hợp dựa trên KPI theo thời gian lọc.</p>
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
                    <th className='px-4 py-3 text-right font-semibold'>Tiếp nhận</th>
                    <th className='px-4 py-3 text-right font-semibold'>Phiếu khám</th>
                    <th className='px-4 py-3 text-right font-semibold'>Hoá đơn</th>
                    <th className='px-4 py-3 text-right font-semibold'>Doanh thu</th>
                    <th className='px-4 py-3 text-right font-semibold'>Nhập kho</th>
                    <th className='px-4 py-3 text-right font-semibold'>Điểm</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-grey-transparent bg-white text-grey-900'>
                  {items.map((e) => (
                    <tr key={e.ID_NhanVien}>
                      <td className='px-4 py-3 font-semibold'>{e.HoTenNV || '—'}</td>
                      <td className='px-4 py-3'>{e?.nhom_nguoi_dung?.TenNhom || '—'}</td>
                      <td className='px-4 py-3 text-right'>{formatNumber(e?.kpis?.reception_approved)}</td>
                      <td className='px-4 py-3 text-right'>{formatNumber(e?.kpis?.medical_forms)}</td>
                      <td className='px-4 py-3 text-right'>{formatNumber(e?.kpis?.invoices)}</td>
                      <td className='px-4 py-3 text-right'>{formatCurrency(e?.kpis?.revenue)}</td>
                      <td className='px-4 py-3 text-right'>{formatNumber(e?.kpis?.import_slips)}</td>
                      <td className='px-4 py-3 text-right font-semibold text-primary'>{Number(e?.score || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className='space-y-4'>
          <BarChart items={items} metricKey='score' title='Top theo điểm tổng hợp' />
          <BarChart items={items} metricKey='revenue' title='Top theo doanh thu hoá đơn' />
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
                      <p className='text-xs text-grey-500'>{e?.nhom_nguoi_dung?.TenNhom || ''}</p>
                    </div>
                    <p className='text-sm font-bold text-primary'>{Number(e.score || 0).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Grid>
    </Layout>
  );
}
