import LayoutAuth from '../../layouts/LayoutAuth';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import useToggleValue from '../../hooks/useToggleValue';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

import resetImg from '../../assets/reset-password.png';
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import Button from '../../ui/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useState } from 'react';

const schema = yup.object({
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu tối đa 8 kí tự'),
  confirmPassword: yup
    .string()
    .label('confirm password')
    .required('Vui lòng nhập mật khẩu')
    .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp'),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, token } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { value: showPassword, handleToggleValue: handleSetShowPassword } =
    useToggleValue(false);
  const {
    value: showConfirmPassword,
    handleToggleValue: handleSetShowConfirmPassword,
  } = useToggleValue(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  async function onSubmit(data) {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/reset-password', {
        email,
        token,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });
      console.log(response.data.message);
      navigate('/forgot-password/success');
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  }
  return (
    <LayoutAuth
      heading='Reset Password'
      paragraph='Your new password must be different from previous used passwords.'
      picture={resetImg}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRow
          label='Password'
          name='password'
          error={errors.password?.message || error}
        >
          <Input
            control={control}
            name='password'
            type={!showPassword ? 'password' : 'string'}
            placeholder='************'
            icon={<LockClosedIcon />}
          >
            {!showPassword ? (
              <EyeSlashIcon
                className='w-6 h-6'
                onClick={handleSetShowPassword}
              />
            ) : (
              <EyeIcon className='w-6 h-6' onClick={handleSetShowPassword} />
            )}
          </Input>
        </FormRow>

        <FormRow
          label='Confirm password'
          name='confirmPassword'
          error={errors.confirmPassword?.message}
        >
          <Input
            control={control}
            name='confirmPassword'
            type={!showConfirmPassword ? 'password' : 'string'}
            placeholder='************'
            icon={<LockClosedIcon />}
          >
            {!showConfirmPassword ? (
              <EyeSlashIcon
                className='w-6 h-6'
                onClick={handleSetShowConfirmPassword}
              />
            ) : (
              <EyeIcon
                className='w-6 h-6'
                onClick={handleSetShowConfirmPassword}
              />
            )}
          </Input>
        </FormRow>

        <Button type='submit' className='w-full text-white bg-primary' disabled={loading}>
          {loading ? 'Resetting...' : 'Submit'}
        </Button>

        <p className='m-5 text-sm leading-5 text-center text-grey-900'>
          Return to{' '}
          <Link to={'/sign-in'} className='text-primary hover:underline'>
            Login
          </Link>
        </p>
      </form>
    </LayoutAuth>
  );
};

export default ResetPassword;
