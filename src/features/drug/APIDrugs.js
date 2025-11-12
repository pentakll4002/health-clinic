import axiosInstance from '../../utils/axiosInstance';

export async function getDrugs(page = 1, limit = 7) {
  const response = await axiosInstance.get('/thuoc', {
    params: { page, limit },
  });
  return response.data;
}

export async function getDrug(id) {
  const response = await axiosInstance.get(`/thuoc/${id}`);
  return response.data;
}

export async function createDrug(data) {
  const response = await axiosInstance.post('/thuoc', data);
  return response.data;
}

export async function updateDrug(id, data) {
  const response = await axiosInstance.put(`/thuoc/${id}`, data);
  return response.data;
}

export async function deleteDrug(id) {
  const response = await axiosInstance.delete(`/thuoc/${id}`);
  return response.data;
}

export async function getDVT() {
  const response = await axiosInstance.get('/dvt');
  return response.data;
}

export async function getCachDung() {
  const response = await axiosInstance.get('/cach-dung');
  return response.data;
}

