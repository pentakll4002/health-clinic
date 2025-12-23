import axiosInstance from '../../utils/axiosInstance';

export async function getDoctors({ page = 1, limit = 7 }) {
  const res = await axiosInstance.get('/nhanvien', { params: { page, limit } });
  return {
    data: res.data.data,
    totalCount: res.data.totalCount,
  };
}

export async function createDoctor(newDoctor) {
  try {
    const response = await axiosInstance.post('/nhanvien', newDoctor);
    return response.data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    if (error.response) {
      console.error('Validation errors:', error.response.data);
    }
    throw error;
  }
}

export async function fetchGroups() {
  const resp = await axiosInstance.get('/nhom-nguoi-dung');
  return resp.data;
}

export async function getDoctor(id) {
  const res = await axiosInstance.get(`/nhanvien/${id}`);
  return res.data;
}

export async function updateDoctor(id, data) {
  const res = await axiosInstance.put(`/nhanvien/${id}`, data);
  return res.data;
}

export async function deleteDoctor(id) {
  const res = await axiosInstance.delete(`/nhanvien/${id}`);
  return res.data;
}