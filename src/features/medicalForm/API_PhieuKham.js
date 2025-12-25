import axiosInstance from '../../utils/axiosInstance';

export async function getPhieuKhamList(params = {}) {
  const res = await axiosInstance.get('/phieu-kham', { params });
  return res.data;
}

export async function getPhieuKhamByBenhNhan(ID_BenhNhan) {
  const res = await axiosInstance.get('/phieu-kham', { params: { ID_BenhNhan } });
  return {
    data: res.data.data || [],
    totalCount: res.data.totalCount || 0,
  };
}

export async function getPhieuKhamById(ID_PhieuKham) {
  const res = await axiosInstance.get(`/phieu-kham/${ID_PhieuKham}`);
  return res.data;
}

// Tạo phiếu khám mới
export async function createPhieuKham(data) {
  const res = await axiosInstance.post('/phieu-kham', data);
  return res.data;
}

// Cập nhật phiếu khám
export async function updatePhieuKham(id, data) {
  const res = await axiosInstance.put(`/phieu-kham/${id}`, data);
  return res.data;
}

// Toa thuốc (kê đơn)
export async function addToaThuoc(id, data) {
  const res = await axiosInstance.post(`/phieu-kham/${id}/toa-thuoc`, data);
  return res.data;
}

export async function updateToaThuoc(id, thuocId, data) {
  const res = await axiosInstance.put(`/phieu-kham/${id}/toa-thuoc/${thuocId}`, data);
  return res.data;
}

export async function removeToaThuoc(id, thuocId) {
  const res = await axiosInstance.delete(`/phieu-kham/${id}/toa-thuoc/${thuocId}`);
  return res.data;
}

// Kiểm tra có thể tạo phiếu khám không
export async function checkCanCreatePhieuKham(ID_TiepNhan) {
  const res = await axiosInstance.post('/phieu-kham/check-can-create', { ID_TiepNhan });
  return res.data;
}

// Hoàn tất khám (Bước 4)
export async function completePhieuKham(id) {
  const res = await axiosInstance.post(`/phieu-kham/${id}/complete`);
  return res.data;
}