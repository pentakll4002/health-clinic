import styled from 'styled-components';

import DoctorImg from '../../assets/doctors.png';

import {
  CalendarDaysIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/16/solid';

import ModalCenter from '../../ui/ModalCenter';
import Menus from '../../ui/Menus';
import CreateDoctorForm from './CreateDoctorForm';
import ConfirmDelete from '../../ui/ConfirmDelete';

const ContainerCardList = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 12px 16px;
  width: 100%;
  gap: 20px;
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s ease;

  &:hover {
    background-color: #f9fafb;
  }
`;

const Image = styled.img`
  flex-shrink: 0;
  object-fit: cover;

  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Button = styled.button`
  padding: 4px;
  background-color: #fff;
  border: 1px solid #e7e8eb;
  border-radius: 6px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);
`;

const DoctorsCard = ({ doctor }) => {
  const { id, name, birthday, numberPhone, role } = doctor;

  return (
    <ContainerCardList>
      <Image src={DoctorImg} alt='docter' />

      <div className='flex items-center gap-2 mr-10 w-[200px]'>
        <h3 className='text-sm font-semibold leading-5 text-grey-900'>
          {name}
        </h3>
        <span className='text-[13px] text-grey-500'>{role}</span>
      </div>

      <p className='text-grey-500 text-[13px] mr-10 w-[200px]'>
        Ngày sinh: {birthday}
      </p>

      <p className='text-grey-500 text-[13px] mr-auto'>
        Số điện thoại:{' '}
        <span className='text-sm font-semibold text-primary'>
          {numberPhone}
        </span>
      </p>

      <div className='flex justify-center gap-x-5'>
        <ModalCenter>
          <Menus>
            <Menus.Menu>
              <Menus.Toggle id={id} />

              <Menus.List id={id}>
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

        <Button onClick={() => {}}>
          <CalendarDaysIcon className='w-5 h-5' />
        </Button>
      </div>
    </ContainerCardList>
  );
};

export default DoctorsCard;
