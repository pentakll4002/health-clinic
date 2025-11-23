import styled from 'styled-components';
import AppointmentsContainer from '../features/appointments/AppointmentsContainer';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { useAppointments } from '../features/appointments/useAppointments';
import AddAppointment from '../features/appointments/AddAppointment';
import Spinner from '../ui/Spinner';
import Search from '../features/Search/Search';
import Filter from '../ui/Filter';

const LayoutAppointments = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f5f6f8;
`;

const LayoutFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Appointments = () => {
  const { totalCount, isLoading } = useAppointments();

  if (isLoading) return <Spinner />;

  return (
    <LayoutAppointments>
      <LayoutFlex>
        <div className='flex items-center justify-center gap-x-3'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>
            Lịch Hẹn / Tiếp Nhận
          </h2>

          <div className='flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium border rounded-md text-primary border-primary bg-primary-transparent'>
            <span>Tổng lịch hẹn:</span>
            <span>{totalCount}</span>
          </div>

          <div className='ml-4'>
            <Search />
          </div>
        </div>

        <div className='flex items-center justify-center gap-x-4'>
          <Filter
            filterField='status'
            options={[
              { value: 'Tất cả', label: 'All' },
              { value: '', label: '' },
              { value: '', label: '' },
              { value: '', label: '' },
            ]}
          />

          {/* New Appointment */}
          <AddAppointment />
        </div>
      </LayoutFlex>

      <AppointmentsContainer />
    </LayoutAppointments>
  );
};

export default Appointments;
