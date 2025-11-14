
const mockReceptions = [
  {
    ID_TiepNhan: 1,
    ID_BenhNhan: 1,
    HoTenBN: 'Nguyễn Văn A',
    DienThoai: '0901234567',
    NgayTN: '2025-11-10',
    CaTN: 'Sáng',
    TenNhanVien: 'Lễ tân 1',
    TrangThai: 'Chờ khám',
  },
  {
    ID_TiepNhan: 2,
    ID_BenhNhan: 102,
    HoTenBN: 'Trần Thị B',
    DienThoai: '0909988776',
    NgayTN: '2025-11-10',
    CaTN: 'Chiều',
    TenNhanVien: 'Lễ tân 2',
    TrangThai: 'Đang khám',
  },
  {
    ID_TiepNhan: 3,
    ID_BenhNhan: 103,
    HoTenBN: 'Phạm Văn C',
    DienThoai: '0988112233',
    NgayTN: '2025-11-09',
    CaTN: 'Sáng',
    TenNhanVien: 'Lễ tân 1',
    TrangThai: 'Hoàn thành',
  },
];


export async function getReceptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockReceptions);
    }, 800);
  });
}
