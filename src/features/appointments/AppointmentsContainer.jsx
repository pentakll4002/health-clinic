import Table from '../../ui/Table';
import AppointmentRow from './AppointmentRow';
import { useAppointments } from './useAppointments';
import Spinner from '../../ui/Spinner';
import LoadMore from '../../ui/LoadMore';

const AppointmentsContainer = () => {
  const { isLoading, appointments, hasMore, loadMore } = useAppointments();

  if (isLoading) return <Spinner />;

  if (appointments.length === 0) {
    return (
      <div className='text-center py-10 text-grey-500'>
        Không có lịch hẹn nào
      </div>
    );
  }

  return (
    <>
      <div className='bg-white rounded-lg border border-grey-transparent overflow-hidden'>
        <Table columns='2fr 2fr 2fr 2fr 2fr 2fr 2fr'>
          <Table.Header>
            <div className='mx-auto'>ID Tiếp Nhận</div>
            <div className='mx-auto'>Ngày Giờ</div>
            <div className='mx-auto'>Ca</div>
            <div className='mx-auto'>Bệnh Nhân</div>
            <div className='mx-auto'>Nhân Viên</div>
            <div className='mx-auto'>Trạng Thái</div>
            <div className='mx-auto'>Thao Tác</div>
          </Table.Header>

          <Table.Body
            data={appointments}
            render={(appointment) => (
              <AppointmentRow
                key={appointment.ID_TiepNhan}
                appointment={appointment}
              />
            )}
          />
        </Table>
      </div>

      {!hasMore ? (
        <span />
      ) : (
        <LoadMore onClick={loadMore} disabled={!hasMore} />
      )}
    </>
  );
};

export default AppointmentsContainer;

