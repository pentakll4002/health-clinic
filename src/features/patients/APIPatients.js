import axiosInstance from '../../utils/axiosInstance';

export async function getPatients({ page = 1, limit = 27 } = {}) {
  const res = await axiosInstance.get('/benh-nhan', { params: { page, limit } });
  return {
    data: res.data.data,
    totalCount: res.data.totalCount,
  };
}
