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
  phieuKham: { ID_PhieuKham, NgayTN, CaTN, TienKham, TongTienThuoc },
}) => {
  return (
    <Table.Row>
      <Text>{ID_PhieuKham}</Text>
      <Text>{NgayTN}</Text>
      <Text>{CaTN}</Text>
      <Text>{TienKham}</Text>
      <Text>{TongTienThuoc}</Text>

      <ModalCenter>
        <ModalCenter.Open opens='medical-detail'>
          <button className='text-white py-1 bg-error-950 w-[50%] flex items-center justify-center rounded-lg font-semibold mx-auto'>
            <EyeIcon className='w-5 h-5' />
          </button>
        </ModalCenter.Open>
        <ModalCenter.Window name='medical-detail'>
          <MedicalDetail ID_PhieuKham={ID_PhieuKham} />
        </ModalCenter.Window>
      </ModalCenter>
    </Table.Row>
  );
};

export default MedicalRow;
