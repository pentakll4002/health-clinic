import styled from 'styled-components';
import PatientsCard from './PatientsCard';
import LoadMore from '../../ui/LoadMore';
import { usePatients } from './usePatients';
import Spinner from '../../ui/Spinner';

const ContainerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
`;

const PatientsCardContainer = ({ searchParams = {} }) => {
  const { isLoading, patients, totalCount, hasMore, loadMore } = usePatients(searchParams);

  if (isLoading) return <Spinner />;
  
  return (
    <>
      <ContainerGrid>
        {patients.length === 0 ? (
          <div className='col-span-3 text-center py-8 text-grey-500'>
            Không tìm thấy bệnh nhân nào
          </div>
        ) : (
          patients.map((patient) => (
            <PatientsCard key={patient.ID_BenhNhan} patient={patient} />
          ))
        )}
      </ContainerGrid>
      
      {!hasMore ? (
        <span />
      ) : (
        <LoadMore onClick={loadMore} disabled={!hasMore} />
      )}
    </>
  );
};

export default PatientsCardContainer;
