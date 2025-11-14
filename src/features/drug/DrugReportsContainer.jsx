import Table from '../../ui/Table';
import { useDrugReports } from './useDrugReports';
import Spinner from '../../ui/Spinner';
import DrugReportRow from './DrugReportRow';

const DrugReportsContainer = ({ thang, nam, id_thuoc }) => {
  const { isLoading, reports } = useDrugReports({ thang, nam, id_thuoc });

  if (isLoading) return <Spinner />;

  if (reports.length === 0) {
    return (
      <div className='text-center py-10 text-grey-500'>
        Chưa có báo cáo nào. Hãy lập báo cáo mới.
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg border border-grey-transparent overflow-hidden'>
      <Table columns='1fr 2fr 1fr 1fr 1fr 1fr 1fr'>
        <Table.Header>
          <div className='mx-auto'>ID Báo Cáo</div>
          <div className='mx-auto'>Tên Thuốc</div>
          <div className='mx-auto'>Thời Gian</div>
          <div className='mx-auto'>Tổng Nhập</div>
          <div className='mx-auto'>Số Lượng Dùng</div>
          <div className='mx-auto'>Số Lần Dùng</div>
          <div className='mx-auto'>Thao Tác</div>
        </Table.Header>

        <Table.Body
          data={reports}
          render={(report) => (
            <DrugReportRow key={report.ID_BCSDT} report={report} />
          )}
        />
      </Table>
    </div>
  );
};

export default DrugReportsContainer;

