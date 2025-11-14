import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';

const Grid2Col = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 24px;
  margin: 20px auto;
  min-width: 600px;
`;

const MedicalForm = () => {
  const { register, handleSubmit, formState } = useForm();

  const { errors } = formState;

  function onSubmit(data) {
    console.log(data);
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex items-start '>
          <div>
            <Grid2Col>
              <FormRow
                inline={true}
                label='Mã Phiếu Khám: '
                error={errors.ID_PhieuKham?.message}
              >
                <InputNew
                  type='text'
                  name='ID_PhieuKham'
                  {...register('ID_PhieuKham', {
                    required: 'Bắt buộc !',
                  })}
                />
              </FormRow>

              <FormRow
                inline={true}
                label='Ca Khám: '
                error={errors.CaTN?.message}
              >
                <InputNew
                  type='text'
                  name='CaTN'
                  {...register('CaTN', {
                    required: 'Bắt buộc !',
                  })}
                />
              </FormRow>

              <FormRow
                inline={true}
                label='Ngày Khám: '
                error={errors.NgayTN?.message}
              >
                <InputNew
                  type='text'
                  name='NgayTN'
                  {...register('NgayTN', {
                    required: 'Bắt buộc !',
                  })}
                />
              </FormRow>

              <FormRow
                inline={true}
                label='Mã Bệnh Nhân: '
                error={errors.ID_BenhNhan?.message}
              >
                <InputNew
                  type='text'
                  name='ID_BenhNhan'
                  {...register('ID_BenhNhan', {
                    required: 'Bắt buộc !',
                  })}
                />
              </FormRow>
              <FormRow
                inline={true}
                label='Họ Tên: '
                error={errors.HoTenBN?.message}
              >
                <InputNew
                  type='text'
                  name='HoTenBN'
                  {...register('HoTenBN', {
                    required: 'Bắt buộc !',
                  })}
                />
              </FormRow>
              <FormRow
                inline={true}
                label='Triệu Chứng: '
                error={errors.TrieuChung?.message}
              >
                <InputNew
                  type='text'
                  name='TrieuChung'
                  {...register('TrieuChung', {
                    required: 'Bắt buộc !',
                  })}
                />
              </FormRow>
            </Grid2Col>
            <FormRow
              inline={true}
              label='Chẩn Đoán: '
              error={errors.ChanDoan?.message}
            >
              <InputNew
                type='text'
                name='ChanDoan'
                {...register('ChanDoan', {
                  required: 'Bắt buộc !',
                })}
              />
            </FormRow>
          </div>
        </div>

        <div>
          <button className='px-3 py-2 mt-2 mr-5 text-sm font-semibold text-white bg-success-900'>
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalForm;
