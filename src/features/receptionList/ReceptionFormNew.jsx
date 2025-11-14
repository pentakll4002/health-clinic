import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import Button from '../../ui/Button';
import InputImage from '../../ui/InputImage';

const Grid2Col = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 16px;
  column-gap: 24px;
  margin: 0 auto;
  min-width: 600px;
`;

const ReceptionFormNew = () => {
  const { register, handleSubmit, reset, formState } = useForm();

  const { errors } = formState;

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <div>
      <div className='w-full pb-4 mb-10 border-b border-grey-transparent'>
        <h2 className='text-xl font-bold'>Thông tin bệnh nhân</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2Col>
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

          <div />

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

          <div />
        </Grid2Col>

        <div className='h-[2px] bg-grey-transparent border border-grey-transparent mb-5'></div>
        <div>
          <h2 className='mb-5 text-xl font-bold text-center'>
            Thông tin tiếp nhận
          </h2>
          <Grid2Col>
            <FormRow label='Ngày tiếp nhận'>
              <InputNew
                type='date'
                name='NgayTN'
                {...register('NgayTN', {
                  required: 'Bắt buộc !',
                })}
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </FormRow>

            <FormRow label='Ca tiếp nhận*' error={errors.caTN?.message}>
              <InputNew
                type='text'
                name='caTN'
                {...register('caTN', {
                  required: 'Bắt buộc !',
                })}
              />
            </FormRow>

            <FormRow label='Trạng thái*' error={errors.TrangThai?.message}>
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
              label='Nhân viên tiếp nhận'
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
          </Grid2Col>
        </div>

        <div className='flex items-end justify-end mt-4 gap-x-3'>
          <Button
            className='bg-light text-grey-900 px-[10px] py-[6px]'
            onClick={() => reset()}
          >
            Huỷ
          </Button>
          <Button
            className='text-white bg-primary px-[10px] py-[6px] font-medium'
            type='submit'
          >
            Thêm Hồ Sơ
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReceptionFormNew;
