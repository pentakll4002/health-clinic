import axiosInstance from '../../utils/axiosInstance';

export async function getAppointments(page = 1, limit = 7) {
  const response = await axiosInstance.get('/appointments', {
    params: { page, limit },
  });
  return response.data;
}

export async function getAppointment(id) {
  const response = await axiosInstance.get(`/appointments/${id}`);
  return response.data;
}

export async function createAppointment(data) {
  const response = await axiosInstance.post('/appointments', data);
  return response.data;
}

export async function updateAppointment(id, data) {
  const response = await axiosInstance.put(`/appointments/${id}`, data);
  return response.data;
}

export async function deleteAppointment(id) {
  const response = await axiosInstance.delete(`/appointments/${id}`);
  return response.data;
}

