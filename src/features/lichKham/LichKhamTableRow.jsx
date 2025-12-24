import styled from 'styled-components';
import Table from '../../ui/Table';
import ModalCenter from '../../ui/ModalCenter';
import Menus from '../../ui/Menus';
import { useConfirmLichKham } from './useConfirmLichKham';
import { useDeleteLichKham } from './useDeleteLichKham';
import { useUpdateLichKham } from './useUpdateLichKham';
import { useCreateReceptionFromLichKham } from '../receptionList/useCreateReceptionFromLichKham';
import { useUser } from '../../hooks/useUser';
import EditLichKhamForm from './EditLichKhamForm';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { CheckCircleIcon, NoSymbolIcon, PencilIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const Text = styled.span`
  color: #0a1b39;
  font-size: 14px;
  font-weight: 500;
  margin: auto;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const LichKhamTableRow = ({ lichKham }) => {
  const { mutate: confirmLichKham, isLoading: isConfirming } = useConfirmLichKham();
  const { mutate: deleteLichKham, isLoading: isDeleting } = useDeleteLichKham();
  const { mutate: updateLichKham, isLoading: isUpdating } = useUpdateLichKham();
  const { mutate: createReception, isLoading: isCreatingReception } = useCreateReceptionFromLichKham();
  const { nhanVien } = useUser();

  const getStatusBadge = (trangThai) => {
    switch (trangThai) {
      case 'ChoXacNhan':
        return (
          <StatusBadge className='bg-warning-100 text-warning-900'>
            Chờ xác nhận
          </StatusBadge>
        );
      case 'DaXacNhan':
        return (
          <StatusBadge className='bg-success-100 text-success-900'>
            Đã xác nhận
          </StatusBadge>
        );
      case 'Huy':
        return (
          <StatusBadge className='bg-error-100 text-error-900'>
            Đã hủy
          </StatusBadge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleConfirm = () => {
    if (window.confirm(`Xác nhận lịch khám #${lichKham.ID_LichKham} của bệnh nhân ${lichKham.benhNhan?.HoTenBN || 'N/A'}?`)) {
      confirmLichKham(lichKham.ID_LichKham);
    }
  };

  const handleDelete = () => {
    deleteLichKham(lichKham.ID_LichKham);
  };

  const handleReject = () => {
    if (
      window.confirm(
        `Không xác nhận (từ chối) lịch khám #${lichKham.ID_LichKham} của bệnh nhân ${lichKham.benhNhan?.HoTenBN || 'N/A'}?`
      )
    ) {
      updateLichKham({
        id: lichKham.ID_LichKham,
        data: {
          TrangThai: 'Huy',
        },
      });
    }
  };

  const handleCreateReception = () => {
    if (!nhanVien?.ID_NhanVien) {
      alert('Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại.');
      return;
    }

    if (window.confirm(`Tiếp nhận bệnh nhân ${lichKham.benhNhan?.HoTenBN || 'N/A'} từ lịch khám #${lichKham.ID_LichKham}?`)) {
      createReception({
        ID_LichKham: lichKham.ID_LichKham,
        ID_NhanVien: nhanVien.ID_NhanVien,
      });
    }
  };

  // Hiển thị tên bệnh nhân - kiểm tra nhiều cách
  const patientName = 
    lichKham.benhNhan?.HoTenBN || 
    lichKham.benh_nhan?.HoTenBN || 
    (lichKham.benhNhan ? 'Bệnh nhân #' + lichKham.ID_BenhNhan : '—');

  return (
    <Table.Row>
      <Text className='text-center'>#{lichKham.ID_LichKham}</Text>
      <Text className='text-center'>{patientName}</Text>
      <Text className='text-center'>{formatDate(lichKham.NgayKhamDuKien)}</Text>
      <Text className='text-center'>{lichKham.CaKham}</Text>
      <div className='flex justify-center'>{getStatusBadge(lichKham.TrangThai)}</div>
      <Text className='text-center'>{lichKham.GhiChu || '—'}</Text>
      
      {/* Cột thao tác - ẨN NỘI DUNG NẾU ROLE LÀ BÁC SĨ */}
      <div className='flex items-center justify-center'>
        {window.localStorage.getItem('user_role') !== '@doctors' && (
          <ModalCenter>
            <Menus>
              <Menus.Menu>
                <Menus.Toggle id={`lich-kham-${lichKham.ID_LichKham}`} />
                
                <Menus.List id={`lich-kham-${lichKham.ID_LichKham}`}>
                  {/* Edit button */}
                  <ModalCenter.Open opens={`edit-${lichKham.ID_LichKham}`}>
                    <Menus.Button icon={<PencilIcon className='w-4 h-4' />}>
                      Sửa
                    </Menus.Button>
                  </ModalCenter.Open>

                  {/* Confirm button - chỉ hiển thị khi chờ xác nhận */}
                  {lichKham.TrangThai === 'ChoXacNhan' && (
                    <Menus.Button
                      icon={<CheckCircleIcon className='w-4 h-4' />}
                      onClick={handleConfirm}
                      disabled={isConfirming || isUpdating || isDeleting}
                    >
                      {isConfirming ? 'Đang xử lý...' : 'Xác nhận'}
                    </Menus.Button>
                  )}

                  {/* Reject button - chỉ hiển thị khi chờ xác nhận */}
                  {lichKham.TrangThai === 'ChoXacNhan' && (
                    <Menus.Button
                      icon={<NoSymbolIcon className='w-4 h-4' />}
                      onClick={handleReject}
                      disabled={isConfirming || isUpdating || isDeleting}
                    >
                      {isUpdating ? 'Đang xử lý...' : 'Không xác nhận'}
                    </Menus.Button>
                  )}

                  {/* Tiếp nhận button - ẨN vì đã tự động tạo khi xác nhận lịch khám */}
                  {/* Khi lễ tân xác nhận lịch khám, hệ thống TỰ ĐỘNG tạo record trong danh sách tiếp nhận */}
                  {/* Chỉ hiển thị nếu cần tiếp nhận lại (trường hợp đặc biệt) */}
                  {false && lichKham.TrangThai === 'DaXacNhan' && (
                    <Menus.Button
                      icon={<UserPlusIcon className='w-4 h-4' />}
                      onClick={handleCreateReception}
                    >
                      {isCreatingReception ? 'Đang tiếp nhận...' : 'Tiếp nhận lại'}
                    </Menus.Button>
                  )}

                  {/* Delete button */}
                  <ModalCenter.Open opens={`delete-${lichKham.ID_LichKham}`}>
                    <Menus.Button icon={<TrashIcon className='w-4 h-4' />}>
                      Xóa
                    </Menus.Button>
                  </ModalCenter.Open>
                </Menus.List>

                {/* Edit Modal */}
                <ModalCenter.Window name={`edit-${lichKham.ID_LichKham}`}>
                  <EditLichKhamForm 
                    lichKham={lichKham} 
                    onCloseModal={() => {}}
                  />
                </ModalCenter.Window>

                {/* Delete Confirmation Modal */}
                <ModalCenter.Window name={`delete-${lichKham.ID_LichKham}`}>
                  <ConfirmDelete
                    resourceName={`lịch khám #${lichKham.ID_LichKham}`}
                    disabled={isDeleting}
                    onConfirm={handleDelete}
                    onCloseModal={() => {}}
                  />
                </ModalCenter.Window>
              </Menus.Menu>
            </Menus>
          </ModalCenter>
        )}
      </div>
    </Table.Row>
  );
}

export default LichKhamTableRow;