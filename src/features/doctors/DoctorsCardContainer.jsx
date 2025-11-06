import styled from 'styled-components';
import DoctorsCard from '../../features/doctors/DoctorsCard';
import Pagination from '../../ui/Pagination';
import { useDoctors } from './useDoctors';
import Spinner from '../../ui/Spinner';

const ContainerList = styled.div`
  display: flex;
  flex-direction: column;
`;

const CenteredSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 240px;
`;

const DoctorsCardContainer = () => {
  const { isLoading, doctors = [], totalCount } = useDoctors();

  if (isLoading) return (
    <CenteredSpinner><Spinner /></CenteredSpinner>
  );

  return (
    <ContainerList>
      {doctors.map((doctor) => (
        <DoctorsCard key={doctor.id} doctor={doctor} />
      ))}
      <Pagination count={totalCount} />
    </ContainerList>
  );
};

export default DoctorsCardContainer;
