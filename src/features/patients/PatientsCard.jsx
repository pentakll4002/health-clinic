import styled from 'styled-components';
import ModalCenter from '../../ui/ModalCenter';
import Menus from '../../ui/Menus';

import DoctorImg from '../../assets/doctors.png';
import {
  CalendarDateRangeIcon,
  MapIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/16/solid';
import CreateDoctorForm from '../doctors/CreateDoctorForm';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { PhoneArrowDownLeftIcon } from '@heroicons/react/24/outline';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 20px;
  align-items: flex-start;
  border-radius: 6px;
  border: 1px solid #e7e8eb;
  background: #fff;
`;

const Image = styled.img`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 48px;
  object-fit: cover;
`;

const PatientsCard = ({ patient }) => {
  const { ID_BenhNhan, HoTenBN, GioiTinh, NgaySinh, DienThoai, DiaChi } =
    patient;
  return (
    <Container>
      <div className='flex items-start justify-between w-full'>
        <div className='flex items-center gap-x-3'>
          <Image src={DoctorImg} alt='patient' />
          <div className='flex flex-col items-start justify-center'>
            <h3 className='text-sm font-semibold text-grey-900'>{HoTenBN}</h3>
            <p className='text-[13px] text-grey-500'>26, {GioiTinh}</p>
          </div>
        </div>
        <ModalCenter>
          <Menus>
            <Menus.Menu>
              <Menus.Toggle id={ID_BenhNhan} />

              <Menus.List id={ID_BenhNhan}>
                <Menus.Button icon={<PencilIcon className='w-4 h-4' />}>
                  Chi tiết
                </Menus.Button>

                <ModalCenter.Open opens='delete'>
                  <Menus.Button icon={<TrashIcon className='w-4 h-4' />}>
                    Xoá
                  </Menus.Button>
                </ModalCenter.Open>
              </Menus.List>

              <ModalCenter.Window name='delete'>
                <ConfirmDelete
                  resourceName='Bệnh nhân'
                  disabled={() => {}}
                  onConfirm={() => {}}
                  onCloseModal={close}
                />
              </ModalCenter.Window>
            </Menus.Menu>
          </Menus>
        </ModalCenter>
      </div>

      <div className='flex items-center justify-center text-sm gap-x-3 text-grey-500'>
        <span>
          <PhoneArrowDownLeftIcon className='w-5 h-5' />
        </span>
        <p>{DienThoai}</p>
      </div>

      <div className='flex items-center justify-center text-sm gap-x-3 text-grey-500'>
        <span>
          <MapIcon className='w-5 h-5' />
        </span>
        <p>{DiaChi}</p>
      </div>
    </Container>
  );
};

export default PatientsCard;
