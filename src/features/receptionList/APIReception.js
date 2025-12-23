import axiosInstance from '../../utils/axiosInstance';

export async function getReceptions(params = {}) {
  const res = await axiosInstance.get('/appointments', { params });
  return res.data; // Trả về cả data và totalCount
}

export async function getReceptionsToday(params = {}) {
  // Lấy ngày hiện tại theo timezone local để tránh lệch ngày (UTC)
  const now = new Date();
  const todayLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0]; // format YYYY-MM-DD

  const res = await axiosInstance.get('/appointments', {
    params: {
      ...params,
      ngay: todayLocal,
      chua_kham: true, // Chỉ lấy bệnh nhân chưa khám
    },
  });
  return {
    data: res.data.data || [],
    totalCount: res.data.totalCount || 0,
  };
}

// Tạo tiếp nhận từ lịch khám đã xác nhận
export async function createReceptionFromLichKham(ID_LichKham, ID_NhanVien) {
  const res = await axiosInstance.post('/appointments/from-lich-kham', {
    ID_LichKham,
    ID_NhanVien,
  });
  return res.data;
}
