import styled from 'styled-components';
import Table from '../../ui/Table';
import Spinner from '../../ui/Spinner';
import Pagination from '../../ui/Pagination';
import EmployeeRow from './EmployeeRow';
import { useEmployees } from './useEmployees';

const Wrapper = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 0;
  border: 1px solid #f3f4f6;
`;

const Footer = styled.div`
  margin-top: 16px;
`;

function EmployeesContainer() {
  const { employees = [], totalCount = 0, isLoading } = useEmployees();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-16'>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Wrapper>
        <Table columns='2fr 1fr 1fr 1.25fr 1fr 0.6fr'>
          <Table.Header>
            <span>Họ tên</span>
            <span>Nhóm</span>
            <span>Điện thoại</span>
            <span>Email</span>
            <span>Trạng thái</span>
            <span></span>
          </Table.Header>

          <Table.Body data={employees} render={(employee) => <EmployeeRow key={employee.ID_NhanVien} employee={employee} />} />
        </Table>
      </Wrapper>

      <Footer>
        <Pagination count={totalCount} />
      </Footer>
    </>
  );
}

export default EmployeesContainer;

