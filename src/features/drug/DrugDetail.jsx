import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDrug } from './useDrug';
import Spinner from '../../ui/Spinner';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import UpdateDrugForm from './UpdateDrugForm';
import ModalCenter from '../../ui/ModalCenter';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDrug } from './APIDrugs';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f6f8;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e7e8eb;
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
  background: #f5f6f8;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const Value = styled.span`
  font-size: 16px;
  color: #111827;
  font-weight: 600;
`;

const DrugDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoading, drug } = useDrug(id);
  const queryClient = useQueryClient();

  const { mutate: deleteDrugMutation, isLoading: isDeleting } = useMutation({
    mutationFn: deleteDrug,
    onSuccess: () => {
      toast.success('Xóa thuốc thành công');
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
      navigate('/drugs');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Xóa thuốc thất bại');
    },
  });

  function handleDelete() {
    deleteDrugMutation(id);
  }

  if (isLoading) return <Spinner />;

  if (!drug) {
    return (
      <Container>
        <Card>
          <div className='text-center py-10 text-grey-500'>
            Không tìm thấy thuốc
          </div>
        </Card>
      </Container>
    );
  }

  const {
    TenThuoc,
    SoLuongTon,
    DonGiaBan,
    DonGiaNhap,
    HinhAnh,
    ThanhPhan,
    XuatXu,
    TyLeGiaBan,
    dvt,
    cach_dung: cachDung,
  } = drug;

  return (
    <Container>
      <div className='mb-4'>
        <Button
          className='flex items-center gap-2 bg-white text-grey-900 px-4 py-2 border border-grey-transparent'
          onClick={() => navigate('/drugs')}
        >
          <ArrowLeftIcon className='w-5 h-5' />
          <span>Quay lại</span>
        </Button>
      </div>

      <Card>
        <div className='flex items-start justify-between mb-6'>
          <h1 className='text-2xl font-bold text-grey-900'>{TenThuoc}</h1>
          <div className='flex items-center gap-2'>
            <Modal>
              <Modal.Open opens='edit-drug'>
                <Button className='flex items-center gap-2 bg-primary text-white px-4 py-2'>
                  <PencilIcon className='w-5 h-5' />
                  <span>Chỉnh sửa</span>
                </Button>
              </Modal.Open>

              <Modal.Window name='edit-drug'>
                <UpdateDrugForm drug={drug} />
              </Modal.Window>
            </Modal>

            <ModalCenter>
              <ModalCenter.Open opens='delete-drug'>
                <Button className='flex items-center gap-2 bg-red-500 text-white px-4 py-2'>
                  <TrashIcon className='w-5 h-5' />
                  <span>Xóa</span>
                </Button>
              </ModalCenter.Open>

              <ModalCenter.Window name='delete-drug'>
                <ConfirmDelete
                  resourceName='Thuốc'
                  disabled={isDeleting}
                  onConfirm={handleDelete}
                  onCloseModal={() => {}}
                />
              </ModalCenter.Window>
            </ModalCenter>
          </div>
        </div>

        <div className='flex gap-8'>
          <Image
            src={HinhAnh || '/placeholder-drug.jpg'}
            alt={TenThuoc}
            onError={(e) => {
              e.target.src = '/placeholder-drug.jpg';
            }}
          />

          <div className='flex-1'>
            <InfoGrid>
              <InfoItem>
                <Label>Đơn vị tính</Label>
                <Value>{dvt?.TenDVT || 'N/A'}</Value>
              </InfoItem>

              <InfoItem>
                <Label>Cách dùng</Label>
                <Value>{cachDung?.MoTaCachDung || 'N/A'}</Value>
              </InfoItem>

              <InfoItem>
                <Label>Thành phần</Label>
                <Value>{ThanhPhan || 'N/A'}</Value>
              </InfoItem>

              <InfoItem>
                <Label>Xuất xứ</Label>
                <Value>{XuatXu || 'N/A'}</Value>
              </InfoItem>

              <InfoItem>
                <Label>Số lượng tồn</Label>
                <Value>{SoLuongTon || 0}</Value>
              </InfoItem>

              <InfoItem>
                <Label>Giá nhập</Label>
                <Value>
                  {DonGiaNhap
                    ? new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(DonGiaNhap)
                    : 'N/A'}
                </Value>
              </InfoItem>

              <InfoItem>
                <Label>Tỷ lệ giá bán</Label>
                <Value>{TyLeGiaBan ? `${TyLeGiaBan}%` : 'N/A'}</Value>
              </InfoItem>

              <InfoItem>
                <Label>Giá bán</Label>
                <Value className='text-primary'>
                  {DonGiaBan
                    ? new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(DonGiaBan)
                    : 'N/A'}
                </Value>
              </InfoItem>
            </InfoGrid>
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default DrugDetail;

