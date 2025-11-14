import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import { useQuery } from '@tanstack/react-query';
import { getAppointment } from './APIAppointments';
import Spinner from '../../ui/Spinner';

const LayoutAppointmentDetail = styled.div`
  padding: 20px;
  background-color: #f5f6f8;
  width: 1200px;
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

  if (isLoading) return <Spinner />;
  if (!appointment) return <div>Không tìm thấy thông tin tiếp nhận</div>;

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  return (
    <LayoutAppointmentDetail>
      <h2 className='mb-5 text-xl font-bold leading-6 text-grey-900'>
        Thông Tin Tiếp Nhận #{appointment.ID_TiepNhan}
      </h2>

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

