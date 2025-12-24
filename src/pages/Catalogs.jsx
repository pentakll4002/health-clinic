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

function Catalogs() {
  return (
    <Layout>
      <Header>
        <div className='flex flex-col gap-1'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>Danh mục nền</h2>
          <p className='text-sm text-grey-500'>Quản lý dữ liệu danh mục dùng chung trong hệ thống</p>
        </div>
      </Header>

      <div className='p-6 bg-white border rounded-lg border-grey-transparent shadow-1'>
        <p className='text-sm text-grey-600'>Trang này đang được hoàn thiện. Gợi ý danh mục:</p>
        <div className='grid grid-cols-1 gap-3 mt-4 md:grid-cols-2'>
          <div className='p-4 border rounded-md border-grey-transparent'>
            <p className='font-semibold text-grey-900'>Loại bệnh</p>
            <p className='mt-1 text-sm text-grey-500'>Danh sách loại bệnh</p>
          </div>
          <div className='p-4 border rounded-md border-grey-transparent'>
            <p className='font-semibold text-grey-900'>Đơn vị tính</p>
            <p className='mt-1 text-sm text-grey-500'>Quy đổi & hiển thị đơn vị</p>
          </div>
          <div className='p-4 border rounded-md border-grey-transparent'>
            <p className='font-semibold text-grey-900'>Cách dùng</p>
            <p className='mt-1 text-sm text-grey-500'>Hướng dẫn sử dụng thuốc</p>
          </div>
          <div className='p-4 border rounded-md border-grey-transparent'>
            <p className='font-semibold text-grey-900'>Danh mục khác</p>
            <p className='mt-1 text-sm text-grey-500'>Bổ sung theo nhu cầu</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Catalogs;
