import axiosInstance from '../../utils/axiosInstance';

export async function getReports({ page = 1, limit = 10, thang, nam } = {}) {
  const params = { page, limit };
  if (thang) params.thang = thang;
  if (nam) params.nam = nam;
  
  const response = await axiosInstance.get('/bao-cao-doanh-thu', { params });
  return response.data;
}

export async function getReport(id) {
  const response = await axiosInstance.get(`/bao-cao-doanh-thu/${id}`);
  return response.data;
}

export async function createReport(data) {
  const response = await axiosInstance.post('/bao-cao-doanh-thu', data);
  return response.data;
}

export async function deleteReport(id) {
  const response = await axiosInstance.delete(`/bao-cao-doanh-thu/${id}`);
  return response.data;
}

