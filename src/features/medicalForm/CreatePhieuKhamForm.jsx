import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPhieuKham, getLoaiBenhList } from './APIPhieuKham';
import { getAppointments } from '../appointments/APIAppointments';
import toast from 'react-hot-toast';

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  margin: 0 auto;
  min-width: 600px;
`;

const CreatePhieuKhamForm = ({ onCloseModal }) => {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const queryClient = useQueryClient();

  const { data: appointmentsData } = useQuery({
    queryKey: ['appointments-list'],
    queryFn: () => getAppointments(1, 100),
  });

  const { data: loaiBenhList = [] } = useQuery({
    queryKey: ['loai-benh'],
    queryFn: getLoaiBenhList,
  });

  const appointments = appointmentsData?.data || [];

  const { mutate: createPhieuKhamMutation, isLoading } = useMutation({
    mutationFn: createPhieuKham,
    onSuccess: () => {
      toast.success('Tạo phiếu khám thành công');
      queryClient.invalidateQueries({ queryKey: ['phieukham-list'] });
      reset();
      if (onCloseModal) onCloseModal();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || 'Tạo phiếu khám thất bại'
      );
    },
  });

  function onSubmit(data) {
    const formData = {
      ID_TiepNhan: parseInt(data.ID_TiepNhan),
      CaKham: data.CaKham,
      TrieuChung: data.TrieuChung || null,
      ID_LoaiBenh: parseInt(data.ID_LoaiBenh),
      TienKham: parseFloat(data.TienKham) || null,
      TongTienThuoc: 0,
    };
    createPhieuKhamMutation(formData);
  }

  return (
    <div>
      <div className='w-full pb-4 mb-10 border-b border-grey-transparent'>
        <h2 className='text-xl font-bold'>Thông tin phiếu khám</h2>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow label='Lịch hẹn*' error={errors.ID_TiepNhan?.message}>
          <Select
            id='ID_TiepNhan'
            {...register('ID_TiepNhan', {
              required: 'Bắt buộc !',
            })}
          >
            <option value=''>Chọn lịch hẹn</option>
            {appointments.map((appointment) => (
              <option key={appointment.ID_TiepNhan} value={appointment.ID_TiepNhan}>
                {appointment.benhNhan?.HoTenBN || 'N/A'} - {appointment.NgayTN} - {appointment.CaTN}
              </option>
            ))}
          </Select>
        </FormRow>

        <FormRow label='Ca khám*' error={errors.CaKham?.message}>
          <Select
            id='CaKham'
            {...register('CaKham', {
              required: 'Bắt buộc !',
            })}
          >
            <option value=''>Chọn ca</option>
            <option value='Sáng'>Sáng</option>
            <option value='Chiều'>Chiều</option>
            <option value='Tối'>Tối</option>
          </Select>
        </FormRow>

        <FormRow label='Loại bệnh*' error={errors.ID_LoaiBenh?.message}>
          <Select
            id='ID_LoaiBenh'
            {...register('ID_LoaiBenh', {
              required: 'Bắt buộc !',
            })}
          >
            <option value=''>Chọn loại bệnh</option>
            {loaiBenhList.map((loaiBenh) => (
              <option key={loaiBenh.ID_LoaiBenh} value={loaiBenh.ID_LoaiBenh}>
                {loaiBenh.TenLoaiBenh}
              </option>
            ))}
          </Select>
        </FormRow>

        <FormRow label='Tiền khám' error={errors.TienKham?.message}>
          <InputNew
            type='number'
            id='TienKham'
            min='0'
            step='0.01'
            {...register('TienKham')}
          />
        </FormRow>

        <FormRow label='Triệu chứng' error={errors.TrieuChung?.message}>
          <InputNew
            type='text'
            id='TrieuChung'
            {...register('TrieuChung')}
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
            Tạo Phiếu Khám
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreatePhieuKhamForm;

