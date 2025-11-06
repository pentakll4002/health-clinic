import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export async function getDoctors({ page = 1, limit = 7 }) {
  const res = await API.get('/nhanvien', { params: { page, limit } });
  return {
    data: res.data.data,
    totalCount: res.data.totalCount,
  };
}

export async function createDoctor(newDoctor) {
  try {
    const response = await API.post('/nhanvien', newDoctor);
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
  const resp = await API.get('/nhom-nguoi-dung');
  return resp.data;
}

export async function getDoctor(id) {
  const res = await API.get(`/nhanvien/${id}`);
  return res.data;
}

export async function updateDoctor(id, data) {
  const res = await API.put(`/nhanvien/${id}`, data);
  return res.data;
}

export async function deleteDoctor(id) {
  const res = await API.delete(`/nhanvien/${id}`);
  return res.data;
}