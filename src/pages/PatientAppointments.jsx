import styled from 'styled-components';
import PatientSelfProfile from '../features/patients/PatientSelfProfile';

const Layout = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f5f6f8;
`;

function PatientAppointments() {
  return (
    <Layout>
      <PatientSelfProfile initialSection='appointments' />
    </Layout>
  );
}

export default PatientAppointments;
