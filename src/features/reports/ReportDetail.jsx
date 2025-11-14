import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { getReport } from './APIReports';
import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';

const LayoutReportDetail = styled.div`
  padding: 20px;
  background-color: #f5f6f8;
  width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Text = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #091833;
  margin: auto;
`;

const Grid2Col = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 12px;
  margin: 20px auto;
`;

const Row = ({ label, value }) => (
  <div className='flex items-center gap-3'>
    <span className='text-sm font-medium text-grey-900 min-w-[160px]'>{label}</span>
    <Text>{value}</Text>
  </div>
);

const ReportDetail = ({ ID_BCDT }) => {
  const { data: report, isLoading } = useQuery({
    queryKey: ['report', ID_BCDT],
    queryFn: () => getReport(ID_BCDT),
    enabled: !!ID_BCDT,
  });

  if (isLoading) return <Spinner />;
  if (!report) return <div>Không tìm thấy báo cáo</div>;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
      amount || 0
    );

  const formatPercentage = (value) => {
    return `${parseFloat(value || 0).toFixed(2)}%`;
  };

  // Sắp xếp chi tiết theo ngày
  const sortedChiTiet = [...(report.chi_tiet || [])].sort((a, b) => a.Ngay - b.Ngay);

  return (
    <LayoutReportDetail>
      <h2 className='mb-5 text-xl font-bold leading-6 text-grey-900'>
        Báo Cáo Doanh Thu Tháng {report.Thang}/{report.Nam}
      </h2>

      <Grid2Col>
        <Row label='ID Báo Cáo' value={report.ID_BCDT} />
        <Row label='Tháng' value={report.Thang} />
        <Row label='Năm' value={report.Nam} />
        <Row label='Tổng Doanh Thu' value={formatCurrency(report.TongDoanhThu)} />
      </Grid2Col>

      <div className='mt-6'>
        <h3 className='mb-4 text-lg font-semibold text-grey-900'>
          Chi Tiết Theo Ngày
        </h3>
        <div className='bg-white rounded-lg border border-grey-transparent overflow-hidden'>
          <Table columns='1fr 1fr 1fr 1fr'>
            <Table.Header>
              <div className='mx-auto'>Ngày</div>
              <div className='mx-auto'>Số Bệnh Nhân</div>
              <div className='mx-auto'>Doanh Thu</div>
              <div className='mx-auto'>Tỷ Lệ (%)</div>
            </Table.Header>

            <Table.Body
              data={sortedChiTiet}
              render={(chiTiet) => (
                <Table.Row key={chiTiet.ID_CTBCDT}>
                  <Text>{chiTiet.Ngay}</Text>
                  <Text>{chiTiet.SoBenhNhan}</Text>
                  <Text>{formatCurrency(chiTiet.DoanhThu)}</Text>
                  <Text>{formatPercentage(chiTiet.TyLe)}</Text>
                </Table.Row>
              )}
            />
          </Table>
        </div>
      </div>
    </LayoutReportDetail>
  );
};

export default ReportDetail;

