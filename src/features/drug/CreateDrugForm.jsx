import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import InputImage from '../../ui/InputImage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createDrug, getDVT, getCachDung } from './APIDrugs';
import toast from 'react-hot-toast';

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  margin: 0 auto;
  min-width: 600px;
`;

const CreateDrugForm = ({ onCloseModal }) => {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const queryClient = useQueryClient();

  const { data: dvtList = [] } = useQuery({
    queryKey: ['dvt'],
    queryFn: getDVT,
  });

  const { data: cachDungList = [] } = useQuery({
    queryKey: ['cach-dung'],
    queryFn: getCachDung,
  });

  const { mutate: createDrugMutation, isLoading } = useMutation({
    mutationFn: createDrug,
    onSuccess: () => {
      toast.success('Thêm thuốc thành công');
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
      reset();
      if (onCloseModal) onCloseModal();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || 'Thêm thuốc thất bại'
      );
    },
  });

  function onSubmit(data) {
    const formData = {
      TenThuoc: data.TenThuoc,
      ID_DVT: parseInt(data.ID_DVT),
      ID_CachDung: parseInt(data.ID_CachDung),
      ThanhPhan: data.ThanhPhan || null,
      XuatXu: data.XuatXu || null,
      SoLuongTon: parseInt(data.SoLuongTon) || 0,
      DonGiaNhap: parseFloat(data.DonGiaNhap) || null,
      HinhAnh: data.HinhAnh || null,
      TyLeGiaBan: parseFloat(data.TyLeGiaBan) || null,
      DonGiaBan: parseFloat(data.DonGiaBan) || null,
    };
    createDrugMutation(formData);
  }

  return (
    <div>
      <div className='w-full pb-4 mb-10 border-b border-grey-transparent'>
        <h2 className='text-xl font-bold'>Thông tin thuốc</h2>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputImage />
        <div />

        <FormRow label='Tên thuốc*' error={errors.TenThuoc?.message}>
          <InputNew
            type='text'
            id='TenThuoc'
            {...register('TenThuoc', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='Đơn vị tính*' error={errors.ID_DVT?.message}>
          <Select
            id='ID_DVT'
            {...register('ID_DVT', {
              required: 'Bắt buộc !',
            })}
          >
            <option value=''>Chọn đơn vị tính</option>
            {dvtList.map((dvt) => (
              <option key={dvt.ID_DVT} value={dvt.ID_DVT}>
                {dvt.TenDVT}
              </option>
            ))}
          </Select>
        </FormRow>

        <FormRow label='Cách dùng*' error={errors.ID_CachDung?.message}>
          <Select
            id='ID_CachDung'
            {...register('ID_CachDung', {
              required: 'Bắt buộc !',
            })}
          >
            <option value=''>Chọn cách dùng</option>
            {cachDungList.map((cachDung) => (
              <option key={cachDung.ID_CachDung} value={cachDung.ID_CachDung}>
                {cachDung.MoTaCachDung}
              </option>
            ))}
          </Select>
        </FormRow>

        <FormRow label='Thành phần' error={errors.ThanhPhan?.message}>
          <InputNew
            type='text'
            id='ThanhPhan'
            {...register('ThanhPhan')}
          />
        </FormRow>

        <FormRow label='Xuất xứ' error={errors.XuatXu?.message}>
          <InputNew
            type='text'
            id='XuatXu'
            {...register('XuatXu')}
          />
        </FormRow>

        <FormRow label='Số lượng tồn' error={errors.SoLuongTon?.message}>
          <InputNew
            type='number'
            id='SoLuongTon'
            min='0'
            {...register('SoLuongTon')}
          />
        </FormRow>

        <FormRow label='Giá nhập' error={errors.DonGiaNhap?.message}>
          <InputNew
            type='number'
            id='DonGiaNhap'
            min='0'
            step='0.01'
            {...register('DonGiaNhap')}
          />
        </FormRow>

        <FormRow label='Tỷ lệ giá bán' error={errors.TyLeGiaBan?.message}>
          <InputNew
            type='number'
            id='TyLeGiaBan'
            min='0'
            step='0.01'
            {...register('TyLeGiaBan')}
          />
        </FormRow>

        <FormRow label='Giá bán' error={errors.DonGiaBan?.message}>
          <InputNew
            type='number'
            id='DonGiaBan'
            min='0'
            step='0.01'
            {...register('DonGiaBan')}
          />
        </FormRow>

        <FormRow label='Hình ảnh (URL)' error={errors.HinhAnh?.message}>
          <InputNew
            type='text'
            id='HinhAnh'
            {...register('HinhAnh')}
          />
        </FormRow>

        <div />

        <div className='flex items-end justify-end gap-x-3'>
          <Button
            className='bg-light text-grey-900 px-[10px] py-[6px]'
            onClick={() => {
              reset();
            }}
            type='button'
          >
            Huỷ
          </Button>
          <Button
            className='text-white bg-primary px-[10px] py-[6px] font-medium'
            type='submit'
            isLoading={isLoading}
          >
            Thêm Thuốc
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateDrugForm;

