import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import Button from '../../ui/Button';
import InputImage from '../../ui/InputImage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDoctor, createDoctor, fetchGroups } from './APIdoctors';
import { useEffect, useState } from 'react';

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 16px;
  column-gap: 24px;
  margin: 0 auto;
  min-width: 600px;
`;

const CreateDoctorForm = ({ doctor = null, onSuccess }) => {
  const isEdit = !!doctor;
  const { register, handleSubmit, reset, setValue, formState } = useForm({
    defaultValues: doctor || {},
  });

  const { errors } = formState;

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: isEdit
      ? (data) => updateDoctor(doctor.ID_NhanVien, data)
      : createDoctor,
    onSuccess: () => {
      if (onSuccess) onSuccess();
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      reset();
    },
    onError: (err) => alert(err.message),
  });

  const [groups, setGroups] = useState([]);
  useEffect(() => {
    fetchGroups().then(setGroups);
  }, []);

  useEffect(() => {
    if (isEdit) {
      Object.keys(doctor).forEach(key => {
        setValue(key, doctor[key]);
      });
    }
  }, [isEdit, doctor, setValue]);

  function onSubmit(data) {
    const payload = {
      email: data.email,
      password: data.password, 
      HoTenNV: data.name,
      NgaySinh: data.birthday,
      GioiTinh: data.gender,
      CCCD: data.cccd,
      DienThoai: data.sdt,
      DiaChi: data.address,
      HinhAnh: data.avatarUrl || 'default_avatar.jpg',
      ID_Nhom: Number(data.id_nhom),
    };
    if (isEdit && !payload.password) delete payload.password; // Sửa không cần gửi password nếu bỏ trống
    mutate(payload);
  }

  return (
    <div>
      <div className='w-full pb-4 mb-10 border-b border-grey-transparent'>
        <h2 className='text-xl font-bold'>Thông tin bác sĩ</h2>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputImage />

        <FormRow label='Name*' error={errors.name?.message}>
          <InputNew
            type='text'
            id='name'
            disabled={isLoading}
            {...register('name', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='Password*' error={errors.password?.message}>
          <InputNew
            type='password'
            id='password'
            disabled={isLoading}
            {...register('password', {
              required: 'Bắt buộc !',
              minLength: {value: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự'}
            })}
          />
        </FormRow>

        <FormRow label='Ngày sinh*' error={errors.birthday?.message}>
          <InputNew
            type='date'
            id='birthday'
            disabled={isLoading}
            {...register('birthday', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='Căn cước công dân*' error={errors.cccd?.message}>
          <InputNew
            type='text'
            id='cccd'
            disabled={isLoading}
            {...register('cccd', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='Số điện thoại*' error={errors.sdt?.message}>
          <InputNew
            id='sdt'
            type='text'
            disabled={isLoading}
            {...register('sdt', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='Email*' error={errors.email?.message}>
          <InputNew
            type='email'
            id='email'
            disabled={isLoading}
            {...register('email', {
              required: 'Bắt buộc !',
              pattern: {value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, message: 'Email không hợp lệ'}
            })}
          />
        </FormRow>

        <FormRow label='Giới tính' error={errors.gender?.message}>
          <InputNew
            type='text'
            id='gender'
            disabled={isLoading}
            {...register('gender', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='Địa chỉ' error={errors.address?.message}>
          <InputNew
            id='address'
            type='text'
            disabled={isLoading}
            {...register('address', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='URL Hình ảnh' error={errors.avatarUrl?.message}>
          <InputNew
            type='text'
            id='avatarUrl'
            disabled={isLoading}
            defaultValue='default_avatar.jpg'
            {...register('avatarUrl')}
          />
        </FormRow>

        <FormRow label='Nhóm người dùng*' error={errors.id_nhom?.message}>
          <select
            id='id_nhom'
            disabled={isLoading}
            {...register('id_nhom', {required: 'Bắt buộc !'})}
            defaultValue=''
          >
            <option value='' disabled>-- Chọn nhóm --</option>
            {groups.map(({ID_Nhom, TenNhom}) => (
              <option key={ID_Nhom} value={ID_Nhom}>{TenNhom}</option>
            ))}
          </select>
        </FormRow>

        <div className='flex items-end justify-end gap-x-3'>
          <Button
            className='bg-light text-grey-900 px-[10px] py-[6px]'
            type='reset'
            disabled={isLoading}
            onClick={() => {
              reset();
            }}
          >
            Huỷ
          </Button>
          <Button
            className='text-white bg-primary px-[10px] py-[6px] font-medium'
            type='submit'
            disabled={isLoading}
          >
            {isEdit ? (isLoading ? 'Đang lưu...' : 'Lưu thay đổi') : (isLoading ? 'Đang thêm...' : 'Thêm Bác sĩ')}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateDoctorForm;
