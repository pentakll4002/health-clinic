import Table from '../../ui/Table';
import { useDrugImports } from './useDrugImports';
import Spinner from '../../ui/Spinner';
import DrugImportRow from './DrugImportRow';

const DrugImportContainer = ({ tu_ngay, den_ngay }) => {
  const { isLoading, data: imports } = useDrugImports({
    tu_ngay,
    den_ngay,
  });

  if (isLoading) return <Spinner />;

  if (imports.length === 0) {
    return (
      <div className='text-center py-10 text-grey-500'>
        Chưa có phiếu nhập thuốc nào. Hãy tạo phiếu nhập mới.
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg border border-grey-transparent overflow-hidden'>
      <Table columns='1fr 1.5fr 2fr 1fr 1.5fr 1fr'>
        <Table.Header>
          <div className='mx-auto'>Mã Phiếu</div>
          <div className='mx-auto'>Ngày Nhập</div>
          <div className='mx-auto'>Người Nhập</div>
          <div className='mx-auto'>Số Loại Thuốc</div>
          <div className='mx-auto'>Tổng Tiền</div>
          <div className='mx-auto'>Thao Tác</div>
        </Table.Header>

        <Table.Body
          data={imports}
          render={(importData) => (
            <DrugImportRow key={importData.ID_PhieuNhapThuoc} importData={importData} />
          )}
        />
      </Table>
    </div>
  );
};

export default DrugImportContainer;

