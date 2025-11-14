import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import SignIn from './pages/SignIn';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import EmailVerification from './pages/ForgotPassword/EmailVerification';
import ResetPassword from './pages/ForgotPassword/ResetPassword';
import Success from './pages/ForgotPassword/Success';
import LayoutApp from './layouts/LayoutApp';
import Doctors from './pages/Doctors';
import Patients from './pages/Patients';
import Patient from './pages/Patient';
import Reception from './pages/Reception';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route element={<LayoutApp />}>
            <Route index element={<Doctors />} />
            <Route path='patients' element={<Patients />} />
            <Route path='patients/:ID_BenhNhan' element={<Patient />} />
            <Route path='reception' element={<Reception />} />
          </Route>

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
