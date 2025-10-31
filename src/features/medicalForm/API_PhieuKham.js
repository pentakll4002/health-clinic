export async function getPhieuKhamList() {
  const totalCount = 20;

  const allPhieuKham = Array.from({ length: totalCount }, (_, i) => ({
    ID_PhieuKham: i + 1,
    ID_TiepNhan: 100 + i,
    ID_BenhNhan: (i % 5) + 1,
    NgayTN: `2025-0${(i % 9) + 1}-1${(i % 9) + 1}`,
    CaTN: ['Sáng', 'Chiều'][i % 2],
    TienKham: 100000 + i * 5000,
    TongTienThuoc: 200000 + i * 10000,
    BacSi: `BS. Tran Thi ${String.fromCharCode(65 + (i % 5))}`,
    TrangThai: i % 3 === 0 ? 'Đã khám' : 'Đang khám',
    Is_Deleted: false,
  }));

  await new Promise((resolve) => setTimeout(resolve, 400));

  return { data: allPhieuKham, totalCount };
}

export async function getPhieuKhamByBenhNhan(ID_BenhNhan) {
  const { data } = await getPhieuKhamList();
  const filtered = data.filter(
    (p) => p.ID_BenhNhan === Number(ID_BenhNhan) && !p.Is_Deleted
  );

  // Giả delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return { data: filtered, totalCount: filtered.length };
}

export async function getPhieuKhamById(ID_PhieuKham) {
  const { data } = await getPhieuKhamList();
  const record = data.find((p) => p.ID_PhieuKham === Number(ID_PhieuKham));

  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!record) return null;

  return {
    ...record,
    HoTenBN: `Nguyen Van ${record.ID_BenhNhan}`,
    TrieuChung: 'Đau đầu, chóng mặt',
    ChanDoan: 'Cảm cúm nhẹ',
    DonThuoc: [
      {
        TenThuoc: 'Paracetamol 500mg',
        DonViTinh: 'Viên',
        CachDung: 'Sáng, sau ăn',
        SoLuong: 10,
        DonGia: 3000,
        ThanhTien: 30000,
      },
      {
        TenThuoc: 'Vitamin C',
        DonViTinh: 'Viên',
        CachDung: 'Sáng, sau ăn',
        SoLuong: 5,
        DonGia: 2000,
        ThanhTien: 10000,
      },
    ],
  };
}
