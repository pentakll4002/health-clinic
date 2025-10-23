export async function getPatients() {
  const totalCount = 27;

  const allPatients = Array.from({ length: totalCount }, (_, i) => ({
    ID_BenhNhan: i + 1,
    HoTenBN: `Nguyen Van ${i + 1}`,
    NgaySinh: `19${70 + (i % 30)}-0${(i % 9) + 1}-15`,
    GioiTinh: i % 2 === 0 ? 'Nam' : 'Nữ',
    CCCD: `01234567${(1000 + i).toString().slice(-4)}`,
    DienThoai: `090${(1000000 + i).toString().slice(-7)}`,
    DiaChi: `Số ${i + 10}, Đường ABC, Quận ${(i % 5) + 1}, TP.HCM`,
    Email: `benhnhan${i + 1}@gmail.com`,
    Is_Deleted: false,
    NgayDK: `2023-0${(i % 9) + 1}-10`,
  }));

  // Giả delay 0.5s
  await new Promise((resolve) => setTimeout(resolve, 500));

  return { data: allPatients, totalCount };
}
