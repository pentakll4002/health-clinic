import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * This file is deprecated. Use /Register/Register.jsx instead.
 * Redirecting to the new OTP-based registration flow.
 */
const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new Register component
    navigate('/register-otp');
  }, [navigate]);

  return null;
};

export default Register;
