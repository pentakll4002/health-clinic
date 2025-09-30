import LayoutAuth from '../../layouts/LayoutAuth';
import InputOTP from '../../ui/InputOTP';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';

import Button from '../../ui/Button';

import EmailSendImg from '../../assets/email_send.png';
import formatTime from '../../utils/formatTime';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
  otp: yup
    .string()
    .required('OTP không được để trống')
    .matches(/^[0-9]+$/, 'OTP chỉ được chứa số')
    .length(4, 'OTP phải đủ 4 số'),
});

const EmailVerification = () => {
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { otp: '' },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  function onSubmit() {
    console.log('Submit OTP');
    navigate('/forgot-password/reset')
  }

  function handleResend() {
    setTimer(60);
  }

  return (
    <LayoutAuth
      heading='Email OTP Verification'
      paragraph='We sent a code to info@example.com'
      picture={EmailSendImg}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name='otp'
          control={control}
          render={({ field }) => (
            <InputOTP length={4} onOTPSubmit={(otp) => field.onChange(otp)} />
          )}
        />

        <p className={`text-error-900 text-sm text-center min-h-5 m-1`}>
          {errors.otp?.message || ' '}
        </p>

        <h2 className='mb-5 text-sm leading-5 text-center text-grey-500'>
          Didn't receive code.{' '}
          <button
            className='mr-3 underline text-primary'
            onClick={handleResend}
            disabled={timer > 0}
          >
            Resend Code
          </button>
          <span className=' text-error'>{formatTime(timer)}</span>
        </h2>

        <Button type='submit' className='w-full text-white bg-primary'>
          Verify & Proceed
        </Button>
      </form>
    </LayoutAuth>
  );
};

export default EmailVerification;
