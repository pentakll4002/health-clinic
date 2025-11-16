import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import styled from 'styled-components';
import Button from '../../ui/Button';
import DrugFormFields from './DrugFormFields';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateDrug, getDVT, getCachDung } from './APIDrugs';
import toast from 'react-hot-toast';

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  margin: 0 auto;
  min-width: 600px;
`;

const UpdateDrugForm = ({ drug, onCloseModal }) => {
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

  // Set default values when drug data is loaded
  useEffect(() => {
    if (drug) {
      reset({
        TenThuoc: drug.TenThuoc || '',
        ID_DVT: drug.ID_DVT || '',
        ID_CachDung: drug.ID_CachDung || '',
        ThanhPhan: drug.ThanhPhan || '',
        XuatXu: drug.XuatXu || '',
        SoLuongTon: drug.SoLuongTon || 0,
        DonGiaNhap: drug.DonGiaNhap || '',
        TyLeGiaBan: drug.TyLeGiaBan || '',
        DonGiaBan: drug.DonGiaBan || '',
        HinhAnh: drug.HinhAnh || '',
      });
    }
  }, [drug, reset]);

  const { mutate: updateDrugMutation, isLoading } = useMutation({
    mutationFn: ({ id, data }) => updateDrug(id, data),
    onSuccess: () => {
      toast.success('Cập nhật thuốc thành công');
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
      queryClient.invalidateQueries({ queryKey: ['drug', drug?.ID_Thuoc] });
      if (onCloseModal) onCloseModal();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || 'Cập nhật thuốc thất bại'
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
    updateDrugMutation({ id: drug.ID_Thuoc, data: formData });
  }

  if (!drug) return null;

  return (
    <div>
      <div className='w-full pb-4 mb-10 border-b border-grey-transparent'>
        <h2 className='text-xl font-bold'>Cập nhật thông tin thuốc</h2>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <DrugFormFields
          register={register}
          errors={errors}
          dvtList={dvtList}
          cachDungList={cachDungList}
        />

        <div />

        <div className='flex items-end justify-end gap-x-3'>
          <Button
            className='bg-light text-grey-900 px-[10px] py-[6px]'
            onClick={() => {
              if (onCloseModal) onCloseModal();
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
            Cập nhật
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UpdateDrugForm;

