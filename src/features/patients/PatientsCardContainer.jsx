import styled from 'styled-components';
import PatientsCard from './PatientsCard';

const ContainerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
`;

const PatientsCardContainer = () => {
  return (
    <ContainerGrid>
      <PatientsCard />
      <PatientsCard />
      <PatientsCard />
      <PatientsCard />
      <PatientsCard />
      <PatientsCard />
      <PatientsCard />
      <PatientsCard />
      <PatientsCard />
    </ContainerGrid>
  );
};

export default PatientsCardContainer;
