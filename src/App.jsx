import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import SignIn from './pages/SignIn/SignIn';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import EmailVerification from './pages/ForgotPassword/EmailVerification';
import ResetPassword from './pages/ForgotPassword/ResetPassword';
import Success from './pages/ForgotPassword/Success';
import LayoutApp from './layouts/LayoutApp';
import Doctors from './pages/Doctors';
import Patients from './pages/Patients';
import Patient from './pages/Patient';

import Reception from './pages/Reception';

import Drugs from './pages/Drugs';
import DrugDetail from './pages/DrugDetail';
import MedicalForms from './pages/MedicalForms';
import Invoices from './pages/Invoices';
import Appointments from './pages/Appointments';
import AppointmentProfile from './pages/AppointmentProfile';
import PatientProfilePage from './pages/PatientProfile';
import Reports from './pages/Reports';
import Regulations from './pages/Regulations';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function RequireAuth({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token =
    localStorage.getItem('token') || localStorage.getItem('auth_token');

  useEffect(() => {
    if (!token) {
      // Nếu chưa đăng nhập thì chuyển về /sign-in
      if (
        location.pathname !== '/sign-in' &&
        location.pathname !== '/sign-up' &&
        !location.pathname.startsWith('/forgot-password')
      ) {
        navigate('/sign-in');
      }
    }
  }, [token, navigate, location]);

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position='top-right' />
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route
            element={
              // <RequireAuth>
              <LayoutApp />
              // </RequireAuth>
            }
          >
            <Route index element={<Doctors />} />
            <Route path='patients' element={<Patients />} />
            <Route path='patients/profile' element={<PatientProfilePage />} />
            <Route path='patients/:ID_BenhNhan' element={<Patient />} />
            <Route path='reception' element={<Reception />} />
            <Route path='drugs' element={<Drugs />} />
            <Route path='drugs/:id' element={<DrugDetail />} />
            <Route path='medical-forms' element={<MedicalForms />} />
            <Route path='invoices' element={<Invoices />} />
            <Route path='appointments' element={<Appointments />} />
            <Route path='appointments/:id' element={<AppointmentProfile />} />
            <Route path='reports' element={<Reports />} />
            <Route path='regulations' element={<Regulations />} />
          </Route>

          {/* Các route public */}
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<Register />} />
          <Route path='/forgot-password'>
            <Route index element={<ForgotPassword />} />
            <Route path='email-verification' element={<EmailVerification />} />
            <Route path='reset' element={<ResetPassword />} />
            <Route path='success' element={<Success />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
