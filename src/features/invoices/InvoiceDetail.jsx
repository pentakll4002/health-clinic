import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { getInvoice } from './APIInvoices';
import Spinner from '../../ui/Spinner';

const LayoutInvoiceDetail = styled.div`
  padding: 20px;
  background-color: #f5f6f8;
  width: 900px;
  height: 100%;
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

const InvoiceDetail = ({ ID_HoaDon }) => {
  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', ID_HoaDon],
    queryFn: () => getInvoice(ID_HoaDon),
    enabled: !!ID_HoaDon,
  });

  if (isLoading) return <Spinner />;
  if (!invoice) return <div>Không tìm thấy hoá đơn</div>;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
      amount || 0
    );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const staff = invoice.nhanVien || invoice.nhan_vien;
  const medicalForm = invoice.phieuKham || invoice.phieu_kham;
  const tiepNhan = medicalForm?.tiepNhan || medicalForm?.tiep_nhan;
  const benhNhan = tiepNhan?.benhNhan || tiepNhan?.benh_nhan;
  const mainService = medicalForm?.dichVu || medicalForm?.dich_vu;
  const extraServices = medicalForm?.ctDichVuPhu || medicalForm?.ct_dich_vu_phu || [];
  const prescriptions = medicalForm?.toaThuoc || medicalForm?.toa_thuoc || [];

  const openPrintWindow = () => {
    const safe = (v) => (v === null || v === undefined || v === '' ? 'N/A' : String(v));
    const fmtMoney = (v) => formatCurrency(Number(v || 0));

    const extraRows = (extraServices || [])
      .filter((x) => !x?.Is_Deleted)
      .map((x) => {
        const dv = x?.dichVu || x?.dich_vu;
        return `
          <tr>
            <td>${safe(dv?.TenDichVu)}</td>
            <td style="text-align:right;">${safe(x?.SoLuong ?? 0)}</td>
            <td style="text-align:right;">${fmtMoney(x?.DonGiaApDung)}</td>
            <td style="text-align:right;">${fmtMoney(x?.ThanhTien)}</td>
          </tr>
        `;
      })
      .join('');

    const drugRows = (prescriptions || [])
      .map((x) => {
        const thuoc = x?.thuoc;
        return `
          <tr>
            <td>${safe(thuoc?.TenThuoc)}</td>
            <td style="text-align:right;">${safe(x?.SoLuong ?? 0)}</td>
            <td style="text-align:right;">${fmtMoney(x?.DonGiaBan_LuocMua)}</td>
            <td style="text-align:right;">${fmtMoney(x?.TienThuoc)}</td>
          </tr>
        `;
      })
      .join('');

    const w = window.open('', '_blank', 'noopener,noreferrer,width=980,height=720');
    if (!w) return;

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>HoaDon_${safe(invoice.ID_HoaDon)}</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; color: #111827; margin: 24px; }
            .wrap { max-width: 920px; margin: 0 auto; }
            .title { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom: 16px; }
            h1 { font-size: 20px; margin: 0; }
            .muted { color: #6b7280; font-size: 12px; }
            .grid { display:grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin: 12px 0 18px; }
            .row { display:flex; gap: 8px; }
            .label { width: 160px; color:#374151; font-size: 13px; font-weight: 600; }
            .val { font-size: 13px; }
            .section { margin-top: 14px; }
            .section h2 { font-size: 14px; margin: 0 0 8px; color:#111827; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #e5e7eb; padding: 8px; font-size: 12.5px; }
            th { background: #f9fafb; text-align:left; }
            .totals { margin-top: 14px; display:flex; justify-content:flex-end; }
            .totals .box { min-width: 340px; }
            .totals .line { display:flex; justify-content:space-between; padding: 6px 0; font-size: 13px; }
            .totals .line strong { font-size: 14px; }
            @media print {
              body { margin: 0; }
              .wrap { margin: 0; max-width: none; padding: 24px; }
            }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="title">
              <div>
                <h1>HOÁ ĐƠN #${safe(invoice.ID_HoaDon)}</h1>
                <div class="muted">Ngày: ${safe(formatDate(invoice.NgayHoaDon))}</div>
              </div>
              <div class="muted">Health Clinic</div>
            </div>

            <div class="grid">
              <div class="row"><div class="label">Phiếu khám</div><div class="val">#${safe(medicalForm?.ID_PhieuKham)}</div></div>
              <div class="row"><div class="label">Nhân viên</div><div class="val">${safe(staff?.HoTenNV)}</div></div>
              <div class="row"><div class="label">Bệnh nhân</div><div class="val">${safe(benhNhan?.HoTenBN)}</div></div>
              <div class="row"><div class="label">Mã bệnh nhân</div><div class="val">${safe(benhNhan?.ID_BenhNhan)}</div></div>
              <div class="row"><div class="label">Dịch vụ chính</div><div class="val">${safe(mainService?.TenDichVu)}</div></div>
              <div class="row"><div class="label">Tiền khám (snapshot)</div><div class="val">${fmtMoney(invoice.TienKham)}</div></div>
            </div>

            <div class="section">
              <h2>Thuốc</h2>
              <table>
                <thead>
                  <tr>
                    <th>Tên thuốc</th>
                    <th style="text-align:right;">SL</th>
                    <th style="text-align:right;">Đơn giá</th>
                    <th style="text-align:right;">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  ${drugRows || `<tr><td colspan="4" style="text-align:center;color:#6b7280;">Không có</td></tr>`}
                </tbody>
              </table>
            </div>

            <div class="section">
              <h2>Dịch vụ phụ</h2>
              <table>
                <thead>
                  <tr>
                    <th>Tên dịch vụ</th>
                    <th style="text-align:right;">SL</th>
                    <th style="text-align:right;">Đơn giá áp dụng</th>
                    <th style="text-align:right;">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  ${extraRows || `<tr><td colspan="4" style="text-align:center;color:#6b7280;">Không có</td></tr>`}
                </tbody>
              </table>
            </div>

            <div class="totals">
              <div class="box">
                <div class="line"><span>Tiền khám</span><span>${fmtMoney(invoice.TienKham)}</span></div>
                <div class="line"><span>Tiền thuốc</span><span>${fmtMoney(invoice.TienThuoc)}</span></div>
                <div class="line"><span>Tiền dịch vụ</span><span>${fmtMoney(invoice.TienDichVu)}</span></div>
                <div class="line" style="border-top:1px solid #e5e7eb; margin-top: 6px;">
                  <strong>Tổng tiền</strong><strong>${fmtMoney(invoice.TongTien)}</strong>
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  return (
    <LayoutInvoiceDetail>
      <div className='flex items-center justify-between mb-5'>
        <h2 className='text-xl font-bold leading-6 text-grey-900'>
          Hoá Đơn #{invoice.ID_HoaDon}
        </h2>
        <button
          type='button'
          onClick={openPrintWindow}
          className='px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition'
        >
          Xuất PDF
        </button>
      </div>

      <Grid2Col>
        <Row label='Mã phiếu khám' value={medicalForm?.ID_PhieuKham || 'N/A'} />
        <Row label='Ngày hoá đơn' value={formatDate(invoice.NgayHoaDon)} />
        <Row label='Bệnh nhân' value={benhNhan?.HoTenBN || 'N/A'} />
        <Row label='Bác sĩ/nhân viên' value={staff?.HoTenNV || 'N/A'} />
        <Row label='Tiền khám' value={formatCurrency(invoice.TienKham)} />
        <Row label='Tiền thuốc' value={formatCurrency(invoice.TienThuoc)} />
        <Row label='Tiền dịch vụ' value={formatCurrency(invoice.TienDichVu)} />
        <Row label='Tổng tiền' value={formatCurrency(invoice.TongTien)} />
      </Grid2Col>
    </LayoutInvoiceDetail>
  );
};

export default InvoiceDetail;


