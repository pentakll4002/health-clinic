import axiosInstance from '../../utils/axiosInstance';

// Lấy danh sách lịch khám của bệnh nhân hiện tại
export async function getLichKhams(params = {}) {
  const res = await axiosInstance.get('/patient/lich-kham', { params });
  return {
    data: res.data.data,
    totalCount: res.data.totalCount,
  };
}

// Đặt lịch khám mới
export async function createLichKham(data) {
  const res = await axiosInstance.post('/patient/lich-kham', data);
  return res.data;
}

// Lấy chi tiết lịch khám
export async function getLichKham(id) {
  const res = await axiosInstance.get(`/patient/lich-kham/${id}`);
  return res.data;
}

// Hủy lịch khám
export async function cancelLichKham(id) {
  const res = await axiosInstance.post(`/patient/lich-kham/${id}/cancel`);
  return res.data;
}

// Lấy tất cả lịch khám (cho admin/lễ tân)
export async function getAllLichKhams(params = {}) {
  const res = await axiosInstance.get('/lich-kham', { params });
  return {
    data: res.data.data,
    totalCount: res.data.totalCount,
  };
}

// Lấy chi tiết lịch khám (cho admin/lễ tân)
export async function getLichKhamDetail(id) {
  const res = await axiosInstance.get(`/lich-kham/${id}`);
  return res.data;
}

// Cập nhật lịch khám (cho admin/lễ tân)
export async function updateLichKham(id, data) {
  const res = await axiosInstance.put(`/lich-kham/${id}`, data);
  return res.data;
}

// Xác nhận lịch khám (cho admin/lễ tân)
export async function confirmLichKham(id) {
  const res = await axiosInstance.post(`/lich-kham/${id}/confirm`);
  return res.data;
}

// Xóa lịch khám (cho admin/lễ tân)
export async function deleteLichKham(id) {
  const res = await axiosInstance.delete(`/lich-kham/${id}`);
  return res.data;
}

