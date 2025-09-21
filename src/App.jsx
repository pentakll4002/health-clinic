import { Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn/SignIn';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';

function App() {
  return (
    <Routes>
      <Route path='/' element={<SignIn />} />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path='/sign-up' element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
