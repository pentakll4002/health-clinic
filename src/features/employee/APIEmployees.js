import axiosInstance from '../../utils/axiosInstance';

export async function getEmployees({ page = 1, limit = 7 }) {
  const response = await axiosInstance.get('/nhanvien', {
    params: { page, limit },
  });

  return {
    data: response.data.data,
    totalCount: response.data.totalCount,
  };
}

export async function getEmployee(id) {
  const response = await axiosInstance.get(`/nhanvien/${id}`);
  return response.data;
}


















