import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import Button from '../../ui/Button';
import { useCreateLichKham } from './useCreateLichKham';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 500px;
`;

const CreateLichKhamForm = ({ onCloseModal, onSuccess }) => {
  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;
  const { mutate: createLichKham, isLoading } = useCreateLichKham();

  // Lấy ngày hôm nay làm min date
  const today = new Date().toISOString().split('T')[0];

  function onSubmit(data) {
    createLichKham(
      {
        NgayKhamDuKien: data.NgayKhamDuKien,
        CaKham: data.CaKham,
        GhiChu: data.GhiChu || null,
      },
      {
        onSuccess: () => {
          reset();
          if (onCloseModal) onCloseModal();
          if (onSuccess) onSuccess();
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h2 className='text-xl font-bold text-grey-900 mb-4'>Đặt lịch khám</h2>

      <FormRow label='Ngày khám dự kiến' error={errors.NgayKhamDuKien?.message}>
        <InputNew
          type='date'
          id='NgayKhamDuKien'
          min={today}
          {...register('NgayKhamDuKien', {
            required: 'Vui lòng chọn ngày khám',
            validate: (value) => {
              const selectedDate = new Date(value);
              const todayDate = new Date();
              todayDate.setHours(0, 0, 0, 0);
              if (selectedDate < todayDate) {
                return 'Ngày khám phải từ hôm nay trở đi';
              }
              return true;
            },
          })}
        />
      </FormRow>

      <FormRow label='Ca khám' error={errors.CaKham?.message}>
        <select
          id='CaKham'
          className='w-full px-3 py-2 border border-grey-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
          {...register('CaKham', {
            required: 'Vui lòng chọn ca khám',
          })}
        >
          <option value=''>-- Chọn ca khám --</option>
          <option value='Sáng'>Sáng</option>
          <option value='Chiều'>Chiều</option>
          <option value='Tối'>Tối</option>
        </select>
      </FormRow>

      <FormRow label='Ghi chú (tùy chọn)' error={errors.GhiChu?.message}>
        <textarea
          id='GhiChu'
          rows={4}
          className='w-full px-3 py-2 border border-grey-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
          placeholder='Nhập ghi chú nếu có...'
          {...register('GhiChu', {
            maxLength: {
              value: 1000,
              message: 'Ghi chú không được vượt quá 1000 ký tự',
            },
          })}
        />
      </FormRow>

      <div className='flex gap-3 justify-end'>
        <Button
          type='button'
          onClick={() => reset()}
          className='bg-light text-grey-900 px-4 py-2'
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button
          type='submit'
          className='bg-primary text-white px-4 py-2'
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Đặt lịch'}
        </Button>
      </div>
    </Form>
  );
};

export default CreateLichKhamForm;

