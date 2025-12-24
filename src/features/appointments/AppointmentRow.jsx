import { EyeIcon, DocumentTextIcon, PencilIcon } from '@heroicons/react/24/outline';
import Table from '../../ui/Table';
import styled from 'styled-components';
import ModalCenter from '../../ui/ModalCenter';
import AppointmentDetail from './AppointmentDetail';
import EditAppointmentForm from './EditAppointmentForm';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';

const Text = styled.span`
  color: #0a1b39;
  font-size: 14px;
  font-weight: 500;
  margin: auto;
`;

const AppointmentRow = ({ appointment }) => {
  const navigate = useNavigate();
  const { isNhanVien, user } = useUser();
  const {
    ID_TiepNhan,
    NgayTN,
    CaTN,
    TrangThaiTiepNhan,
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

  const getStatusText = (tt) => {
    switch (tt) {
      case 'CHO_XAC_NHAN':
        return 'Chờ xác nhận';
      case 'CHO_KHAM':
        return 'Chờ khám';
      case 'DANG_KHAM':
        return 'Đang khám';
      case 'DA_KHAM':
        return 'Đã khám';
      case 'HUY':
        return 'Đã hủy';
      default:
        return '—';
    }
  };

  const getStatusColor = (tt) => {
    switch (tt) {
      case 'DA_KHAM':
        return 'text-success-900';
      case 'DANG_KHAM':
        return 'text-info-900';
      case 'HUY':
        return 'text-error-900';
      case 'CHO_XAC_NHAN':
      case 'CHO_KHAM':
        return 'text-warning-900';
      default:
        return 'text-grey-600';
    }
  };

  return (
    <Table.Row>
      <Text>{ID_TiepNhan}</Text>
      <Text>{formatDateTime(NgayTN)}</Text>
      <Text>{CaTN}</Text>
      <Text>{benhNhan?.HoTenBN || 'N/A'}</Text>
      <Text>{nhanVien?.HoTenNV || 'N/A'}</Text>
      <Text className={getStatusColor(TrangThaiTiepNhan)}>
        {getStatusText(TrangThaiTiepNhan)}
      </Text>

      <div className='flex items-center justify-center gap-x-2'>
        <ModalCenter>
          <ModalCenter.Open opens={`appointment-detail-${ID_TiepNhan}`}>
            <button 
              className='text-white py-1 px-2 bg-primary flex items-center justify-center rounded-lg font-semibold'
              title='Xem chi tiết'
            >
              <EyeIcon className='w-5 h-5' />
            </button>
          </ModalCenter.Open>
          <ModalCenter.Window name={`appointment-detail-${ID_TiepNhan}`}>
            <AppointmentDetail ID_TiepNhan={ID_TiepNhan} />
          </ModalCenter.Window>
        </ModalCenter>
        
        {/* Nút chỉnh sửa - chỉ hiển thị cho nhân viên */}
        {user && (isNhanVien || user?.role === 'nhan_vien') && (
          <ModalCenter>
            <ModalCenter.Open opens={`edit-appointment-${ID_TiepNhan}`}>
              <button 
                className='text-white py-1 px-2 bg-warning-600 flex items-center justify-center rounded-lg font-semibold'
                title='Chỉnh sửa'
              >
                <PencilIcon className='w-5 h-5' />
              </button>
            </ModalCenter.Open>
            <ModalCenter.Window name={`edit-appointment-${ID_TiepNhan}`}>
              <EditAppointmentForm 
                appointment={appointment} 
                onCloseModal={() => {
                  // Close modal logic is handled by ModalCenter
                }}
              />
            </ModalCenter.Window>
          </ModalCenter>
        )}
        
        <button
          onClick={() => navigate(`/appointments/${ID_TiepNhan}`)}
          className='text-white py-1 px-2 bg-success-600 flex items-center justify-center rounded-lg font-semibold'
          title='Xem hồ sơ tiếp nhận'
        >
          <DocumentTextIcon className='w-5 h-5' />
        </button>
      </div>
    </Table.Row>
  );
};

export default AppointmentRow;

