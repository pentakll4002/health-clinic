import styled from 'styled-components';
import DoctorsCard from '../../features/doctors/DoctorsCard';
import Pagination from '../../ui/Pagination';
import { useDoctors } from './useDoctors';
import Spinner from '../../ui/Spinner';

const ContainerList = styled.div`
  display: flex;
  flex-direction: column;
`;

const DoctorsCardContainer = () => {
  const { isLoading, doctors = [], totalCount } = useDoctors();

  if (isLoading) return <Spinner />;

  return (
    <ContainerList>
      {doctors.map((doctor) => (
        <DoctorsCard key={doctor.id} layout='list' doctor={doctor} />
      ))}
      <Pagination count={totalCount} />
    </ContainerList>
  );
};

export default DoctorsCardContainer;
