import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { getDrugReport } from './APIDrugs';
import Spinner from '../../ui/Spinner';

const LayoutDrugReportDetail = styled.div`
  padding: 20px;
  background-color: #f5f6f8;
  width: 900px;
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

const DrugReportDetail = ({ ID_BCSDT }) => {
  const { data: report, isLoading } = useQuery({
    queryKey: ['drugReport', ID_BCSDT],
    queryFn: () => getDrugReport(ID_BCSDT),
    enabled: !!ID_BCSDT,
  });

  if (isLoading) return <Spinner />;
  if (!report) return <div>Không tìm thấy báo cáo</div>;

  return (
    <LayoutDrugReportDetail>
      <h2 className='mb-5 text-xl font-bold leading-6 text-grey-900'>
        Báo Cáo Sử Dụng Thuốc Tháng {report.Thang}/{report.Nam}
      </h2>

      <Grid2Col>
        <Row label='ID Báo Cáo' value={report.ID_BCSDT} />
        <Row label='Tên Thuốc' value={report.thuoc?.TenThuoc || 'N/A'} />
        <Row label='Tháng' value={report.Thang} />
        <Row label='Năm' value={report.Nam} />
        <Row label='Tổng Số Lượng Nhập' value={report.TongSoLuongNhap || 0} />
        <Row label='Số Lượng Dùng' value={report.SoLuongDung || 0} />
        <Row label='Số Lần Dùng' value={report.SoLanDung || 0} />
      </Grid2Col>
    </LayoutDrugReportDetail>
  );
};

export default DrugReportDetail;

