import styled from 'styled-components';
import PatientSelfProfile from '../features/patients/PatientSelfProfile';

const Layout = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f5f6f8;
`;

function PatientMedicalRecords() {
  return (
    <Layout>
      <PatientSelfProfile initialSection='medicalRecords' />
    </Layout>
  );
}

export default PatientMedicalRecords;
