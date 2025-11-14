import Table from '../../ui/Table';
import styled from 'styled-components';
import ModalCenter from '../../ui/ModalCenter';
import { EyeIcon } from '@heroicons/react/24/outline';
import InvoiceDetail from './InvoiceDetail';

const Text = styled.span`
  color: #0a1b39;
  font-size: 14px;
  font-weight: 500;
  margin: auto;
`;

const InvoiceRow = ({ invoice }) => {
  const {
    ID_HoaDon,
    NgayHoaDon,
    TienKham,
    TienThuoc,
    TongTien,
    nhanVien,
    phieuKham,
  } = invoice;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
      amount || 0
    );

  return (
    <Table.Row>
      <Text>{ID_HoaDon}</Text>
      <Text>{phieuKham?.ID_PhieuKham || 'N/A'}</Text>
      <Text>{nhanVien?.HoTenNV || 'N/A'}</Text>
      <Text>{formatDate(NgayHoaDon)}</Text>
      <Text>{formatCurrency(TienKham)}</Text>
      <Text>{formatCurrency(TienThuoc)}</Text>
      <Text>{formatCurrency(TongTien)}</Text>

      <ModalCenter>
        <ModalCenter.Open opens={`invoice-detail-${ID_HoaDon}`}>
          <button className='text-white py-1 bg-primary w-[50%] flex items-center justify-center rounded-lg font-semibold mx-auto'>
            <EyeIcon className='w-5 h-5' />
          </button>
        </ModalCenter.Open>
        <ModalCenter.Window name={`invoice-detail-${ID_HoaDon}`}>
          <InvoiceDetail ID_HoaDon={ID_HoaDon} />
        </ModalCenter.Window>
      </ModalCenter>
    </Table.Row>
  );
};

export default InvoiceRow;


