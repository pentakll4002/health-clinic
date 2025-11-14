import { useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import Button from '../../ui/Button';
import { useRegulations } from './useRegulations';
import { updateRegulations } from './APIRegulations';
import Spinner from '../../ui/Spinner';

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 24px;
  max-width: 800px;
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  border: 1px solid #e7e8eb;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
`;

const Actions = styled.div`
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const RegulationsForm = () => {
  const queryClient = useQueryClient();
  const { regulations, isLoading } = useRegulations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      SoBenhNhanToiDa: '',
      TienKham: '',
      TyLeGiaBan: '',
    },
  });

  useEffect(() => {
    if (!regulations) return;

    reset({
      SoBenhNhanToiDa: regulations.SoBenhNhanToiDa ?? '',
      TienKham: regulations.TienKham ?? '',
      TyLeGiaBan: regulations.TyLeGiaBan ?? '',
    });
  }, [regulations, reset]);

  const { mutate: updateMutation, isLoading: isSubmitting } = useMutation({
    mutationFn: updateRegulations,
    onSuccess: () => {
      toast.success('Cập nhật quy định thành công');
      queryClient.invalidateQueries({ queryKey: ['regulations'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Cập nhật thất bại');
    },
  });

  function onSubmit(values) {
    const payload = {};

    if (values.SoBenhNhanToiDa !== '') {
      payload.SoBenhNhanToiDa = parseInt(values.SoBenhNhanToiDa, 10);
    }
    if (values.TienKham !== '') {
      payload.TienKham = parseFloat(values.TienKham);
    }
    if (values.TyLeGiaBan !== '') {
      payload.TyLeGiaBan = parseFloat(values.TyLeGiaBan);
    }

    updateMutation(payload);
  }

  if (isLoading) return <Spinner />;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label='Số bệnh nhân khám tối đa mỗi ngày'
        error={errors.SoBenhNhanToiDa?.message}
      >
        <InputNew
          type='number'
          min={1}
          id='SoBenhNhanToiDa'
          {...register('SoBenhNhanToiDa', {
            required: 'Bắt buộc',
            min: { value: 1, message: 'Ít nhất 1 bệnh nhân' },
            max: { value: 1000, message: 'Không vượt quá 1000' },
          })}
        />
      </FormRow>

      <FormRow label='Tiền khám (VND)' error={errors.TienKham?.message}>
        <InputNew
          type='number'
          min={0}
          step='1000'
          id='TienKham'
          {...register('TienKham', {
            required: 'Bắt buộc',
            min: { value: 0, message: 'Không nhỏ hơn 0' },
          })}
        />
      </FormRow>

      <FormRow label='Tỷ lệ đơn giá bán (%)' error={errors.TyLeGiaBan?.message}>
        <InputNew
          type='number'
          min={0}
          step='0.1'
          id='TyLeGiaBan'
          {...register('TyLeGiaBan', {
            required: 'Bắt buộc',
            min: { value: 0, message: 'Không nhỏ hơn 0' },
          })}
        />
      </FormRow>

      <Actions>
        <Button
          type='button'
          className='bg-light text-grey-900 px-[12px] py-[8px]'
          onClick={() =>
            reset({
              SoBenhNhanToiDa: regulations.SoBenhNhanToiDa ?? '',
              TienKham: regulations.TienKham ?? '',
              TyLeGiaBan: regulations.TyLeGiaBan ?? '',
            })
          }
        >
          Đặt lại
        </Button>
        <Button
          type='submit'
          className='text-white bg-primary px-[12px] py-[8px] font-medium'
          isLoading={isSubmitting}
        >
          Lưu thay đổi
        </Button>
      </Actions>
    </Form>
  );
};

export default RegulationsForm;


