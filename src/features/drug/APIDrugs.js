import axiosInstance from '../../utils/axiosInstance';

export async function getDrugs(page = 1, limit = 7, keyword = "") {
  const params = { page, limit };
  if (keyword) {
    params.keyword = keyword;
    params.search = keyword;
    params.ten = keyword;
    params.name = keyword;
  }
  const response = await axiosInstance.get('/thuoc', { params });
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

// Drug Reports API
export async function getDrugReports({ page = 1, limit = 10, thang, nam, id_thuoc } = {}) {
  const params = { page, limit };
  if (thang) params.thang = thang;
  if (nam) params.nam = nam;
  if (id_thuoc) params.id_thuoc = id_thuoc;
  
  const response = await axiosInstance.get('/bao-cao-su-dung-thuoc', { params });
  return response.data;
}

export async function getDrugReport(id) {
  const response = await axiosInstance.get(`/bao-cao-su-dung-thuoc/${id}`);
  return response.data;
}

export async function createDrugReport(data) {
  const response = await axiosInstance.post('/bao-cao-su-dung-thuoc', data);
  return response.data;
}

export async function deleteDrugReport(id) {
  const response = await axiosInstance.delete(`/bao-cao-su-dung-thuoc/${id}`);
  return response.data;
}

