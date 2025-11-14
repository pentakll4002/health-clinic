import axiosInstance from '../../utils/axiosInstance';

export async function getPatients({ page = 1, limit = 27, searchParams = {} } = {}) {
  const params = { page, limit, ...searchParams };
  const res = await axiosInstance.get('/benh-nhan', { params });
  return {
    data: res.data.data,
    totalCount: res.data.totalCount,
  };
}
