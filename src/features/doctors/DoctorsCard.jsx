import styled from 'styled-components';

import DoctorImg from '../../assets/doctors.png';
import {
  CalendarDaysIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/16/solid';

const ContainerCardGrid = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 20px;
  gap: 16px;
  border-radius: 6px;
  background-color: #fff;
  width: 100%;

  transition: background 0.2s ease;

  &:hover {
    background-color: #f9fafb;
  }
`;

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

  ${({ $layout }) =>
    $layout === 'list'
      ? `
        width: 50px;
        height: 50px;
        border-radius: 50%;
      `
      : `
        width: 120px;
        height: 120px;
        border-radius: 6px;
      `}
`;

const ContainerContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const Button = styled.button`
  padding: 4px;
  background-color: #fff;
  border: 1px solid #e7e8eb;
  border-radius: 6px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);
`;

const DoctorsCard = ({ layout, doctor }) => {
  const { name, birthday, numberPhone, role } = doctor;

  if (layout === 'grid') {
    return (
      <ContainerCardGrid>
        <Image src={DoctorImg} alt='docter' $layout={layout} />

        <ContainerContent>
          <div className='flex items-start justify-between w-full'>
            <div className='flex flex-col items-start gap-1'>
              <h3 className='text-sm font-semibold leading-5 text-grey-900'>
                {name}
              </h3>
              <span className='text-[13px] text-grey-500'>{role}</span>
            </div>

            <Button onClick={() => {}}>
              <EllipsisVerticalIcon className='w-4 h-4 font-normal' />
            </Button>
          </div>

          <p className='text-grey-500 text-[13px]'>Birthday: {birthday}</p>

          <div className='flex items-center justify-between w-full'>
            <p className='text-grey-500 text-[13px]'>
              PhoneNumber:{' '}
              <span className='text-sm font-semibold text-primary'>
                {numberPhone}
              </span>
            </p>

            <Button onClick={() => {}}>
              <CalendarDaysIcon className='w-5 h-5' />
            </Button>
          </div>
        </ContainerContent>
      </ContainerCardGrid>
    );
  }

  if (layout === 'list') {
    return (
      <ContainerCardList>
        <Image src={DoctorImg} alt='docter' $layout={layout} />

        <div className='flex items-center gap-2 mr-10 w-[200px]'>
          <h3 className='text-sm font-semibold leading-5 text-grey-900'>
            {name}
          </h3>
          <span className='text-[13px] text-grey-500'>{role}</span>
        </div>

        <p className='text-grey-500 text-[13px] mr-10 w-[200px]'>
          Birthday: {birthday}
        </p>

        <p className='text-grey-500 text-[13px] mr-auto'>
          PhoneNumber:{' '}
          <span className='text-sm font-semibold text-primary'>
            {numberPhone}
          </span>
        </p>

        <div className='flex justify-center gap-x-5'>
          <Button onClick={() => {}}>
            <EllipsisVerticalIcon className='w-4 h-4 font-normal' />
          </Button>
          <Button onClick={() => {}}>
            <CalendarDaysIcon className='w-5 h-5' />
          </Button>
        </div>
      </ContainerCardList>
    );
  }
};

export default DoctorsCard;
