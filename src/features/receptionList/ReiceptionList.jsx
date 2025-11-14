import { useReceptions } from './useReceptions';
import { useNavigate } from 'react-router-dom';
import ModalCenter from '../../ui/ModalCenter';
import MedicalForm from '../medicalForm/MedicalForm';

import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import styled from 'styled-components';

const Text = styled.span`
  color: #0a1b39;
  font-size: 14px;
  font-weight: 500;
  margin: auto;
`;

const ReiceptionList = () => {
  const navigate = useNavigate();
  const { data: receptions, isLoading } = useReceptions();

  if (isLoading) return <Spinner />;

  return (
    <Table columns='2fr 2fr 2fr 1fr 1fr'>
      <Table.Header>
        <div className='text-center'>Tên bệnh nhân</div>
        <div className='text-center'>Ngày tiếp nhận</div>
        <div className='text-center'>Ca</div>
        <div className='text-center'>Trạng thái</div>
        <div className='text-center'>Hành động</div>
      </Table.Header>

      <Table.Body
        data={receptions || []}
        render={(item) => {
          return (
            <Table.Row key={item.ID_TiepNhan}>
              <Text>{item.HoTenBN}</Text>
              <Text>{item.NgayTN}</Text>
              <Text>{item.CaTN}</Text>

              <Text>
                <span
                  className={`px-2 py-[2px] rounded-full text-sm font-medium ${
                    item.TrangThai === 'Chờ khám'
                      ? 'bg-warning-100 text-warning-900'
                      : item.TrangThai === 'Đang khám'
                      ? 'bg-info-100 text-info-900'
                      : item.TrangThai === 'Hoàn thành'
                      ? 'bg-success-100 text-success-900'
                      : 'bg-error-100 text-error-900'
                  }`}
                >
                  {item.TrangThai}
                </span>
              </Text>

              <div className='flex justify-center'>
                <ModalCenter>
                  <Menus>
                    <Menus.Toggle id={item.ID_BenhNhan} />
                    <Menus.List id={item.ID_BenhNhan}>
                      <Menus.Button
                        onClick={() =>
                          navigate(`/patients/${item.ID_BenhNhan}`)
                        }
                      >
                        Xem thông tin bệnh nhân
                      </Menus.Button>

                      <ModalCenter.Open opens='medical-form'>
                        <Menus.Button>Tạo phiếu khám</Menus.Button>
                      </ModalCenter.Open>
                      <ModalCenter.Window name='medical-form'>
                        <MedicalForm />
                      </ModalCenter.Window>
                    </Menus.List>
                  </Menus>
                </ModalCenter>
              </div>
            </Table.Row>
          );
        }}
      />
    </Table>
  );
};

export default ReiceptionList;
