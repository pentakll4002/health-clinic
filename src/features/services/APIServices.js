import axiosInstance from '../../utils/axiosInstance';

export async function getServices() {
  const res = await axiosInstance.get('/dich-vu');
  return res.data;
}

export async function createService(data) {
  const res = await axiosInstance.post('/dich-vu', data);
  return res.data;
}

export async function updateService(id, data) {
  const res = await axiosInstance.put(`/dich-vu/${id}`, data);
  return res.data;
}

export async function deleteService(id) {
  const res = await axiosInstance.delete(`/dich-vu/${id}`);
  return res.data;
}
