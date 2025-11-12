import Table from '../../ui/Table';
import MedicalRow from './MedicalRow';
import { usePhieuKhamList } from './usePhieuKhamList';
import Spinner from '../../ui/Spinner';
import LoadMore from '../../ui/LoadMore';

const MedicalFormsContainer = () => {
  const { isLoading, phieuKhams, hasMore, loadMore } = usePhieuKhamList();

  if (isLoading) return <Spinner />;

  if (phieuKhams.length === 0) {
    return (
      <div className='text-center py-10 text-grey-500'>
        Không có phiếu khám nào
      </div>
    );
  }

  return (
    <>
      <div className='bg-white rounded-lg border border-grey-transparent overflow-hidden'>
        <Table columns='2fr 2fr 2fr 2fr 2fr 2fr'>
          <Table.Header>
            <div className='mx-auto'>ID Phiếu Khám</div>
            <div className='mx-auto'>Ngày Tiếp Nhận</div>
            <div className='mx-auto'>Ca Tiếp Nhận</div>
            <div className='mx-auto'>Tiền Khám</div>
            <div className='mx-auto'>Tổng Tiền Thuốc</div>
            <div className='mx-auto'>Thao Tác</div>
          </Table.Header>

          <Table.Body
            data={phieuKhams}
            render={(phieuKham) => (
              <MedicalRow key={phieuKham.ID_PhieuKham} phieuKham={phieuKham} />
            )}
          />
        </Table>
      </div>

      {!hasMore ? (
        <span />
      ) : (
        <LoadMore onClick={loadMore} disabled={!hasMore} />
      )}
    </>
  );
};

export default MedicalFormsContainer;

