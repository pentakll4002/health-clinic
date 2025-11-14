import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import Button from '../../ui/Button';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ReceptionForm = ({ patient }) => {
  const { register, handleSubmit, formState } = useForm();

  const { errors } = formState;

  function onSubmit(data) {
    const payload = {
      ...data,
      ID_BenhNhan: patient.ID_BenhNhan,
      is_Delete: false,
    };

    console.log(payload);
  }
  return (
    <div className='w-[500px]'>
      <div className='w-full pb-4 mb-10 border-b border-grey-transparent'>
        <h2 className='text-xl font-bold'>Phiếu tiếp nhận</h2>
      </div>

      <div className='flex flex-col mb-8 text-sm font-medium text-grey-900 gap-y-2'>
        <p>
          Tên bệnh nhân:{' '}
          <span className='text-[16px] font-semibold text-primary'>
            {patient.HoTenBN}
          </span>
        </p>
        <p>
          CCCD:{' '}
          <span className='text-[16px] font-semibold text-primary'>
            {patient.CCCD}
          </span>
        </p>
        <p>
          Số điện thoại:{' '}
          <span className='text-[16px] font-semibold text-primary'>
            {patient.DienThoai}
          </span>
        </p>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow inline label='Ngày tiếp nhận:'>
          <InputNew
            type='date'
            name='NgayTN'
            {...register('NgayTN', {
              required: 'Bắt buộc !',
            })}
            defaultValue={new Date().toISOString().slice(0, 10)}
          />
        </FormRow>

        <FormRow inline label='Ca tiếp nhận*:' error={errors.caTN?.message}>
          <InputNew
            type='text'
            name='caTN'
            {...register('caTN', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow inline label='Trạng thái*:' error={errors.TrangThai?.message}>
          <InputNew
            type='text'
            name='TrangThai'
            defaultValue='Chờ khám'
            {...register('TrangThai', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow
          inline
          label='Nhân viên tiếp nhận:'
          error={errors.ID_NhanVien?.message}
        >
          <InputNew
            type='text'
            name='ID_NhanVien'
            {...register('ID_NhanVien', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <Button type='submit' className='bg-primary w-[30%] text-white ml-auto'>
          Thêm hồ sơ
        </Button>
      </Form>
    </div>
  );
};

export default ReceptionForm;
