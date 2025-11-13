import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createInvoice } from './APIInvoices';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  margin: 0 auto;
  min-width: 600px;
`;

async function getNhanVienList() {
  const response = await axiosInstance.get('/nhanvien', {
    params: { limit: 100 },
  });
  return response.data;
}

async function getPhieuKhamList() {
  // For now, reuse mock data from medicalForm API via client; if needed, replace with backend route
  // Expect backend to provide /phieu-kham list later
  return { data: Array.from({ length: 20 }, (_, i) => ({ ID_PhieuKham: i + 1 })) };
}

const CreateInvoiceForm = ({ onCloseModal }) => {
  const { register, handleSubmit, reset, formState, watch } = useForm();
  const { errors } = formState;
  const queryClient = useQueryClient();

  const { data: nhanVienData } = useQuery({
    queryKey: ['nhanvien-list'],
    queryFn: getNhanVienList,
  });

  const { data: phieuKhamData } = useQuery({
    queryKey: ['phieukham-list-for-invoice'],
    queryFn: getPhieuKhamList,
  });

  const nhanVienList = nhanVienData?.data || [];
  const phieuKhamList = phieuKhamData?.data || [];

  const { mutate: createInvoiceMutation, isLoading } = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      toast.success('Tạo hoá đơn thành công');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      reset();
      if (onCloseModal) onCloseModal();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Tạo hoá đơn thất bại');
    },
  });

  function onSubmit(data) {
    const payload = {
      ID_PhieuKham: parseInt(data.ID_PhieuKham),
      ID_NhanVien: parseInt(data.ID_NhanVien),
      NgayHoaDon: data.NgayHoaDon,
      TienKham: parseFloat(data.TienKham) || 0,
      TienThuoc: parseFloat(data.TienThuoc) || 0,
      TongTien: parseFloat(data.TongTien) || undefined,
    };
    createInvoiceMutation(payload);
  }

  return (
    <div>
      <div className='w-full pb-4 mb-10 border-b border-grey-transparent'>
        <h2 className='text-xl font-bold'>Thông tin hoá đơn</h2>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow label='Phiếu khám*' error={errors.ID_PhieuKham?.message}>
          <Select
            id='ID_PhieuKham'
            {...register('ID_PhieuKham', {
              required: 'Bắt buộc !',
            })}
          >
            <option value=''>Chọn phiếu khám</option>
            {phieuKhamList.map((p) => (
              <option key={p.ID_PhieuKham} value={p.ID_PhieuKham}>
                #{p.ID_PhieuKham}
              </option>
            ))}
          </Select>
        </FormRow>

        <FormRow label='Nhân viên lập*' error={errors.ID_NhanVien?.message}>
          <Select
            id='ID_NhanVien'
            {...register('ID_NhanVien', {
              required: 'Bắt buộc !',
            })}
          >
            <option value=''>Chọn nhân viên</option>
            {nhanVienList.map((nv) => (
              <option key={nv.ID_NhanVien} value={nv.ID_NhanVien}>
                {nv.HoTenNV}
              </option>
            ))}
          </Select>
        </FormRow>

        <FormRow label='Ngày hoá đơn*' error={errors.NgayHoaDon?.message}>
          <InputNew
            type='date'
            id='NgayHoaDon'
            {...register('NgayHoaDon', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='Tiền khám' error={errors.TienKham?.message}>
          <InputNew type='number' step='0.01' id='TienKham' {...register('TienKham')} />
        </FormRow>

        <FormRow label='Tiền thuốc' error={errors.TienThuoc?.message}>
          <InputNew
            type='number'
            step='0.01'
            id='TienThuoc'
            {...register('TienThuoc')}
          />
        </FormRow>

        <FormRow label='Tổng tiền (tùy chọn)' error={errors.TongTien?.message}>
          <InputNew
            type='number'
            step='0.01'
            id='TongTien'
            placeholder='Để trống để tự tính'
            {...register('TongTien')}
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
            Tạo Hoá Đơn
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateInvoiceForm;


