import { EyeIcon } from '@heroicons/react/24/outline';
import Table from '../../ui/Table';
import styled from 'styled-components';
import ModalCenter from '../../ui/ModalCenter';
import AppointmentDetail from './AppointmentDetail';

const Text = styled.span`
  color: #0a1b39;
  font-size: 14px;
  font-weight: 500;
  margin: auto;
`;

const AppointmentRow = ({ appointment }) => {
  const {
    ID_TiepNhan,
    NgayTN,
    CaTN,
    TrangThai,
    benhNhan,
    nhanVien,
  } = appointment;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const getStatusText = (status) => {
    return status ? 'Đã hoàn thành' : 'Đang chờ';
  };

  const getStatusColor = (status) => {
    return status ? 'text-success-900' : 'text-warning-900';
  };

  return (
    <Table.Row>
      <Text>{ID_TiepNhan}</Text>
      <Text>{formatDateTime(NgayTN)}</Text>
      <Text>{CaTN}</Text>
      <Text>{benhNhan?.HoTenBN || 'N/A'}</Text>
      <Text>{nhanVien?.HoTenNV || 'N/A'}</Text>
      <Text className={getStatusColor(TrangThai)}>
        {getStatusText(TrangThai)}
      </Text>

      <ModalCenter>
        <ModalCenter.Open opens={`appointment-detail-${ID_TiepNhan}`}>
          <button className='text-white py-1 bg-primary w-[50%] flex items-center justify-center rounded-lg font-semibold mx-auto'>
            <EyeIcon className='w-5 h-5' />
          </button>
        </ModalCenter.Open>
        <ModalCenter.Window name={`appointment-detail-${ID_TiepNhan}`}>
          <AppointmentDetail ID_TiepNhan={ID_TiepNhan} />
        </ModalCenter.Window>
      </ModalCenter>
    </Table.Row>
  );
};

export default AppointmentRow;

