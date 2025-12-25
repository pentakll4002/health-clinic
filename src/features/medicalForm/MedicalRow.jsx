import { EyeIcon } from '@heroicons/react/24/outline';
import Table from '../../ui/Table';
import styled from 'styled-components';
import ModalCenter from '../../ui/ModalCenter';
import MedicalDetail from './MedicalDetail';

const Text = styled.span`
  color: #0a1b39;
  font-size: 14px;
  font-weight: 500;
  margin: auto;
`;

const MedicalRow = ({
  phieuKham,
}) => {
  const {
    ID_PhieuKham,
    TienKham,
    TongTienThuoc,
    CaKham,
    NgayTN,
    CaTN,
  } = phieuKham;

  const tiepNhan = phieuKham.tiepNhan || phieuKham.tiep_nhan;

  const ngayTiepNhan = tiepNhan?.NgayTN ?? NgayTN;
  const caTiepNhan = tiepNhan?.CaTN ?? CaTN ?? CaKham;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  return (
    <Table.Row>
      <Text>{ID_PhieuKham}</Text>
      <Text>{ngayTiepNhan}</Text>
      <Text>{caTiepNhan}</Text>
      <Text>{formatCurrency(TienKham)}</Text>
      <Text>{formatCurrency(TongTienThuoc)}</Text>

      <ModalCenter>
        <ModalCenter.Open opens={`medical-detail-${ID_PhieuKham}`}>
          <button className='text-white py-1 bg-error-950 w-[50%] flex items-center justify-center rounded-lg font-semibold mx-auto'>
            <EyeIcon className='w-5 h-5' />
          </button>
        </ModalCenter.Open>
        <ModalCenter.Window name={`medical-detail-${ID_PhieuKham}`}>
          <MedicalDetail ID_PhieuKham={ID_PhieuKham} />
        </ModalCenter.Window>
      </ModalCenter>
    </Table.Row>
  );
};

export default MedicalRow;
