import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import { useForm } from 'react-hook-form';
import Table from '../../ui/Table';
import { useEffect, useState } from 'react';
import { useChiTietPhieuKham } from './useChiTietPhieuKham';
import Spinner from '../../ui/Spinner';
import AddThuocToToa from './AddThuocToToa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeThuocFromToa } from './APIPhieuKham';
import toast from 'react-hot-toast';
import { TrashIcon } from '@heroicons/react/24/outline';

const LayoutMedicalDetail = styled.div`
  padding: 20px;
  background-color: #f5f6f8;
  width: 1200px;
  height: 100%;
`;

const Grid2Col = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 24px;
  margin: 20px auto;
  min-width: 600px;
`;

const Text = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #091833;
  margin: auto;
`;

const ToaThuocRow = ({ toaThuoc, phieuKhamId }) => {
  const queryClient = useQueryClient();
  const { mutate: removeMutation, isLoading: isRemoving } = useMutation({
    mutationFn: () => removeThuocFromToa(phieuKhamId, toaThuoc.ID_Thuoc),
    onSuccess: () => {
      toast.success('Xóa thuốc khỏi toa thành công');
      queryClient.invalidateQueries({ queryKey: ['phieuKham', phieuKhamId] });
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Xóa thuốc thất bại');
    },
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  return (
    <Table.Row>
      <Text>{toaThuoc.thuoc?.TenThuoc || 'N/A'}</Text>
      <Text>{toaThuoc.thuoc?.dvt?.TenDVT || 'N/A'}</Text>
      <Text>{toaThuoc.SoLuong}</Text>
      <Text>{formatCurrency(toaThuoc.DonGiaBan_LuocMua || toaThuoc.DonGiaBan_LucMua)}</Text>
      <Text>{formatCurrency(toaThuoc.TienThuoc)}</Text>
      <Text>{toaThuoc.thuoc?.cachDung?.MoTaCachDung || 'N/A'}</Text>
      <div className='flex justify-center'>
        <button
          onClick={() => removeMutation()}
          disabled={isRemoving}
          className='px-2 py-1 text-sm text-white bg-error-900 rounded hover:bg-error-950 disabled:opacity-50'
        >
          <TrashIcon className='w-4 h-4' />
        </button>
      </div>
    </Table.Row>
  );
};

const MedicalDetail = ({ ID_PhieuKham }) => {
  const { phieuKham, isLoading } = useChiTietPhieuKham(ID_PhieuKham);
  const [isEditting, setIsEditting] = useState(false);
  const { register, handleSubmit, getValues, reset, formState } = useForm();

  const { errors } = formState;

  function onSubmit(data) {
    console.log(data);
  }

  useEffect(() => {
    if (phieuKham) {
      reset(phieuKham);
    }
  }, [phieuKham, reset]);

  if (isLoading) return <Spinner />;

  return (
    <LayoutMedicalDetail>
      <h2 className='mb-5 text-xl font-bold leading-6 text-grey-900'>
        Thông Tin Phiếu khám #{phieuKham.ID_PhieuKham}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex items-start '>
          <div>
            <Grid2Col>
              <FormRow
                inline={true}
                label='Mã Phiếu Khám: '
                error={errors.ID_PhieuKham?.message}
              >
                {isEditting ? (
                  <InputNew
                    type='text'
                    name='ID_PhieuKham'
                    defauValues={getValues('ID_PhieuKham')}
                    {...register('ID_PhieuKham', {
                      required: 'Bắt buộc !',
                    })}
                  />
                ) : (
                  <Text>{phieuKham.ID_PhieuKham}</Text>
                )}
              </FormRow>

              <FormRow
                inline={true}
                label='Ca Khám: '
                error={errors.CaKham?.message}
              >
                {isEditting ? (
                  <InputNew
                    type='text'
                    name='CaKham'
                    defauValues={getValues('CaKham')}
                    {...register('CaKham', {
                      required: 'Bắt buộc !',
                    })}
                  />
                ) : (
                  <Text>{phieuKham.CaKham}</Text>
                )}
              </FormRow>

              <FormRow
                inline={true}
                label='Ngày Khám: '
                error={errors.NgayTN?.message}
              >
                {isEditting ? (
                  <InputNew
                    type='text'
                    name='NgayTN'
                    defauValues={getValues('NgayTN')}
                    {...register('NgayTN', {
                      required: 'Bắt buộc !',
                    })}
                  />
                ) : (
                  <Text>
                    {phieuKham.danhSachTiepNhan?.NgayTN
                      ? new Date(phieuKham.danhSachTiepNhan.NgayTN).toLocaleDateString('vi-VN')
                      : 'N/A'}
                  </Text>
                )}
              </FormRow>

              <FormRow
                inline={true}
                label='Mã Bệnh Nhân: '
                error={errors.ID_BenhNhan?.message}
              >
                {isEditting ? (
                  <InputNew
                    type='text'
                    name='ID_BenhNhan'
                    defauValues={getValues('ID_BenhNhan')}
                    {...register('ID_BenhNhan', {
                      required: 'Bắt buộc !',
                    })}
                  />
                ) : (
                  <Text>{phieuKham.danhSachTiepNhan?.ID_BenhNhan || 'N/A'}</Text>
                )}
              </FormRow>
              <FormRow
                inline={true}
                label='Họ Tên: '
                error={errors.HoTenBN?.message}
              >
                {isEditting ? (
                  <InputNew
                    type='text'
                    name='HoTenBN'
                    defauValues={getValues('HoTenBN')}
                    {...register('HoTenBN', {
                      required: 'Bắt buộc !',
                    })}
                  />
                ) : (
                  <Text>{phieuKham.danhSachTiepNhan?.benhNhan?.HoTenBN || 'N/A'}</Text>
                )}
              </FormRow>
              <FormRow
                inline={true}
                label='Triệu Chứng: '
                error={errors.TrieuChung?.message}
              >
                {isEditting ? (
                  <InputNew
                    type='text'
                    name='TrieuChung'
                    defauValues={getValues('TrieuChung')}
                    {...register('TrieuChung', {
                      required: 'Bắt buộc !',
                    })}
                  />
                ) : (
                  <Text>{phieuKham.TrieuChung}</Text>
                )}
              </FormRow>
            </Grid2Col>
            <FormRow
              inline={true}
              label='Loại Bệnh: '
              error={errors.ID_LoaiBenh?.message}
            >
              {isEditting ? (
                <InputNew
                  type='text'
                  name='ID_LoaiBenh'
                  defauValues={getValues('ID_LoaiBenh')}
                  {...register('ID_LoaiBenh', {
                    required: 'Bắt buộc !',
                  })}
                />
              ) : (
                <Text>{phieuKham.loaiBenh?.TenLoaiBenh || 'N/A'}</Text>
              )}
            </FormRow>
          </div>
          <div className='flex flex-col items-center justify-center w-full gap-y-10'>
            <div className='flex flex-col justify-between px-5 pt-2 text-center border-[3px] rounded-lg gap-y-3 pb-7 border-primary text-xl font-semibold text-grey-900'>
              <span>Tiền Khám</span>
              {isEditting ? (
                <InputNew
                  type='text'
                  name='TienKham'
                  defauValues={getValues('TienKham')}
                  {...register('TienKham', {
                    required: 'Bắt buộc !',
                  })}
                />
              ) : (
                <span>{phieuKham.TienKham} Đồng</span>
              )}
            </div>

            <div className='flex flex-col justify-between px-5 pt-2 text-center border-[3px] gap-y-3 rounded-lg pb-7 border-primary text-xl font-semibold text-grey-900'>
              <span>Tiền Thuốc</span>
              {isEditting ? (
                <InputNew
                  type='text'
                  name='TongTienThuoc'
                  defauValues={getValues('TongTienThuoc')}
                  {...register('TongTienThuoc', {
                    required: 'Bắt buộc !',
                  })}
                />
              ) : (
                <span>{phieuKham.TongTienThuoc} Đồng</span>
              )}
            </div>
          </div>
        </div>

        {!isEditting ? (
          <button
            className='px-3 py-2 mt-2 mr-auto text-sm font-semibold text-white bg-primary'
            onClick={() => {
              setIsEditting(true);
            }}
          >
            Chỉnh sửa
          </button>
        ) : (
          <div>
            <button className='px-3 py-2 mt-2 mr-5 text-sm font-semibold text-white bg-success-900'>
              Lưu
            </button>

            <button
              className='px-3 py-2 mt-2 text-sm font-semibold text-white bg-error-900'
              onClick={() => {
                setIsEditting(false);
              }}
            >
              Huỷ
            </button>
          </div>
        )}
      </form>

      <div className='flex items-center justify-between mb-4'>
        <p className='text-sm font-semibold text-primary border-b border-grey-transparent pb-3'>
          Danh sách thuốc đã kê
        </p>
        <AddThuocToToa ID_PhieuKham={ID_PhieuKham} />
      </div>

      <Table columns='2fr 2fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr'>
        <Table.Header>
          <div className='mx-auto'>Tên Thuốc</div>
          <div className='mx-auto'>Đơn Vị Tính</div>
          <div className='mx-auto'>Số Lượng</div>
          <div className='mx-auto'>Đơn Giá</div>
          <div className='mx-auto'>Thành Tiền</div>
          <div className='mx-auto'>Cách Dùng</div>
          <div className='mx-auto'>Thao Tác</div>
        </Table.Header>

        <Table.Body
          data={phieuKham?.toaThuoc || []}
          render={(toaThuoc) => (
            <ToaThuocRow
              key={`${toaThuoc.ID_PhieuKham}-${toaThuoc.ID_Thuoc}`}
              toaThuoc={toaThuoc}
              phieuKhamId={ID_PhieuKham}
            />
          )}
        />
      </Table>
    </LayoutMedicalDetail>
  );
};

export default MedicalDetail;
