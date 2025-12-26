import Table from '../../ui/Table';
import styled from 'styled-components';
import ModalCenter from '../../ui/ModalCenter';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import DrugImportDetail from './DrugImportDetail';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { useDrugImports } from './useDrugImports';
// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Text = styled.span`
  color: #0a1b39;
  font-size: 14px;
  font-weight: 500;
  margin: auto;
`;

const DrugImportRow = ({ importData }) => {
  const {
    ID_PhieuNhapThuoc,
    NgayNhap,
    TongTienNhap,
    nhanVien,
    chiTiet,
  } = importData;

  const { deleteImport, isDeleting } = useDrugImports();

  function handleDelete() {
    deleteImport(ID_PhieuNhapThuoc);
  }

  const formattedDate = formatDate(NgayNhap);

  const nhanVienName =
    nhanVien?.HoTen || nhanVien?.ho_ten || 'N/A';

  const soLuongThuoc = chiTiet?.length || 0;

  return (
    <Table.Row>
      <Text>{ID_PhieuNhapThuoc}</Text>
      <Text>{formattedDate}</Text>
      <Text>{nhanVienName}</Text>
      <Text>{soLuongThuoc}</Text>
      <Text>{parseFloat(TongTienNhap || 0).toLocaleString('vi-VN')} đ</Text>

      <div className='flex items-center justify-center gap-2'>
        <ModalCenter>
          <ModalCenter.Open opens={`drug-import-detail-${ID_PhieuNhapThuoc}`}>
            <button className='text-white py-1 px-2 bg-primary flex items-center justify-center rounded-lg font-semibold'>
              <EyeIcon className='w-5 h-5' />
            </button>
          </ModalCenter.Open>
          <ModalCenter.Window name={`drug-import-detail-${ID_PhieuNhapThuoc}`}>
            <DrugImportDetail ID_PhieuNhapThuoc={ID_PhieuNhapThuoc} />
          </ModalCenter.Window>
        </ModalCenter>

        <ModalCenter>
          <ModalCenter.Open opens={`delete-drug-import-${ID_PhieuNhapThuoc}`}>
            <button className='text-white py-1 px-2 bg-error-900 flex items-center justify-center rounded-lg font-semibold'>
              <TrashIcon className='w-5 h-5' />
            </button>
          </ModalCenter.Open>
          <ModalCenter.Window name={`delete-drug-import-${ID_PhieuNhapThuoc}`}>
            <ConfirmDelete
              resourceName={`Phiếu nhập thuốc #${ID_PhieuNhapThuoc}`}
              onConfirm={handleDelete}
              disabled={isDeleting}
            />
          </ModalCenter.Window>
        </ModalCenter>
      </div>
    </Table.Row>
  );
};

export default DrugImportRow;

