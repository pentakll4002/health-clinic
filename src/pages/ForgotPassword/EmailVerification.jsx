import LayoutAuth from '../../layouts/LayoutAuth';
import Input from '../../ui/Input';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';

import Button from '../../ui/Button';

import EmailSendImg from '../../assets/email_send.png';
import formatTime from '../../utils/formatTime';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { KeyIcon } from '@heroicons/react/24/outline';

const schema = yup.object({
  otp: yup.string().required('Mã xác nhận không được để trống'),
});

const EmailVerification = () => {
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, token } = location.state || {};

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { otp: token || '' },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (!email || !token) {
      navigate('/forgot-password');
    }
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, email, token, navigate]);

  async function onSubmit(data) {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/verify-otp', {
        email,
        token: token,
      });
      console.log(response.data.message);
      navigate('/forgot-password/reset', { state: { email, token } });
    } catch (err) {
      setError(err.response?.data?.message || 'Xác nhận mã OTP thất bại');
    } finally {
      setLoading(false);
    }
  }

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/forgot-password', { email });
      console.log('Resend successful:', response.data.message);
      setTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Gửi lại mã OTP thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAuth
      heading='Xác minh OTP qua Email'
      paragraph={email ? `Chúng tôi đã gửi một mã đến ${email}` : 'Chúng tôi đã gửi một mã đến email của bạn'}
      picture={EmailSendImg}
    >
      {token && (
        <p className="mb-4 text-center text-blue-500">[DEV-MODE] Token: {token}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name='otp'
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type='text'
              placeholder='Nhập mã xác nhận'
              icon={<KeyIcon />}
              control={control} // Pass control explicitly
              name='otp' // Pass name explicitly
            />
          )}
        />

        <p className={`text-error-900 text-sm text-center min-h-5 m-1`}>
          {errors.otp?.message || error || ' '}
        </p>

        <h2 className='mb-5 text-sm leading-5 text-center text-grey-500'>
          Chưa nhận được mã.{' '}
          <button
            className='mr-3 underline text-primary'
            onClick={handleResend}
            disabled={timer > 0 || loading}
          >
            Gửi lại mã
          </button>
          <span className=' text-error'>{formatTime(timer)}</span>
        </h2>

        <Button type='submit' className='w-full text-white bg-primary' disabled={loading}>
          {loading ? 'Đang xác minh...' : 'Xác minh & Tiếp tục'}
        </Button>
      </form>
    </LayoutAuth>
  );
};

export default EmailVerification;
