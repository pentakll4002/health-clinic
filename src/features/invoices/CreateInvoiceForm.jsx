import { useEffect, useState } from 'react';
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
    params: { limit: 100, ma_nhom: '@doctors' },
  });
  return response.data;
}

async function getPhieuKhamList() {
  const response = await axiosInstance.get('/phieu-kham', {
    params: { limit: 100, only_without_invoice: true },
  });
  return response.data;
}

const CreateInvoiceForm = ({ onCloseModal }) => {
  const { register, handleSubmit, reset, formState, watch, setError } = useForm({
    defaultValues: {
      NgayHoaDon: new Date().toISOString().slice(0, 10),
    },
  });
  const { errors } = formState;
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState(null);

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
  const selectedPhieuKham = watch('ID_PhieuKham');

  useEffect(() => {
    let ignore = false;
    async function fetchPreview(id) {
      try {
        const response = await axiosInstance.get(`/invoices/preview/${id}`);
        if (!ignore) {
          setPreview(response.data);
          setError('ID_PhieuKham', undefined);
        }
      } catch (error) {
        if (!ignore) {
          setPreview(null);
          if (error.response?.status === 409) {
            toast.error('Phiếu khám đã được lập hoá đơn');
            setError('ID_PhieuKham', {
              type: 'manual',
              message: 'Phiếu khám đã được lập hoá đơn',
            });
          } else if (error.response?.status === 404) {
            toast.error('Phiếu khám không tồn tại');
          } else {
            toast.error('Không tải được dữ liệu xem trước');
          }
        }
      }
    }

    if (selectedPhieuKham) {
      fetchPreview(selectedPhieuKham);
    } else {
      setPreview(null);
    }

    return () => {
      ignore = true;
    };
  }, [selectedPhieuKham, setError]);

  const { mutate: createInvoiceMutation, isLoading } = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      toast.success('Tạo hoá đơn thành công');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      reset({
        ID_PhieuKham: '',
        ID_NhanVien: '',
        NgayHoaDon: new Date().toISOString().slice(0, 10),
      });
      setPreview(null);
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

        <FormRow label='Tiền khám'>
          <InputNew
            type='number'
            id='TienKhamPreview'
            value={preview?.TienKham ?? ''}
            readOnly
            disabled
          />
        </FormRow>

        <FormRow label='Tiền thuốc'>
          <InputNew
            type='number'
            id='TienThuocPreview'
            value={preview?.TienThuoc ?? ''}
            readOnly
            disabled
          />
        </FormRow>

        <FormRow label='Tổng tiền'>
          <InputNew
            type='number'
            id='TongTienPreview'
            value={preview?.TongTien ?? ''}
            readOnly
            disabled
          />
        </FormRow>

        <div />

        <div className='flex items-end justify-end gap-x-3'>
          <Button
            className='bg-light text-grey-900 px-[10px] py-[6px]'
            onClick={() => {
              reset({
                ID_PhieuKham: '',
                ID_NhanVien: '',
                NgayHoaDon: new Date().toISOString().slice(0, 10),
              });
              setPreview(null);
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


