import axiosInstance from '../../utils/axiosInstance';

export async function getManagerAnalyticsSummary({ thang, nam } = {}) {
  const params = {};
  if (thang) params.thang = thang;
  if (nam) params.nam = nam;
  const res = await axiosInstance.get('/manager/analytics/summary', { params });
  return res.data;
}

export async function getStaffPerformance({ thang, nam } = {}) {
  const params = {};
  if (thang) params.thang = thang;
  if (nam) params.nam = nam;
  const res = await axiosInstance.get('/manager/analytics/staff-performance', { params });
  return res.data;
}
