import { BrowserRouter, Route, Routes } from 'react-router-dom';

import SignIn from './pages/SignIn/SignIn';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import EmailVerification from './pages/ForgotPassword/EmailVerification';
import ResetPassword from './pages/ForgotPassword/ResetPassword';
import Success from './pages/ForgotPassword/Success';
import LayoutApp from './layouts/LayoutApp';

function App() {
  return (
<<<<<<< HEAD
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route element={<LayoutApp />}>
            <Route />
          </Route> */}
          <Route path='/' element={<LayoutApp />} />
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
      {/* <Toaster
        position='top-center'
        gutter={12}
        containerStyle={{ margin: '8px' }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          Error: {
            duration: 5000,
          },
          style: {
            fontSize: '16px',
            maxWidth: '500px',
            padding: '16px 24px',
            backgroundColor: '#fff',
            color: '#374151',
          },
        }}
      /> */}
    </>
=======
    <Routes>
      <Route path='/' element={<SignIn />} />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path='/sign-up' element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
    </Routes>
>>>>>>> 50a0874bfadf8501b649a07ac3143a242466fa8e
  );
}

export default App;
