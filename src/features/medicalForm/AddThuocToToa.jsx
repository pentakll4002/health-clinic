import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addThuocToToa } from './APIPhieuKham';
import { getDrugs } from '../drug/APIDrugs';
import toast from 'react-hot-toast';
import Modal from '../../ui/Modal';

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin: 0 auto;
  min-width: 400px;
`;

const AddThuocToToa = ({ ID_PhieuKham }) => {
  const { register, handleSubmit, reset, formState, watch } = useForm();
  const { errors } = formState;
  const queryClient = useQueryClient();

  const { data: drugsData } = useQuery({
    queryKey: ['drugs-list'],
    queryFn: () => getDrugs(1, 100),
  });

  const drugs = drugsData?.data || [];
  const selectedDrugId = watch('ID_Thuoc');
  const selectedDrug = drugs.find(d => d.ID_Thuoc === parseInt(selectedDrugId));

  const { mutate: addThuocMutation, isLoading } = useMutation({
    mutationFn: addThuocToToa,
    onSuccess: () => {
      toast.success('Thêm thuốc vào toa thành công');
      queryClient.invalidateQueries({ queryKey: ['phieuKham', ID_PhieuKham] });
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
      reset();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || 'Thêm thuốc thất bại'
      );
    },
  });

  function onSubmit(data) {
    const formData = {
      ID_PhieuKham: ID_PhieuKham,
      ID_Thuoc: parseInt(data.ID_Thuoc),
      SoLuong: parseInt(data.SoLuong),
    };
    addThuocMutation(formData);
  }

  return (
    <Modal>
      <Modal.Open opens='add-thuoc-toa'>
        <button className='px-3 py-2 text-sm font-semibold text-white bg-primary rounded-md'>
          Thêm Thuốc
        </button>
      </Modal.Open>

      <Modal.Window name='add-thuoc-toa'>
        <div>
          <div className='w-full pb-4 mb-6 border-b border-grey-transparent'>
            <h2 className='text-xl font-bold'>Thêm thuốc vào toa</h2>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow label='Chọn thuốc*' error={errors.ID_Thuoc?.message}>
              <Select
                id='ID_Thuoc'
                {...register('ID_Thuoc', {
                  required: 'Bắt buộc !',
                })}
              >
                <option value=''>Chọn thuốc</option>
                {drugs.map((drug) => (
                  <option key={drug.ID_Thuoc} value={drug.ID_Thuoc}>
                    {drug.TenThuoc} - Tồn: {drug.SoLuongTon}
                  </option>
                ))}
              </Select>
            </FormRow>

            {selectedDrug && (
              <div className='p-3 bg-grey-50 rounded-md'>
                <p className='text-sm text-grey-600'>
                  <strong>Giá bán:</strong>{' '}
                  {selectedDrug.DonGiaBan
                    ? new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(selectedDrug.DonGiaBan)
                    : 'Chưa có'}
                </p>
                <p className='text-sm text-grey-600'>
                  <strong>Số lượng tồn:</strong> {selectedDrug.SoLuongTon}
                </p>
              </div>
            )}

            <FormRow label='Số lượng*' error={errors.SoLuong?.message}>
              <InputNew
                type='number'
                id='SoLuong'
                min='1'
                max={selectedDrug?.SoLuongTon || 999}
                {...register('SoLuong', {
                  required: 'Bắt buộc !',
                  min: { value: 1, message: 'Số lượng phải lớn hơn 0' },
                  max: {
                    value: selectedDrug?.SoLuongTon || 999,
                    message: `Số lượng không được vượt quá ${selectedDrug?.SoLuongTon || 0}`,
                  },
                })}
              />
            </FormRow>

            <div className='flex items-end justify-end gap-x-3 pt-4'>
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
                Thêm Vào Toa
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Window>
    </Modal>
  );
};

export default AddThuocToToa;

