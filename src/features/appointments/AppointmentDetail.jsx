import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import { useQuery } from '@tanstack/react-query';
import { getAppointment } from './APIAppointments';
import Spinner from '../../ui/Spinner';
import { useUser } from '../../hooks/useUser';
import ModalCenter from '../../ui/ModalCenter';
import Button from '../../ui/Button';
import EditAppointmentForm from './EditAppointmentForm';
import { PencilIcon } from '@heroicons/react/24/outline';

const LayoutAppointmentDetail = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #e7e8eb;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);
  width: 100%;
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
  row-gap: 24px;
  margin: 20px auto;
  min-width: 600px;
`;

const AppointmentDetail = ({ ID_TiepNhan }) => {
  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', ID_TiepNhan],
    queryFn: () => getAppointment(ID_TiepNhan),
    enabled: !!ID_TiepNhan,
  });

  const { isNhanVien, user } = useUser();

  if (isLoading) return <Spinner />;
  if (!appointment) return <div>Không tìm thấy thông tin tiếp nhận</div>;

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  return (
    <LayoutAppointmentDetail>
      <div className='flex items-center justify-between mb-5'>
        <h2 className='text-xl font-bold leading-6 text-grey-900'>
          Thông Tin Tiếp Nhận #{appointment.ID_TiepNhan}
        </h2>
        
        {/* Hiển thị nút chỉnh sửa nếu user là nhân viên */}
        {user && (isNhanVien || user?.role === 'nhan_vien') && (
          <ModalCenter>
            <ModalCenter.Open opens={`edit-appointment-${ID_TiepNhan}`}>
              <Button className='text-white bg-primary px-[10px] py-[6px] flex items-center gap-x-2 text-sm'>
                <PencilIcon className='w-4 h-4' />
                <span>Chỉnh sửa</span>
              </Button>
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
      </div>

      <Grid2Col>
        <FormRow inline={true} label='Mã Tiếp Nhận: '>
          <Text>{appointment.ID_TiepNhan}</Text>
        </FormRow>

        <FormRow inline={true} label='Ngày Tiếp Nhận: '>
          <Text>{formatDateTime(appointment.NgayTN)}</Text>
        </FormRow>

        <FormRow inline={true} label='Ca Tiếp Nhận: '>
          <Text>{appointment.CaTN}</Text>
        </FormRow>

        <FormRow inline={true} label='Trạng Thái: '>
          <Text className={appointment.TrangThai ? 'text-success-900' : 'text-warning-900'}>
            {appointment.TrangThai ? 'Đã hoàn thành' : 'Đang chờ'}
          </Text>
        </FormRow>

        <FormRow inline={true} label='Mã Bệnh Nhân: '>
          <Text>{appointment.ID_BenhNhan}</Text>
        </FormRow>

        <FormRow inline={true} label='Họ Tên Bệnh Nhân: '>
          <Text>{appointment.benhNhan?.HoTenBN || 'N/A'}</Text>
        </FormRow>

        <FormRow inline={true} label='Mã Nhân Viên: '>
          <Text>{appointment.ID_NhanVien}</Text>
        </FormRow>

        <FormRow inline={true} label='Họ Tên Nhân Viên: '>
          <Text>{appointment.nhanVien?.HoTenNV || 'N/A'}</Text>
        </FormRow>
      </Grid2Col>
    </LayoutAppointmentDetail>
  );
};

export default AppointmentDetail;

