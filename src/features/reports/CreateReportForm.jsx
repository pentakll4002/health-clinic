import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReport } from './APIReports';
import toast from 'react-hot-toast';

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  margin: 0 auto;
  min-width: 600px;
`;

const CreateReportForm = ({ onCloseModal }) => {
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      Thang: new Date().getMonth() + 1,
      Nam: new Date().getFullYear(),
    },
  });
  const { errors } = formState;
  const queryClient = useQueryClient();

  const { mutate: createReportMutation, isLoading } = useMutation({
    mutationFn: createReport,
    onSuccess: (data) => {
      toast.success('Lập báo cáo doanh thu thành công');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      reset({
        Thang: new Date().getMonth() + 1,
        Nam: new Date().getFullYear(),
      });
      if (onCloseModal) onCloseModal();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Lập báo cáo thất bại';
      toast.error(message);
    },
  });

  function onSubmit(data) {
    const payload = {
      Thang: parseInt(data.Thang),
      Nam: parseInt(data.Nam),
    };
    createReportMutation(payload);
  }

  // Tạo danh sách tháng (1-12)
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Tạo danh sách năm (năm hiện tại - 10 đến năm hiện tại + 1)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i);

  return (
    <div>
      <div className='w-full pb-4 mb-10 border-b border-grey-transparent'>
        <h2 className='text-xl font-bold'>Lập báo cáo doanh thu trong tháng (BM7)</h2>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow label='Tháng*' error={errors.Thang?.message}>
          <Select
            id='Thang'
            {...register('Thang', {
              required: 'Bắt buộc !',
              min: { value: 1, message: 'Tháng phải từ 1-12' },
              max: { value: 12, message: 'Tháng phải từ 1-12' },
            })}
          >
            <option value=''>Chọn tháng</option>
            {months.map((month) => (
              <option key={month} value={month}>
                Tháng {month}
              </option>
            ))}
          </Select>
        </FormRow>

        <FormRow label='Năm*' error={errors.Nam?.message}>
          <Select
            id='Nam'
            {...register('Nam', {
              required: 'Bắt buộc !',
              min: { value: 2000, message: 'Năm phải từ 2000 trở lên' },
              max: { value: 2100, message: 'Năm phải từ 2100 trở xuống' },
            })}
          >
            <option value=''>Chọn năm</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </FormRow>

        <div />

        <div className='flex items-end justify-end gap-x-3'>
          <Button
            className='bg-light text-grey-900 px-[10px] py-[6px]'
            onClick={() => {
              reset({
                Thang: new Date().getMonth() + 1,
                Nam: new Date().getFullYear(),
              });
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
            Lập Báo Cáo
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateReportForm;

