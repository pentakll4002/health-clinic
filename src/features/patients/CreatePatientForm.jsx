import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import Button from '../../ui/Button';
import InputImage from '../../ui/InputImage';

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  margin: 0 auto;
  min-width: 600px;
`;

const CreatePatientForm = () => {
  const { register, handleSubmit, reset, getValues, formState } = useForm();

  const { errors } = formState;

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <div>
      <div className='w-full pb-4 mb-10 border-b border-grey-transparent'>
        <h2 className='text-xl font-bold'>Thông tin bệnh nhân</h2>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputImage />
        <div />

        <FormRow label='Họ Tên*' error={errors.name?.message}>
          <InputNew
            type='text'
            id='name'
            {...register('name', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='ID Bệnh Nhân' error={errors.id_benhnhan?.message}>
          <InputNew
            type='text'
            id='id_benhnhan'
            {...register('id_benhnhan', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='Căn cước công dân*' error={errors.cccd?.message}>
          <InputNew
            type='text'
            id='cccd'
            {...register('cccd', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='Số điện thoại*' error={errors.sdt?.message}>
          <InputNew
            id='sdt'
            type='text'
            {...register('sdt', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='Email*' error={errors.email?.message}>
          <InputNew
            type='email'
            id='email'
            {...register('email', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='Giới tính' error={errors.gender?.message}>
          <InputNew
            type='text'
            id='gender'
            {...register('gender', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='Địa chỉ' error={errors.address?.message}>
          <InputNew
            id='address'
            type='text'
            {...register('address', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='Ngày sinh' error={errors.birthday?.message}>
          <InputNew
            id='birthday'
            type='text'
            {...register('birthday', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>
        
        <FormRow label='Trạng thái' error={errors.status?.message}>
          <InputNew
            id='status'
            type='text'
            {...register('status', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>
        
        <FormRow label='Ngày đăng ký' error={errors.ngaydk?.message}>
          <InputNew
            id='ngaydk'
            type='text'
            {...register('ngaydk', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <div />

        <div className='flex items-end justify-end gap-x-3'>
          <Button
            className='bg-light text-grey-900 px-[10px] py-[6px]'
            onClick={() => {
              reset;
            }}
          >
            Cancel
          </Button>
          <Button
            className='text-white bg-primary px-[10px] py-[6px] font-medium'
            type='submit'
          >
            Add doctor
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreatePatientForm;

