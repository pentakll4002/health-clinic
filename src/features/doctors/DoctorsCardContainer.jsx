import styled from 'styled-components';
import DoctorsCard from '../../features/doctors/DoctorsCard';
import Pagination from '../../ui/Pagination';
import { useDoctors } from './useDoctors';
import Spinner from '../../ui/Spinner';

const ContainerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
`;

const ContainerList = styled.div`
  display: flex;
  flex-direction: column;
`;

const DoctorsCardContainer = ({ layout }) => {
  const { isLoading, doctors, totalCount } = useDoctors();

  if (isLoading) return <Spinner />;

  if (layout === 'grid') {
    return <ContainerGrid></ContainerGrid>;
  }

  if (layout === 'list') {
    return (
      <ContainerList>
        {doctors.map((doctor) => (
          <DoctorsCard key={doctor.id} layout='list' doctor={doctor} />
        ))}
        <Pagination count={totalCount} />
      </ContainerList>
    );
  }
};

export default DoctorsCardContainer;
