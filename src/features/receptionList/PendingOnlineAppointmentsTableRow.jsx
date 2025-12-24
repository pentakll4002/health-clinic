import styled from 'styled-components';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useUpdateReception } from './useUpdateReception';

const Text = styled.span`
  color: #0a1b39;
  font-size: 14px;
  font-weight: 500;
  margin: auto;
`;

const PendingOnlineAppointmentsTableRow = ({ tiepNhan }) => {
  const { mutate: updateReception, isLoading } = useUpdateReception();

  const benhNhan = tiepNhan.benhNhan || tiepNhan.benh_nhan;
  const nhanVien = tiepNhan.nhanVien || tiepNhan.nhan_vien;
  const leTanDuyet = tiepNhan.leTanDuyet || tiepNhan.le_tan_duyet;

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const handleConfirm = () => {
    if (window.confirm(`Xác nhận lịch hẹn #${tiepNhan.ID_TiepNhan} của bệnh nhân ${benhNhan?.HoTenBN || 'N/A'}?`)) {
      updateReception({
        id: tiepNhan.ID_TiepNhan,
        data: {
          TrangThaiTiepNhan: 'CHO_KHAM',
        },
      });
    }
  };

  const handleReject = () => {
    if (window.confirm(`Không xác nhận (từ chối) lịch hẹn #${tiepNhan.ID_TiepNhan} của bệnh nhân ${benhNhan?.HoTenBN || 'N/A'}?`)) {
      updateReception({
        id: tiepNhan.ID_TiepNhan,
        data: {
          TrangThaiTiepNhan: 'HUY',
        },
      });
    }
  };

  return (
    <Table.Row>
      <Text className='text-center'>#{tiepNhan.ID_TiepNhan}</Text>
      <Text className='text-center'>{benhNhan?.HoTenBN || '—'}</Text>
      <Text className='text-center'>{formatDateTime(tiepNhan.NgayTN)}</Text>
      <Text className='text-center'>{tiepNhan.CaTN || '—'}</Text>
      <Text className='text-center'>{nhanVien?.HoTenNV || '—'}</Text>
      <div className='flex items-center justify-center gap-2'>
        <Button
          className='bg-success-600 text-white text-sm px-3 py-1.5'
          disabled={isLoading}
          onClick={handleConfirm}
        >
          {isLoading ? '...' : 'Xác nhận'}
        </Button>
        <Button
          className='bg-error-600 text-white text-sm px-3 py-1.5'
          disabled={isLoading}
          onClick={handleReject}
        >
          {isLoading ? '...' : 'Không xác nhận'}
        </Button>
      </div>
    </Table.Row>
  );
};

export default PendingOnlineAppointmentsTableRow;
