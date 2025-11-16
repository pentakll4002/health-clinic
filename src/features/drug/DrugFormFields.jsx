import FormRow from '../../ui/FormRow';
import InputNew from '../../ui/InputNew';
import Select from '../../ui/Select';
import InputImage from '../../ui/InputImage';

const DrugFormFields = ({ register, errors, dvtList = [], cachDungList = [] }) => {
  return (
    <>
      <InputImage />
      <div />

      <FormRow label='Tên thuốc*' error={errors.TenThuoc?.message}>
        <InputNew
          type='text'
          id='TenThuoc'
          {...register('TenThuoc', {
            required: 'Bắt buộc !',
          })}
        />
      </FormRow>

      <FormRow label='Đơn vị tính*' error={errors.ID_DVT?.message}>
        <Select
          id='ID_DVT'
          {...register('ID_DVT', {
            required: 'Bắt buộc !',
          })}
        >
          <option value=''>Chọn đơn vị tính</option>
          {dvtList.map((dvt) => (
            <option key={dvt.ID_DVT} value={dvt.ID_DVT}>
              {dvt.TenDVT}
            </option>
          ))}
        </Select>
      </FormRow>

      <FormRow label='Cách dùng*' error={errors.ID_CachDung?.message}>
        <Select
          id='ID_CachDung'
          {...register('ID_CachDung', {
            required: 'Bắt buộc !',
          })}
        >
          <option value=''>Chọn cách dùng</option>
          {cachDungList.map((cachDung) => (
            <option key={cachDung.ID_CachDung} value={cachDung.ID_CachDung}>
              {cachDung.MoTaCachDung}
            </option>
          ))}
        </Select>
      </FormRow>

      <FormRow label='Thành phần' error={errors.ThanhPhan?.message}>
        <InputNew
          type='text'
          id='ThanhPhan'
          {...register('ThanhPhan')}
        />
      </FormRow>

      <FormRow label='Xuất xứ' error={errors.XuatXu?.message}>
        <InputNew
          type='text'
          id='XuatXu'
          {...register('XuatXu')}
        />
      </FormRow>

      <FormRow label='Số lượng tồn' error={errors.SoLuongTon?.message}>
        <InputNew
          type='number'
          id='SoLuongTon'
          min='0'
          {...register('SoLuongTon')}
        />
      </FormRow>

      <FormRow label='Giá nhập' error={errors.DonGiaNhap?.message}>
        <InputNew
          type='number'
          id='DonGiaNhap'
          min='0'
          step='0.01'
          {...register('DonGiaNhap')}
        />
      </FormRow>

      <FormRow label='Tỷ lệ giá bán' error={errors.TyLeGiaBan?.message}>
        <InputNew
          type='number'
          id='TyLeGiaBan'
          min='0'
          step='0.01'
          {...register('TyLeGiaBan')}
        />
      </FormRow>

      <FormRow label='Giá bán' error={errors.DonGiaBan?.message}>
        <InputNew
          type='number'
          id='DonGiaBan'
          min='0'
          step='0.01'
          {...register('DonGiaBan')}
        />
      </FormRow>

      <FormRow label='Hình ảnh (URL)' error={errors.HinhAnh?.message}>
        <InputNew
          type='text'
          id='HinhAnh'
          {...register('HinhAnh')}
        />
      </FormRow>
    </>
  );
};

export default DrugFormFields;

