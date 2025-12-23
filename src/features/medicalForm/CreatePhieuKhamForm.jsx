import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import Button from '../../ui/Button';
import { useCreatePhieuKham } from './useCreatePhieuKham';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../utils/axiosInstance';
import Spinner from '../../ui/Spinner';

const Grid2Col = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 24px;
  margin: 20px auto;
  min-width: 600px;
`;

const CreatePhieuKhamForm = ({ tiepNhan, onCloseModal, onSuccess }) => {
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;
  const { mutate: createPhieuKham, isLoading } = useCreatePhieuKham();

  const { data: loaiBenhData, isLoading: isLoadingLoaiBenh } = useQuery({
    queryKey: ['loai-benh'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/loai-benh');
        return res.data;
      } catch (error) {
        console.error('Error fetching loai benh:', error);
        return { data: [] };
      }
    },
  });

  const loaiBenhList = loaiBenhData?.data || [];

  if (!tiepNhan) {
    return <div>Không có thông tin tiếp nhận</div>;
  }

  if (isLoadingLoaiBenh) return <Spinner />;

  function onSubmit(data) {
    createPhieuKham(
      {
        ID_TiepNhan: tiepNhan.ID_TiepNhan,
        CaKham: tiepNhan.CaTN,
        TrieuChung: data.TrieuChung || null,
        ChanDoan: data.ChanDoan || null,
        ID_LoaiBenh: data.ID_LoaiBenh ? parseInt(data.ID_LoaiBenh) : null,
        TienKham: data.TienKham ? parseFloat(data.TienKham) : null,
      },
      {
        onSuccess: () => {
          if (onCloseModal) onCloseModal();
          if (onSuccess) onSuccess();
        },
      }
    );
  }

  const benhNhan = tiepNhan.benhNhan || tiepNhan.benh_nhan;

  return (
    <div>
      <h2 className='mb-5 text-xl font-bold leading-6 text-grey-900'>
        Lập phiếu khám mới
      </h2>

      <div className='mb-4 p-4 bg-grey-50 rounded-lg'>
        <p className='text-sm text-grey-600 mb-2'>
          <strong>Bệnh nhân:</strong> {benhNhan?.HoTenBN || 'N/A'}
        </p>
        <p className='text-sm text-grey-600 mb-2'>
          <strong>Ngày tiếp nhận:</strong> {tiepNhan.NgayTN}
        </p>
        <p className='text-sm text-grey-600'>
          <strong>Ca:</strong> {tiepNhan.CaTN}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2Col>
          <FormRow
            inline={true}
            label='Triệu chứng: '
            error={errors.TrieuChung?.message}
          >
            <InputNew
              type='text'
              name='TrieuChung'
              placeholder='Nhập triệu chứng...'
              {...register('TrieuChung')}
            />
          </FormRow>

          <FormRow
            inline={true}
            label='Chẩn đoán: '
            error={errors.ChanDoan?.message}
          >
            <InputNew
              type='text'
              name='ChanDoan'
              placeholder='Nhập chẩn đoán...'
              {...register('ChanDoan')}
            />
          </FormRow>

          <FormRow
            inline={true}
            label='Loại bệnh: '
            error={errors.ID_LoaiBenh?.message}
          >
            <select
              name='ID_LoaiBenh'
              className='w-full px-3 py-2 border border-grey-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              {...register('ID_LoaiBenh')}
            >
              <option value=''>-- Chọn loại bệnh --</option>
              {loaiBenhList.map((loai) => (
                <option key={loai.ID_LoaiBenh} value={loai.ID_LoaiBenh}>
                  {loai.TenLoaiBenh}
                </option>
              ))}
            </select>
          </FormRow>

          <FormRow
            inline={true}
            label='Tiền khám: '
            error={errors.TienKham?.message}
          >
            <InputNew
              type='number'
              name='TienKham'
              placeholder='Nhập tiền khám...'
              min='0'
              step='1000'
              {...register('TienKham', {
                min: {
                  value: 0,
                  message: 'Tiền khám phải >= 0',
                },
              })}
            />
          </FormRow>
        </Grid2Col>

        <div className='flex gap-3 justify-end mt-6'>
          <Button
            type='button'
            onClick={() => onCloseModal && onCloseModal()}
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
            {isLoading ? 'Đang tạo...' : 'Tạo phiếu khám'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePhieuKhamForm;

