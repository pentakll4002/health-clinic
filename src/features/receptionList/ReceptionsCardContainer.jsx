import { useReceptionsToday } from './useReceptionsToday';
import ReceptionCard from './ReceptionCard';
import Spinner from '../../ui/Spinner';
import styled from 'styled-components';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
`;

const ReceptionsCardContainer = ({ searchParams = {} }) => {
  const { receptions, isLoading, totalCount } = useReceptionsToday(searchParams);

  if (isLoading) return <Spinner />;

  if (receptions.length === 0) {
    return (
      <div className='flex items-center justify-center p-10 text-grey-500'>
        <p>Không có bệnh nhân nào đã tiếp nhận trong ngày hôm nay</p>
      </div>
    );
  }

  return (
    <>
      <div className='mb-4 text-sm text-grey-600'>
        Tổng số: <strong>{totalCount}</strong> bệnh nhân chờ khám
      </div>
      <GridContainer>
        {receptions.map((tiepNhan) => (
          <ReceptionCard key={tiepNhan.ID_TiepNhan} tiepNhan={tiepNhan} />
        ))}
      </GridContainer>
    </>
  );
};

export default ReceptionsCardContainer;









