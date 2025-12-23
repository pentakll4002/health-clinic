import styled from 'styled-components';
import Table from '../../ui/Table';
import { useDoctors } from './useDoctors';
import Spinner from '../../ui/Spinner';
import Pagination from '../../ui/Pagination';
import DoctorImg from '../../assets/doctors.png';

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

const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const DoctorsTableContainer = () => {
  const navigate = useNavigate();
  const { isLoading, doctors = [], totalCount } = useDoctors();

  if (isLoading) return <Spinner />;

  if (doctors.length === 0) {
    return (
      <div className='text-center py-10 text-grey-500 bg-white rounded-lg border border-grey-transparent'>
        Không tìm thấy bác sĩ nào
      </div>
    );
  }

  return (
    <Container>
      <Table columns='80px 2fr 1.5fr 1.5fr 1.5fr 1fr'>
        <Table.Header>
          <div className='text-center'>Ảnh</div>
          <div className='text-center'>Họ Tên</div>
          <div className='text-center'>Ngày Sinh</div>
          <div className='text-center'>Nhóm</div>
          <div className='text-center'>Điện Thoại</div>
          <div className='text-center'>Thao Tác</div>
        </Table.Header>

        <Table.Body
          data={doctors}
          render={(doctor) => {
            const groupName = doctor.nhom_nguoi_dung?.TenNhom ?? doctor.nhomNguoiDung?.TenNhom ?? 'Không xác định';
            const groupCode = doctor.nhom_nguoi_dung?.MaNhom ?? doctor.nhomNguoiDung?.MaNhom;
            
            return (
              <Table.Row key={doctor.ID_NhanVien}>
                <div className='flex justify-center'>
                  <Image src={doctor.HinhAnh || DoctorImg} alt={doctor.HoTenNV} />
                </div>
                <Text className='text-center'>{doctor.HoTenNV}</Text>
                <Text className='text-center'>{doctor.NgaySinh || '—'}</Text>
                <div className='flex flex-col items-center gap-1'>
                  <Text>{groupName}</Text>
                  {groupCode && (
                    <span className='inline-block rounded-full bg-primary-transparent text-primary text-[11px] px-2 py-[1px]'>
                      {groupCode}
                    </span>
                  )}
                </div>
                <Text className='text-center'>{doctor.DienThoai || '—'}</Text>
                <div className='flex justify-center'>
                  <Text className='text-grey-500'>—</Text>
                </div>
              </Table.Row>
            );
          }}
        />
      </Table>
      <Pagination count={totalCount} />
    </Container>
  );
};

export default DoctorsTableContainer;

