import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import Button from '../../ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 24px;
  row-gap: 16px;
  margin: 0 auto;
  width: 100%;
`;

const PatientSearchForm = ({ onSearch, onReset, isOpen }) => {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  function onSubmit(data) {
    // Chỉ gửi các trường có giá trị
    const searchParams = {};
    if (data.HoTenBN?.trim()) searchParams.HoTenBN = data.HoTenBN.trim();
    if (data.DienThoai?.trim()) searchParams.DienThoai = data.DienThoai.trim();
    if (data.CCCD?.trim()) searchParams.CCCD = data.CCCD.trim();
    if (data.ID_BenhNhan?.trim()) searchParams.ID_BenhNhan = data.ID_BenhNhan.trim();
    
    onSearch(searchParams);
  }

  function handleReset() {
    reset({
      HoTenBN: '',
      DienThoai: '',
      CCCD: '',
      ID_BenhNhan: '',
    });
    onReset();
  }

  if (!isOpen) return null;

  return (
    <div className='w-full p-4 mb-4 bg-white border rounded-lg border-grey-transparent shadow-1'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-grey-900'>Tra cứu bệnh nhân (BM6)</h3>
        <Button
          type='button'
          onClick={handleReset}
          className='flex items-center justify-center gap-1 px-2 py-1 text-sm bg-grey-100 text-grey-700 hover:bg-grey-200'
        >
          <XMarkIcon className='w-4 h-4' />
          Đóng
        </Button>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow label='Họ tên bệnh nhân' error={errors.HoTenBN?.message}>
          <InputNew
            type='text'
            id='HoTenBN'
            placeholder='Nhập họ tên'
            {...register('HoTenBN')}
          />
        </FormRow>

        <FormRow label='Số điện thoại' error={errors.DienThoai?.message}>
          <InputNew
            type='text'
            id='DienThoai'
            placeholder='Nhập số điện thoại'
            {...register('DienThoai', {
              pattern: {
                value: /^[0-9]*$/,
                message: 'Số điện thoại chỉ chứa số',
              },
            })}
          />
        </FormRow>

        <FormRow label='Căn cước công dân (CCCD)' error={errors.CCCD?.message}>
          <InputNew
            type='text'
            id='CCCD'
            placeholder='Nhập CCCD'
            {...register('CCCD', {
              pattern: {
                value: /^[0-9]*$/,
                message: 'CCCD chỉ chứa số',
              },
            })}
          />
        </FormRow>

        <FormRow label='ID Bệnh nhân' error={errors.ID_BenhNhan?.message}>
          <InputNew
            type='text'
            id='ID_BenhNhan'
            placeholder='Nhập ID bệnh nhân'
            {...register('ID_BenhNhan', {
              pattern: {
                value: /^[0-9]*$/,
                message: 'ID chỉ chứa số',
              },
            })}
          />
        </FormRow>

        <div className='flex items-end gap-x-3'>
          <Button
            type='submit'
            className='text-white bg-primary px-[10px] py-[6px] font-medium'
          >
            Tìm kiếm
          </Button>
          <Button
            type='button'
            onClick={handleReset}
            className='bg-light text-grey-900 px-[10px] py-[6px]'
          >
            Xóa bộ lọc
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PatientSearchForm;

