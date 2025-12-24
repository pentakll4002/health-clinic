import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import Search from '../Search/Search';
import Table from '../../ui/Table';
import ModalCenter from '../../ui/ModalCenter';
import MedicalDetail from '../medicalForm/MedicalDetail';
import { EyeIcon } from '@heroicons/react/24/outline';
import { usePhieuKhamList } from '../medicalForm/usePhieuKhamList';

const Layout = styled.div`
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

function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(amount || 0));
}

function NurseAssist() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const { isLoading, phieuKhams } = usePhieuKhamList({ keyword: searchKeyword });

  const items = useMemo(() => {
    if (!searchKeyword?.trim()) return phieuKhams;
    const kw = searchKeyword.trim().toLowerCase();
    return phieuKhams.filter((p) => String(p?.ID_PhieuKham || '').toLowerCase().includes(kw));
  }, [phieuKhams, searchKeyword]);

  if (isLoading) return <Spinner />;

  return (
    <Layout>
      <LayoutFlex>
        <div className='flex items-center justify-center gap-x-3'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>Hỗ trợ khám</h2>
          <div className='ml-4'>
            <Search onSearch={setSearchKeyword} />
          </div>
        </div>
        <div className='text-sm text-grey-500'>Phiếu khám: xem read-only</div>
      </LayoutFlex>

      {items.length === 0 ? (
        <div className='bg-white rounded-lg border border-grey-transparent shadow-1 p-8 text-center text-grey-500'>
          Không có phiếu khám nào
        </div>
      ) : (
        <div className='bg-white rounded-lg border border-grey-transparent overflow-hidden'>
          <Table columns='1.2fr 1.6fr 1fr 1fr 1fr 1fr'>
            <Table.Header>
              <div className='mx-auto'>ID</div>
              <div className='mx-auto'>Ngày</div>
              <div className='mx-auto'>Ca</div>
              <div className='mx-auto'>Tiền khám</div>
              <div className='mx-auto'>Tiền thuốc</div>
              <div className='mx-auto'>Xem</div>
            </Table.Header>

            <Table.Body
              data={items}
              render={(p) => (
                <Table.Row key={p.ID_PhieuKham}>
                  <div className='mx-auto font-semibold text-grey-900'>{p.ID_PhieuKham}</div>
                  <div className='mx-auto text-grey-700'>{p.NgayTN || '—'}</div>
                  <div className='mx-auto text-grey-700'>{p.CaTN || p.CaKham || '—'}</div>
                  <div className='mx-auto text-grey-700'>{formatCurrency(p.TienKham)}</div>
                  <div className='mx-auto text-grey-700'>{formatCurrency(p.TongTienThuoc)}</div>

                  <ModalCenter>
                    <ModalCenter.Open opens={`nurse-medical-detail-${p.ID_PhieuKham}`}>
                      <button className='text-white py-1 bg-error-950 w-[50%] flex items-center justify-center rounded-lg font-semibold mx-auto'>
                        <EyeIcon className='w-5 h-5' />
                      </button>
                    </ModalCenter.Open>
                    <ModalCenter.Window name={`nurse-medical-detail-${p.ID_PhieuKham}`}>
                      <MedicalDetail ID_PhieuKham={p.ID_PhieuKham} readOnly />
                    </ModalCenter.Window>
                  </ModalCenter>
                </Table.Row>
              )}
            />
          </Table>
        </div>
      )}
    </Layout>
  );
}

export default NurseAssist;
