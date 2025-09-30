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
import { Link, useNavigate } from 'react-router-dom';

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

  function onSubmit(data) {
    console.log(data);
    navigate('/forgot-password/success');
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
          error={errors.password?.message}
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

        <Button type='submit' className='w-full text-white bg-primary'>
          Submit
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
