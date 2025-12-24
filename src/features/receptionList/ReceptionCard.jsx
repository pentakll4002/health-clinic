import styled from 'styled-components';
import ModalCenter from '../../ui/ModalCenter';
import Menus from '../../ui/Menus';
import PatientImg from '../../assets/patient.jpg';
import { PencilIcon } from '@heroicons/react/16/solid';
import { PhoneArrowDownLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import CreatePhieuKhamForm from '../medicalForm/CreatePhieuKhamForm';
import Button from '../../ui/Button';
import { useState } from 'react';

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

const ReceptionCard = ({ tiepNhan }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const benhNhan = tiepNhan.benhNhan || tiepNhan.benh_nhan;
  const nhanVien = tiepNhan.nhanVien || tiepNhan.nhan_vien;
  
  // Kiểm tra xem có thể lập phiếu khám không
  const canCreatePhieuKham = 
    tiepNhan.TrangThai === false || tiepNhan.TrangThai === 0; // Chưa khám
  const hasPhieuKham = tiepNhan.phieuKhams && tiepNhan.phieuKhams.length > 0;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <Container>
      <div className='flex items-start justify-between w-full'>
        <div className='flex items-center gap-x-3'>
          <Image src={PatientImg} alt='patient' />
          <div className='flex flex-col items-start justify-center'>
            <h3 className='text-sm font-semibold text-grey-900'>
              {benhNhan?.HoTenBN || 'N/A'}
            </h3>
            <p className='text-[13px] text-grey-500'>
              {formatDate(tiepNhan.NgayTN)} - {tiepNhan.CaTN}
            </p>
          </div>
        </div>
        <ModalCenter>
          <Menus>
            <Menus.Menu>
              <Menus.Toggle id={tiepNhan.ID_TiepNhan} />

              <Menus.List id={tiepNhan.ID_TiepNhan}>
                <Menus.Button
                  icon={<PencilIcon className='w-4 h-4' />}
                  onClick={() => navigate(`/patients/${benhNhan?.ID_BenhNhan}`)}
                >
                  Chi tiết bệnh nhân
                </Menus.Button>
              </Menus.List>
            </Menus.Menu>
          </Menus>
        </ModalCenter>
      </div>

      <div className='flex items-center justify-center text-sm gap-x-3 text-grey-500'>
        <span>
          <PhoneArrowDownLeftIcon className='w-5 h-5' />
        </span>
        <p>{benhNhan?.DienThoai || 'N/A'}</p>
      </div>

      <div className='flex items-center justify-between w-full'>
        <div className='flex items-center gap-2'>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              canCreatePhieuKham && !hasPhieuKham
                ? 'bg-warning-100 text-warning-900'
                : hasPhieuKham
                ? 'bg-info-100 text-info-900'
                : 'bg-success-100 text-success-900'
            }`}
          >
            {canCreatePhieuKham && !hasPhieuKham
              ? 'Chờ khám'
              : hasPhieuKham
              ? 'Đã có phiếu khám'
              : 'Đã khám'}
          </span>
          {nhanVien && (
            <span className='text-xs text-grey-500'>
              Lễ tân: {nhanVien.HoTenNV || nhanVien.HoTen}
            </span>
          )}
        </div>

        {canCreatePhieuKham && !hasPhieuKham && (
          <ModalCenter>
            <ModalCenter.Open opens={`create-phieu-kham-${tiepNhan.ID_TiepNhan}`}>
              <Button className='bg-primary text-white text-sm px-3 py-1.5'>
                Lập phiếu khám
              </Button>
            </ModalCenter.Open>
            <ModalCenter.Window name={`create-phieu-kham-${tiepNhan.ID_TiepNhan}`}>
              <CreatePhieuKhamForm
                tiepNhan={tiepNhan}
                onCloseModal={() => setIsModalOpen(false)}
                onSuccess={() => {
                  setIsModalOpen(false);
                  window.location.reload(); // Refresh để cập nhật danh sách
                }}
              />
            </ModalCenter.Window>
          </ModalCenter>
        )}
      </div>
    </Container>
  );
};

export default ReceptionCard;




