import styled from 'styled-components';

import DoctorImg from '../../assets/doctors.png';
import {
  CalendarDateRangeIcon,
  EllipsisVerticalIcon,
  MapIcon,
} from '@heroicons/react/16/solid';

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

const PatientsCard = () => {
  return (
    <Container>
      <div className='flex items-start justify-between w-full'>
        <div className='flex items-center gap-x-3'>
          <Image src={DoctorImg} alt='patient' />
          <div className='flex flex-col items-start justify-center'>
            <h3 className='text-sm font-semibold text-grey-900'>
              Alberto Ripley
            </h3>
            <p className='text-[13px] text-grey-500'>26, Male</p>
          </div>
        </div>
        <ModalCenter>
          <Menus>
            <Menus.Menu>
              <Menus.Toggle id='1' />

              <Menus.List id='1'>
                <ModalCenter.Open opens='edit'>
                  <Menus.Button icon={<PencilIcon className='w-4 h-4' />}>
                    Chỉnh sửa
                  </Menus.Button>
                </ModalCenter.Open>

                <ModalCenter.Open opens='delete'>
                  <Menus.Button icon={<TrashIcon className='w-4 h-4' />}>
                    Xoá
                  </Menus.Button>
                </ModalCenter.Open>
              </Menus.List>

              <ModalCenter.Window name='edit'>
                <CreateDoctorForm />
              </ModalCenter.Window>

              <ModalCenter.Window name='delete'>
                <ConfirmDelete
                  resourceName='bác sĩ'
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
          <CalendarDateRangeIcon className='w-5 h-5' />
        </span>
        <p>Last Appointment : Mon, 30 Apr 2025</p>
      </div>

      <div className='flex items-center justify-center text-sm gap-x-3 text-grey-500'>
        <span>
          <MapIcon className='w-5 h-5' />
        </span>
        <p>Green Square, New York, USA</p>
      </div>
    </Container>
  );
};

export default PatientsCard;
