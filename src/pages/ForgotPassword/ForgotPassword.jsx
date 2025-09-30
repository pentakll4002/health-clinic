import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { useState } from 'react';

import LayoutAuth from '../../layouts/LayoutAuth';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

import { EnvelopeIcon } from '@heroicons/react/24/outline';
import forgotPasswordImg from '../../assets/forgot_password.png';

const schema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Vui lòng nhập tên đăng nhập'),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  // const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/forgot-password',
        data
      );
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LayoutAuth
      heading='Forgot Password'
      paragraph='No worries, we’ll send you reset instructions'
      picture={forgotPasswordImg}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <p className='mb-4 text-center text-red-500'>{error}</p>}
        {message && (
          <p className='mb-4 text-center text-green-500'>{message}</p>
        )}
        <FormRow
          label='Email Address'
          name='email'
          error={errors.email?.message}
        >
          <Input
            control={control}
            name='email'
            type='email'
            placeholder='Enter Email Address'
            icon={<EnvelopeIcon />}
          />
        </FormRow>

        <Button
          type='submit'
          className='w-full text-white bg-primary'
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Submit'}
        </Button>

        <span className='flex items-center justify-center mt-5 text-sm font-normal text-center gap-x-3'>
          Return to{' '}
          <Link to='/sign-in' className='text-primary hover:underline '>
            Login
          </Link>
        </span>
      </form>
    </LayoutAuth>
  );
};

export default ForgotPassword;
