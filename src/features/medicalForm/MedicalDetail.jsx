import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import { useForm } from 'react-hook-form';
import Table from '../../ui/Table';
import { useEffect, useState } from 'react';
import { useChiTietPhieuKham } from './useChiTietPhieuKham';
import Spinner from '../../ui/Spinner';

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

const MedicalDetail = ({ ID_PhieuKham, readOnly = false }) => {
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
                error={errors.CaTN?.message}
              >
                {isEditting ? (
                  <InputNew
                    type='text'
                    name='CaTN'
                    defauValues={getValues('CaTN')}
                    {...register('CaTN', {
                      required: 'Bắt buộc !',
                    })}
                  />
                ) : (
                  <Text>{phieuKham.CaTN}</Text>
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
                  <Text>{phieuKham.NgayTN}</Text>
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
                  <Text>{phieuKham.ID_BenhNhan}</Text>
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
                  <Text>{phieuKham.HoTenBN}</Text>
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
              label='Chẩn Đoán: '
              error={errors.ChanDoan?.message}
            >
              {isEditting ? (
                <InputNew
                  type='text'
                  name='ChanDoan'
                  defauValues={getValues('ChanDoan')}
                  {...register('ChanDoan', {
                    required: 'Bắt buộc !',
                  })}
                />
              ) : (
                <Text>{phieuKham.ChanDoan}</Text>
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
            disabled={readOnly}
            style={readOnly ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
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

      <p className='pb-3 m-6 text-sm font-semibold text-center border-b text-primary border-grey-transparent'>
        Danh sách thuốc đã kê
      </p>

      <Table columns='2fr 2fr 2fr 2fr 2fr 2fr'>
        <Table.Header>
          <div className='mx-auto'>Tên Thuốc</div>
          <div className='mx-auto'>Đơn Vị Tính</div>
          <div className='mx-auto'>Số Lượng</div>
          <div className='mx-auto'>Cách Dùng</div>
          <div className='mx-auto'>Đơn Giá</div>
          <div className='mx-auto'>Thành Tiền</div>
        </Table.Header>

        <Table.Body
          data={phieuKham.DonThuoc}
          render={(ToaThuoc) => {
            return (
              <Table.Row key={ToaThuoc.TenThuoc}>
                <Text>{ToaThuoc.TenThuoc}</Text>
                <Text>{ToaThuoc.DonViTinh}</Text>
                <Text>{ToaThuoc.CachDung}</Text>
                <Text>{ToaThuoc.SoLuong}</Text>
                <Text>{ToaThuoc.DonGia}</Text>
                <Text>{ToaThuoc.ThanhTien}</Text>
              </Table.Row>
            );
          }}
        />
      </Table>
    </LayoutMedicalDetail>
  );
};

export default MedicalDetail;
