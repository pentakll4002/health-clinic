import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateAppointment } from './APIAppointments';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  margin: 0 auto;
  min-width: 600px;
`;

// API functions để lấy danh sách
async function getPatientsList() {
  try {
    const response = await axiosInstance.get('/benh-nhan', {
      params: { limit: 100, page: 1 },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    return {
      data: [],
      totalCount: 0,
    };
  }
}

async function getNhanVienList() {
  try {
    const response = await axiosInstance.get('/nhanvien', {
      params: { 
        limit: 100,
        page: 1
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nhan vien:', error);
    return {
      data: [],
      totalCount: 0,
    };
  }
}

const EditAppointmentForm = ({ appointment, onCloseModal }) => {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const queryClient = useQueryClient();

  const { data: patientsData, isLoading: isLoadingPatients } = useQuery({
    queryKey: ['patients-list'],
    queryFn: getPatientsList,
  });

  const { data: nhanVienData, isLoading: isLoadingNhanVien } = useQuery({
    queryKey: ['nhanvien-list'],
    queryFn: getNhanVienList,
  });

  // Lọc chỉ bệnh nhân chưa bị xóa
  const patients = (patientsData?.data || []).filter(
    (patient) => !patient.Is_Deleted
  );
  
  // Lọc chỉ nhân viên đang làm việc
  const nhanVienList = (nhanVienData?.data || []).filter(
    (nv) => nv.TrangThai === 'Đang làm việc'
  );

  // Set default values when appointment data is loaded
  useEffect(() => {
    if (appointment) {
      // Format datetime for input
      const ngayTN = appointment.NgayTN 
        ? new Date(appointment.NgayTN).toISOString().slice(0, 16)
        : '';
      
      reset({
        ID_BenhNhan: appointment.ID_BenhNhan?.toString() || '',
        NgayTN: ngayTN,
        CaTN: appointment.CaTN || '',
        ID_NhanVien: appointment.ID_NhanVien?.toString() || '',
        TrangThai: appointment.TrangThai?.toString() || 'false',
      });
    }
  }, [appointment, reset]);

  const { mutate: updateAppointmentMutation, isLoading } = useMutation({
    mutationFn: ({ id, data }) => updateAppointment(id, data),
    onSuccess: () => {
      toast.success('Cập nhật lịch hẹn thành công');
      queryClient.invalidateQueries({ queryKey: ['appointment', appointment?.ID_TiepNhan] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      if (onCloseModal) onCloseModal();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || 'Cập nhật lịch hẹn thất bại'
      );
    },
  });

  function onSubmit(data) {
    const formData = {
      ID_BenhNhan: parseInt(data.ID_BenhNhan),
      NgayTN: data.NgayTN,
      CaTN: data.CaTN,
      ID_NhanVien: parseInt(data.ID_NhanVien),
      TrangThai: data.TrangThai === 'true' || data.TrangThai === true,
    };
    updateAppointmentMutation({ id: appointment.ID_TiepNhan, data: formData });
  }

  return (
    <div>
      <div className='w-full pb-4 mb-10 border-b border-grey-transparent'>
        <h2 className='text-xl font-bold'>Chỉnh sửa thông tin đặt lịch hẹn</h2>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow label='Bệnh nhân*' error={errors.ID_BenhNhan?.message}>
          <Select
            id='ID_BenhNhan'
            {...register('ID_BenhNhan', {
              required: 'Bắt buộc !',
            })}
            disabled={isLoadingPatients}
          >
            <option value=''>Chọn bệnh nhân</option>
            {patients.map((patient) => (
              <option key={patient.ID_BenhNhan} value={patient.ID_BenhNhan}>
                {patient.HoTenBN} {patient.DienThoai ? `- ${patient.DienThoai}` : ''}
              </option>
            ))}
          </Select>
        </FormRow>

        <FormRow label='Nhân viên tiếp nhận*' error={errors.ID_NhanVien?.message}>
          <Select
            id='ID_NhanVien'
            {...register('ID_NhanVien', {
              required: 'Bắt buộc !',
            })}
            disabled={isLoadingNhanVien}
          >
            <option value=''>Chọn nhân viên</option>
            {nhanVienList.length === 0 && !isLoadingNhanVien ? (
              <option value='' disabled>
                Không có nhân viên nào
              </option>
            ) : (
              nhanVienList.map((nv) => (
                <option key={nv.ID_NhanVien} value={nv.ID_NhanVien}>
                  {nv.HoTenNV} {nv.nhomNguoiDung ? `(${nv.nhomNguoiDung.TenNhom})` : ''}
                </option>
              ))
            )}
          </Select>
        </FormRow>

        <FormRow label='Ngày giờ tiếp nhận*' error={errors.NgayTN?.message}>
          <InputNew
            type='datetime-local'
            id='NgayTN'
            {...register('NgayTN', {
              required: 'Bắt buộc !',
            })}
          />
        </FormRow>

        <FormRow label='Ca tiếp nhận*' error={errors.CaTN?.message}>
          <Select
            id='CaTN'
            {...register('CaTN', {
              required: 'Bắt buộc !',
            })}
          >
            <option value=''>Chọn ca</option>
            <option value='Sáng'>Sáng</option>
            <option value='Chiều'>Chiều</option>
            <option value='Tối'>Tối</option>
          </Select>
        </FormRow>

        <FormRow label='Trạng thái' error={errors.TrangThai?.message}>
          <Select id='TrangThai' {...register('TrangThai')}>
            <option value='false'>Đang chờ</option>
            <option value='true'>Đã hoàn thành</option>
          </Select>
        </FormRow>

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
            Cập Nhật
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditAppointmentForm;

























