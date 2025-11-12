import axiosInstance from '../../utils/axiosInstance';

export async function getPhieuKhamList(page = 1, limit = 7) {
  const response = await axiosInstance.get('/phieu-kham', {
    params: { page, limit },
  });
  return response.data;
}

export async function getPhieuKham(id) {
  const response = await axiosInstance.get(`/phieu-kham/${id}`);
  return response.data;
}

export async function createPhieuKham(data) {
  const response = await axiosInstance.post('/phieu-kham', data);
  return response.data;
}

export async function updatePhieuKham(id, data) {
  const response = await axiosInstance.put(`/phieu-kham/${id}`, data);
  return response.data;
}

export async function deletePhieuKham(id) {
  const response = await axiosInstance.delete(`/phieu-kham/${id}`);
  return response.data;
}

// ToaThuoc APIs
export async function addThuocToToa(data) {
  const response = await axiosInstance.post('/toa-thuoc', data);
  return response.data;
}

export async function removeThuocFromToa(phieuKhamId, thuocId) {
  const response = await axiosInstance.delete(`/toa-thuoc/${phieuKhamId}/${thuocId}`);
  return response.data;
}

// LoaiBenh APIs
export async function getLoaiBenhList() {
  const response = await axiosInstance.get('/loai-benh');
  return response.data;
}

