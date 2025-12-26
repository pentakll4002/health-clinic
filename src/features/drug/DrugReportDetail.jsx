import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { getDrugReport } from './APIDrugs';
import Spinner from '../../ui/Spinner';

const LayoutDrugReportDetail = styled.div`
  padding: 24px;
  background-color: #ffffff;
  width: 1000px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
`;

const Header = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
`;

const Grid2Col = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 16px;
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;
`;

const HighlightValue = styled(Value)`
  color: #059669;
  font-weight: 600;
  font-size: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #1f2937;
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px dashed #d1d5db;
`;

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const DrugReportDetail = ({ ID_BCSDT }) => {
  const { data: report, isLoading } = useQuery({
    queryKey: ['drugReport', ID_BCSDT],
    queryFn: () => getDrugReport(ID_BCSDT),
    enabled: !!ID_BCSDT,
  });

  if (isLoading) return <Spinner />;
  if (!report?.data) return <div>Không tìm thấy báo cáo</div>;

  const reportData = report.data;
  const phieuNhaps = reportData.phieu_nhaps || [];
  const tongSoLuongNhapTuPhieu = reportData.tong_so_luong_nhap_tu_phieu || reportData.TongSoLuongNhap || 0;

  return (
    <LayoutDrugReportDetail>
      <Header>
        <Title>
          Báo Cáo Sử Dụng Thuốc - Tháng {reportData.Thang}/{reportData.Nam}
        </Title>
        <Subtitle>
          {reportData.thuoc?.TenThuoc || 'N/A'}
        </Subtitle>
      </Header>

      <Section>
        <SectionTitle>Thông tin tổng quan</SectionTitle>
        <Grid2Col>
          <InfoRow>
            <Label>ID Báo Cáo</Label>
            <Value>#{reportData.ID_BCSDT}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Tên Thuốc</Label>
            <Value>{reportData.thuoc?.TenThuoc || 'N/A'}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Tháng</Label>
            <Value>Tháng {reportData.Thang}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Năm</Label>
            <Value>{reportData.Nam}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Tổng Số Lượng Nhập</Label>
            <HighlightValue>{tongSoLuongNhapTuPhieu.toLocaleString('vi-VN')}</HighlightValue>
          </InfoRow>
          <InfoRow>
            <Label>Số Lượng Đã Dùng</Label>
            <Value>{reportData.SoLuongDung || 0}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Số Lần Dùng</Label>
            <Value>{reportData.SoLanDung || 0}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Tồn Kho</Label>
            <HighlightValue>
              {(tongSoLuongNhapTuPhieu - (reportData.SoLuongDung || 0)).toLocaleString('vi-VN')}
            </HighlightValue>
          </InfoRow>
        </Grid2Col>
      </Section>

      <Section>
        <SectionTitle>
          Danh sách phiếu nhập ({phieuNhaps.length} phiếu)
        </SectionTitle>
        {phieuNhaps.length > 0 ? (
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Mã Phiếu</TableHeaderCell>
                <TableHeaderCell>Ngày Nhập</TableHeaderCell>
                <TableHeaderCell>Người Nhập</TableHeaderCell>
                <TableHeaderCell>Số Lượng</TableHeaderCell>
                <TableHeaderCell>Đơn Giá Nhập</TableHeaderCell>
                <TableHeaderCell>Thành Tiền</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {phieuNhaps.map((phieuNhap) => {
                const chiTiet = phieuNhap.chi_tiet || [];
                const chiTietThuoc = chiTiet.find(ct => ct.ID_Thuoc === reportData.ID_Thuoc) || chiTiet[0];
                const nhanVienName = phieuNhap.nhan_vien?.HoTen || 
                                   phieuNhap.nhanVien?.HoTen || 
                                   phieuNhap.nhan_vien?.ho_ten ||
                                   phieuNhap.nhanVien?.ho_ten || 
                                   'N/A';
                
                return (
                  <TableRow key={phieuNhap.ID_PhieuNhapThuoc}>
                    <TableCell>#{phieuNhap.ID_PhieuNhapThuoc}</TableCell>
                    <TableCell>{formatDate(phieuNhap.NgayNhap)}</TableCell>
                    <TableCell>{nhanVienName}</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>
                      {chiTietThuoc?.SoLuongNhap || 0}
                    </TableCell>
                    <TableCell>
                      {chiTietThuoc?.DonGiaNhap 
                        ? parseFloat(chiTietThuoc.DonGiaNhap).toLocaleString('vi-VN') + ' đ'
                        : 'N/A'}
                    </TableCell>
                    <TableCell style={{ fontWeight: 600, color: '#059669' }}>
                      {chiTietThuoc?.ThanhTien 
                        ? parseFloat(chiTietThuoc.ThanhTien).toLocaleString('vi-VN') + ' đ'
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <EmptyState>
            Không có phiếu nhập nào trong tháng này
          </EmptyState>
        )}
      </Section>
    </LayoutDrugReportDetail>
  );
};

export default DrugReportDetail;
