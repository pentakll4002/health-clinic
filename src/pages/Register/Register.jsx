import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import LayoutAuth from '../../layouts/LayoutAuth';
import SignUpImg from '../../assets/register.png';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import ButtonSocial from '../../ui/ButtonSocial';

import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import logoFacebook from '../../assets/bi_facebook.png';
import logoGoogle from '../../assets/Google_Logo.png';
import logoApple from '../../assets/Apple_Logo.png';
import CheckBox from '../../ui/CheckBox';

const schema = yup.object({
  name: yup.string().required('Vui lòng nhập tên đăng nhập'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Vui lòng nhập tên đăng nhập'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu tối đa 8 kí tự'),
  confirmPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu tối đa 8 kí tự'),
});

const Register = () => {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  function handleShowPassword() {
    setShowPassword(!showPassword);
  }

  async function onSubmit(data) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/api/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      alert(response.data.message);
      navigate('/sign-in'); // Redirect to login page after successful registration
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LayoutAuth
      heading='Register'
      paragraph='Please enter your details to create account'
      picture={SignUpImg}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <FormRow label='Full name' name='name' error={errors.name?.message}>
          <Input
            control={control}
            name='name'
            type='name'
            placeholder='Enter name'
            icon={<UserIcon />}
          />
        </FormRow>

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
              <EyeSlashIcon className='w-6 h-6' onClick={handleShowPassword} />
            ) : (
              <EyeIcon className='w-6 h-6' onClick={handleShowPassword} />
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
            type={!showPassword ? 'password' : 'string'}
            placeholder='************'
            icon={<LockClosedIcon />}
          >
            {!showPassword ? (
              <EyeSlashIcon className='w-6 h-6' onClick={handleShowPassword} />
            ) : (
              <EyeIcon className='w-6 h-6' onClick={handleShowPassword} />
            )}
          </Input>
        </FormRow>

        <CheckBox
          name='term'
          onClick={() => {
            setChecked(!checked);
          }}
          checked={checked}
        >
          I agree to the{' '}
          <Link className='underline text-primary'>
            Terms of Service & Privacy Policy
          </Link>
        </CheckBox>

        <Button type='submit' className='w-full text-white bg-primary' disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>

        <div className='h-[20px] w-full flex items-center justify-between my-5'>
          <div className='h-[1px] bg-grey-transparent w-[165px]'></div>
          <p className='text-grey-500 text-[13px]'>OR</p>
          <div className='h-[1px] bg-grey-transparent w-[165px]'></div>
        </div>

        <div className='flex flex-col gap-y-5'>
          <div className='flex items-center justify-between'>
            <ButtonSocial ImgSocial={logoFacebook}></ButtonSocial>
            <ButtonSocial ImgSocial={logoGoogle}></ButtonSocial>
            <ButtonSocial ImgSocial={logoApple}></ButtonSocial>
          </div>
          <p className='text-sm font-normal text-center text-grey-900'>
            Already have an account yet?{' '}
            <Link to='/sign-in' className=' text-primary hover:underline'>
              Login
            </Link>
          </p>
        </div>
      </form>
    </LayoutAuth>
  );
};

export default Register;
