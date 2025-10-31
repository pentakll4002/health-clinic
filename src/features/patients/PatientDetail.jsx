import styled from 'styled-components';

import { useMoveBack } from '../../hooks/useMoveBack';
import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';
import Button from '../../ui/Button';

import { usePatient } from './usePatient';
import { usePhieuKhamByBenhNhan } from '../medicalForm/usePhieuKham';

import {
  CalendarDateRangeIcon,
  ChevronLeftIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import PatientImg from '../../assets/patient.jpg';
import MedicalRow from '../medicalForm/MedicalRow';

const LayoutPatient = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f5f6f8;
`;

const ProfilePatient = styled.div`
  display: flex;
  height: 160px;
  padding: 20px;
  align-items: flex-start;
  gap: 18px;
  align-self: stretch;
  border-radius: 6px;
  border: 1px solid #e7e8eb;
  background: #fff;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);
`;

const Img = styled.img`
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  aspect-ratio: 1/1;
`;

const PatientDetail = () => {
  const moveBack = useMoveBack();
  const { patient, isLoading } = usePatient();
  const {
    isLoading: isLoadingMedical,
    phieuKhams,
    totalCount,
  } = usePhieuKhamByBenhNhan();

  if (isLoading || isLoadingMedical) return <Spinner />;

  if (totalCount.length <= 0) return <div>Không có phiếu khám nào</div>;

  return (
    <LayoutPatient>
      <div className='flex items-center mb-5 gap-x-3'>
        <button onClick={moveBack}>
          <ChevronLeftIcon className='w-4 h-4' />
        </button>
        <h2 className='text-[#000] text-sm leading-5 font-semibold'>
          Bệnh Nhân #{patient.HoTenBN}
        </h2>
      </div>

      <ProfilePatient>
        <Img src={PatientImg} alt='patient' />

        <div className='flex flex-col items-start justify-between h-full gap-[4px] flex-[1_0_0]'>
          <div>
            <span className='text-sm text-primary'>#{patient.ID_BenhNhan}</span>
            <h3 className='text-grey-900 text-[18px] font-bold leading-5'>
              {patient.HoTenBN}
            </h3>
            <span className='text-sm leading-5 text-grey-500'>
              {patient.DiaChi}
            </span>
          </div>

          <div className='flex items-center gap-2 text-sm leading-5 text-grey-500'>
            <PhoneIcon className='w-4 h-4' />
            <span>Phone: {patient.DienThoai}</span>
          </div>
        </div>

        <Button className='text-white bg-primary text-sm px-[15px] mt-auto'>
          <CalendarDateRangeIcon className='w-5 h-5 mr-4' />
          Đặt lịch hẹn
        </Button>
      </ProfilePatient>

      <p className='pb-3 m-6 text-sm font-semibold text-center border-b text-primary border-grey-transparent'>
        Lịch sử khám bệnh
      </p>

      <Table columns='2fr 2fr 2fr 2fr 2fr 2fr'>
        <Table.Header>
          <div className='mx-auto'>ID Phiếu Khám</div>
          <div className='mx-auto'>Ngày Tiếp Nhận</div>
          <div className='mx-auto'>Ca Tiếp Nhận</div>
          <div className='mx-auto'>Tiền Khám</div>
          <div className='mx-auto'>Tổng Tiền Thuốc</div>
          <div className='mx-auto'>Xem phiếu khám</div>
        </Table.Header>

        <Table.Body
          data={phieuKhams}
          render={(phieuKham) => (
            <MedicalRow key={phieuKham.ID_PhieuKham} phieuKham={phieuKham} />
          )}
        />
      </Table>
    </LayoutPatient>
  );
};

export default PatientDetail;
