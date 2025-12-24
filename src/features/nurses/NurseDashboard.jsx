import styled from 'styled-components';

const Layout = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f5f6f8;
`;

function NurseDashboard() {
  return (
    <Layout>
      <div className='bg-white rounded-lg border border-grey-transparent shadow-1 p-6'>
        <h2 className='text-xl font-bold leading-6 text-grey-900'>Trang chủ y tá</h2>
        <p className='mt-2 text-sm text-grey-600'>
          Vai trò hỗ trợ bác sĩ: theo dõi danh sách chờ, hỗ trợ khám và xem phiếu khám (read-only).
        </p>

        <div className='mt-5 grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='rounded-lg border border-grey-transparent p-4'>
            <p className='text-sm font-semibold text-grey-900'>Danh sách chờ</p>
            <p className='mt-1 text-sm text-grey-600'>Xem bệnh nhân đang chờ khám theo ngày.</p>
          </div>
          <div className='rounded-lg border border-grey-transparent p-4'>
            <p className='text-sm font-semibold text-grey-900'>Hỗ trợ khám</p>
            <p className='mt-1 text-sm text-grey-600'>Xem phiếu khám, hỗ trợ nhập thông tin (tuỳ backend).</p>
          </div>
          <div className='rounded-lg border border-grey-transparent p-4'>
            <p className='text-sm font-semibold text-grey-900'>Tra cứu nhanh</p>
            <p className='mt-1 text-sm text-grey-600'>Tra cứu bệnh nhân/phiếu khám từ các màn liên quan.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NurseDashboard;
