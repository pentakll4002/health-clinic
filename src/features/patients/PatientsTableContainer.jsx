import styled from 'styled-components';
import Table from '../../ui/Table';
import { usePatients } from './usePatients';
import Spinner from '../../ui/Spinner';
import LoadMore from '../../ui/LoadMore';
import { useNavigate } from 'react-router-dom';
import { PencilIcon } from '@heroicons/react/16/solid';
import Button from '../../ui/Button';

const Container = styled.div`
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #e7e8eb;
  overflow: hidden;
`;

const Text = styled.span`
  color: #0a1b39;
  font-size: 14px;
  font-weight: 500;
  margin: auto;
`;

const PatientsTableContainer = ({ searchParams = {}, view = 'detail' }) => {
  const navigate = useNavigate();
  const { isLoading, patients, totalCount, hasMore, loadMore } = usePatients(searchParams);

  if (isLoading) return <Spinner />;

  if (patients.length === 0) {
    return (
      <div className='text-center py-10 text-grey-500 bg-white rounded-lg border border-grey-transparent'>
        Không tìm thấy bệnh nhân nào
      </div>
    );
  }

  // Determine columns based on view
  const columns = view === 'history' 
    ? '1fr 2fr 1fr 1fr 1fr 1fr 1fr' 
    : '1fr 2fr 1fr 1fr 1fr 1fr 1fr';

  return (
    <>
      <Container>
        <Table columns={columns}>
          <Table.Header>
            <div className='text-center'>ID</div>
            <div className='text-center'>Họ Tên</div>
            <div className='text-center'>Giới Tính</div>
            <div className='text-center'>Ngày Sinh</div>
            <div className='text-center'>Điện Thoại</div>
            <div className='text-center'>Địa Chỉ</div>
            <div className='text-center'>Thao Tác</div>
          </Table.Header>

          <Table.Body
            data={patients}
            render={(patient) => (
              <Table.Row key={patient.ID_BenhNhan}>
                <Text className='text-center'>{patient.ID_BenhNhan}</Text>
                <Text className='text-center'>{patient.HoTenBN}</Text>
                <Text className='text-center'>{patient.GioiTinh || '—'}</Text>
                <Text className='text-center'>{patient.NgaySinh || '—'}</Text>
                <Text className='text-center'>{patient.DienThoai || '—'}</Text>
                <Text className='text-center'>{patient.DiaChi || '—'}</Text>
                <div className='flex justify-center'>
                  <Button
                    onClick={() => navigate(`/patients/${patient.ID_BenhNhan}`)}
                    className='flex items-center gap-1 px-3 py-1 text-sm bg-primary text-white hover:bg-primary-dark'
                  >
                    <PencilIcon className='w-4 h-4' />
                    Chi tiết
                  </Button>
                </div>
              </Table.Row>
            )}
          />
        </Table>
      </Container>

      {!hasMore ? (
        <span />
      ) : (
        <LoadMore onClick={loadMore} disabled={!hasMore} />
      )}
    </>
  );
};

export default PatientsTableContainer;















