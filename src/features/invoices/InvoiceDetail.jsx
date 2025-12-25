import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { getInvoice } from './APIInvoices';
import Spinner from '../../ui/Spinner';

const LayoutInvoiceDetail = styled.div`
  padding: 20px;
  background-color: #f5f6f8;
  width: 900px;
  height: 100%;
`;

const Text = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #091833;
  margin: auto;
`;

const Grid2Col = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 12px;
  margin: 20px auto;
`;

const Row = ({ label, value }) => (
  <div className='flex items-center gap-3'>
    <span className='text-sm font-medium text-grey-900 min-w-[160px]'>{label}</span>
    <Text>{value}</Text>
  </div>
);

const InvoiceDetail = ({ ID_HoaDon }) => {
  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', ID_HoaDon],
    queryFn: () => getInvoice(ID_HoaDon),
    enabled: !!ID_HoaDon,
  });

  if (isLoading) return <Spinner />;
  if (!invoice) return <div>Không tìm thấy hoá đơn</div>;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
      amount || 0
    );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const staff = invoice.nhanVien || invoice.nhan_vien;
  const medicalForm = invoice.phieuKham || invoice.phieu_kham;
  const tiepNhan = medicalForm?.tiepNhan || medicalForm?.tiep_nhan;
  const benhNhan = tiepNhan?.benhNhan || tiepNhan?.benh_nhan;
  const openPrintWindow = () => {
    window.open(`/invoices/${invoice.ID_HoaDon}/print?autoprint=1`, '_blank', 'noopener,noreferrer');
  };

  return (
    <LayoutInvoiceDetail>
      <div className='flex items-center justify-between mb-5'>
        <h2 className='text-xl font-bold leading-6 text-grey-900'>
          Hoá Đơn #{invoice.ID_HoaDon}
        </h2>
        <button
          type='button'
          onClick={openPrintWindow}
          className='px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition'
        >
          Xuất PDF
        </button>
      </div>

      <Grid2Col>
        <Row label='Mã phiếu khám' value={medicalForm?.ID_PhieuKham || 'N/A'} />
        <Row label='Ngày hoá đơn' value={formatDate(invoice.NgayHoaDon)} />
        <Row label='Bệnh nhân' value={benhNhan?.HoTenBN || 'N/A'} />
        <Row label='Bác sĩ/nhân viên' value={staff?.HoTenNV || 'N/A'} />
        <Row label='Tiền khám' value={formatCurrency(invoice.TienKham)} />
        <Row label='Tiền thuốc' value={formatCurrency(invoice.TienThuoc)} />
        <Row label='Tiền dịch vụ' value={formatCurrency(invoice.TienDichVu)} />
        <Row label='Tổng tiền' value={formatCurrency(invoice.TongTien)} />
      </Grid2Col>
    </LayoutInvoiceDetail>
  );
};

export default InvoiceDetail;


