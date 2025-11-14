import styled from 'styled-components';
import RegulationsForm from '../features/regulations/RegulationsForm';

const LayoutRegulations = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f5f6f8;
`;

const LayoutHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Regulations = () => {
  return (
    <LayoutRegulations>
      <LayoutHeader>
        <div className='flex flex-col gap-1'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>
            Thay đổi quy định
          </h2>
          <p className='text-sm text-grey-500'>
            Cập nhật số bệnh nhân tối đa, tiền khám và tỷ lệ đơn giá bán
          </p>
        </div>
      </LayoutHeader>

      <RegulationsForm />
    </LayoutRegulations>
  );
};

export default Regulations;


