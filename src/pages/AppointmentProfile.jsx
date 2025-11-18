import styled from 'styled-components';
import { useMoveBack } from '../hooks/useMoveBack';
import AppointmentDetail from '../features/appointments/AppointmentDetail';
import { useAppointment } from '../features/appointments/useAppointment';
import { useUser } from '../hooks/useUser';
import { ChevronLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import Spinner from '../ui/Spinner';
import ModalCenter from '../ui/ModalCenter';
import Button from '../ui/Button';
import EditAppointmentForm from '../features/appointments/EditAppointmentForm';

const LayoutAppointmentProfile = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f5f6f8;
`;

const AppointmentProfile = () => {
  const moveBack = useMoveBack();
  const { appointment, isLoading } = useAppointment();
  const { isNhanVien, isLoading: isLoadingUser, user } = useUser();

  // Debug: log để kiểm tra
  console.log('User data:', user);
  console.log('Is Nhan Vien:', isNhanVien);

  if (isLoading || isLoadingUser) return <Spinner />;

  if (!appointment) {
    return (
      <LayoutAppointmentProfile>
        <div className='flex items-center mb-5 gap-x-3'>
          <button onClick={moveBack}>
            <ChevronLeftIcon className='w-4 h-4' />
          </button>
          <h2 className='text-[#000] text-sm leading-5 font-semibold'>
            Hồ Sơ Tiếp Nhận
          </h2>
        </div>
        <div className='text-center py-10 text-grey-500'>
          Không tìm thấy thông tin tiếp nhận
        </div>
      </LayoutAppointmentProfile>
    );
  }

  return (
    <LayoutAppointmentProfile>
      <div className='flex items-center justify-between mb-5'>
        <div className='flex items-center gap-x-3'>
          <button onClick={moveBack}>
            <ChevronLeftIcon className='w-4 h-4' />
          </button>
          <h2 className='text-[#000] text-sm leading-5 font-semibold'>
            Hồ Sơ Tiếp Nhận #{appointment.ID_TiepNhan}
          </h2>
        </div>
        
        {/* Hiển thị nút chỉnh sửa nếu user là nhân viên */}
        {user && (isNhanVien || user?.role === 'nhan_vien') && (
          <ModalCenter>
            <ModalCenter.Open opens='edit-appointment'>
              <Button className='text-white bg-primary px-[10px] py-[6px] flex items-center gap-x-2'>
                <PencilIcon className='w-4 h-4' />
                <span>Chỉnh sửa</span>
              </Button>
            </ModalCenter.Open>
            <ModalCenter.Window name='edit-appointment'>
              <EditAppointmentForm 
                appointment={appointment} 
                onCloseModal={() => {
                  // Close modal logic is handled by ModalCenter
                }}
              />
            </ModalCenter.Window>
          </ModalCenter>
        )}
      </div>
      <AppointmentDetail ID_TiepNhan={appointment.ID_TiepNhan} />
    </LayoutAppointmentProfile>
  );
};

export default AppointmentProfile;

