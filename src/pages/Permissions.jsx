import styled from 'styled-components';

const Layout = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f5f6f8;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

function Permissions() {
  return (
    <Layout>
      <Header>
        <div className='flex flex-col gap-1'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>Phân quyền</h2>
          <p className='text-sm text-grey-500'>Quản lý nhóm người dùng, chức năng và phân quyền hệ thống</p>
        </div>
      </Header>

      <div className='p-6 bg-white border rounded-lg border-grey-transparent shadow-1'>
        <p className='text-sm text-grey-600'>Trang này đang được hoàn thiện. Bạn có thể bổ sung các module:</p>
        <div className='grid grid-cols-1 gap-3 mt-4 md:grid-cols-2'>
          <div className='p-4 border rounded-md border-grey-transparent'>
            <p className='font-semibold text-grey-900'>NHOMNGUOIDUNG</p>
            <p className='mt-1 text-sm text-grey-500'>Quản lý role</p>
          </div>
          <div className='p-4 border rounded-md border-grey-transparent'>
            <p className='font-semibold text-grey-900'>CHUCNANG</p>
            <p className='mt-1 text-sm text-grey-500'>Quản lý chức năng</p>
          </div>
          <div className='p-4 border rounded-md border-grey-transparent'>
            <p className='font-semibold text-grey-900'>PHANQUYEN</p>
            <p className='mt-1 text-sm text-grey-500'>Gán quyền theo role</p>
          </div>
          <div className='p-4 border rounded-md border-grey-transparent'>
            <p className='font-semibold text-grey-900'>Audit</p>
            <p className='mt-1 text-sm text-grey-500'>Theo dõi thay đổi phân quyền</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Permissions;
