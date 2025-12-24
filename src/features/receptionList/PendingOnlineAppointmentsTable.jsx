import Table from '../../ui/Table';
import Spinner from '../../ui/Spinner';
import styled from 'styled-components';
import { useReceptions } from './useReceptions';
import PendingOnlineAppointmentsTableRow from './PendingOnlineAppointmentsTableRow';

const Container = styled.div`
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #e7e8eb;
  overflow: hidden;
`;

const PendingOnlineAppointmentsTable = ({ filterDate }) => {
  const params = {
    page: 1,
    limit: 100,
    TrangThaiTiepNhan: 'CHO_XAC_NHAN',
  };
  if (filterDate) params.ngay = filterDate;

  const { isLoading, data: receptions } = useReceptions(params);

  if (isLoading) return <Spinner />;

  if (!receptions || receptions.length === 0) {
    return (
      <div className='text-center py-10 text-grey-500 bg-white rounded-lg border border-grey-transparent'>
        Không có lịch hẹn online chờ duyệt
      </div>
    );
  }

  return (
    <Container>
      <Table columns='1fr 2fr 2fr 1fr 2fr 2fr'>
        <Table.Header>
          <div className='text-center'>ID</div>
          <div className='text-center'>Bệnh nhân</div>
          <div className='text-center'>Ngày khám</div>
          <div className='text-center'>Ca</div>
          <div className='text-center'>Bác sĩ</div>
          <div className='text-center'>Thao tác</div>
        </Table.Header>

        <Table.Body
          data={receptions}
          render={(tiepNhan) => (
            <PendingOnlineAppointmentsTableRow key={tiepNhan.ID_TiepNhan} tiepNhan={tiepNhan} />
          )}
        />
      </Table>
    </Container>
  );
};

export default PendingOnlineAppointmentsTable;
