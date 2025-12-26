import { useQuery } from '@tanstack/react-query';
import { getDrugImport } from './APIDrugs';
import Spinner from '../../ui/Spinner';
// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
import styled from 'styled-components';

const DetailContainer = styled.div`
  padding: 24px;
`;

const DetailSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
`;

const Value = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const TableHeader = styled.thead`
  background-color: #f9fafb;
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:hover {
    background-color: #f9fafb;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  font-size: 14px;
  color: #1f2937;
`;

const TotalRow = styled.tr`
  background-color: #f0f9ff;
  font-weight: 600;
`;

const DrugImportDetail = ({ ID_PhieuNhapThuoc }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['drug-import', ID_PhieuNhapThuoc],
    queryFn: () => getDrugImport(ID_PhieuNhapThuoc),
  });

  if (isLoading) return <Spinner />;

  if (error || !data?.data) {
    return (
      <DetailContainer>
        <p className='text-red-600'>Không thể tải chi tiết phiếu nhập thuốc</p>
      </DetailContainer>
    );
  }

  const phieuNhap = data.data;
  const chiTiet = phieuNhap.chiTiet || [];

  return (
    <DetailContainer>
      <DetailSection>
        <SectionTitle>Thông tin phiếu nhập</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <Label>Mã phiếu</Label>
            <Value>#{phieuNhap.ID_PhieuNhapThuoc}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Ngày nhập</Label>
            <Value>{formatDate(phieuNhap.NgayNhap)}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Người nhập</Label>
            <Value>
              {phieuNhap.nhanVien?.HoTen ||
                phieuNhap.nhanVien?.ho_ten ||
                'N/A'}
            </Value>
          </InfoItem>
          <InfoItem>
            <Label>Tổng tiền nhập</Label>
            <Value className='text-primary font-semibold'>
              {parseFloat(phieuNhap.TongTienNhap || 0).toLocaleString('vi-VN')} đ
            </Value>
          </InfoItem>
        </InfoGrid>
      </DetailSection>

      <DetailSection>
        <SectionTitle>Chi tiết thuốc nhập</SectionTitle>
        <Table>
          <TableHeader>
            <tr>
              <TableHeaderCell>STT</TableHeaderCell>
              <TableHeaderCell>Tên thuốc</TableHeaderCell>
              <TableHeaderCell>Số lượng</TableHeaderCell>
              <TableHeaderCell>Đơn giá</TableHeaderCell>
              <TableHeaderCell>Hạn sử dụng</TableHeaderCell>
              <TableHeaderCell>Thành tiền</TableHeaderCell>
            </tr>
          </TableHeader>
          <TableBody>
            {chiTiet.map((item, index) => (
              <TableRow key={`${item.ID_PhieuNhapThuoc}-${item.ID_Thuoc}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {item.thuoc?.TenThuoc || item.thuoc?.ten_thuoc || 'N/A'}
                </TableCell>
                <TableCell>{item.SoLuongNhap || 0}</TableCell>
                <TableCell>
                  {parseFloat(item.DonGiaNhap || 0).toLocaleString('vi-VN')} đ
                </TableCell>
                <TableCell>{formatDate(item.HanSuDung)}</TableCell>
                <TableCell className='font-semibold'>
                  {parseFloat(item.ThanhTien || 0).toLocaleString('vi-VN')} đ
                </TableCell>
              </TableRow>
            ))}
            <TotalRow>
              <TableCell colSpan={5} style={{ textAlign: 'right' }}>
                Tổng cộng:
              </TableCell>
              <TableCell className='font-semibold text-primary'>
                {parseFloat(phieuNhap.TongTienNhap || 0).toLocaleString('vi-VN')} đ
              </TableCell>
            </TotalRow>
          </TableBody>
        </Table>
      </DetailSection>
    </DetailContainer>
  );
};

export default DrugImportDetail;

