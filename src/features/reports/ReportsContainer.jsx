import Table from '../../ui/Table';
import { useReports } from './useReports';
import Spinner from '../../ui/Spinner';
import ReportRow from './ReportRow';

const ReportsContainer = ({ thang, nam }) => {
  const { isLoading, reports } = useReports({ thang, nam });

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
      <Table columns='1fr 2fr 2fr 1fr'>
        <Table.Header>
          <div className='mx-auto'>ID Báo Cáo</div>
          <div className='mx-auto'>Thời Gian</div>
          <div className='mx-auto'>Tổng Doanh Thu</div>
          <div className='mx-auto'>Thao Tác</div>
        </Table.Header>

        <Table.Body
          data={reports}
          render={(report) => (
            <ReportRow key={report.ID_BCDT} report={report} />
          )}
        />
      </Table>
    </div>
  );
};

export default ReportsContainer;

