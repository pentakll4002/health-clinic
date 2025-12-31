import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

async function fetchMyPermissions() {
  const res = await axiosInstance.get('/my-permissions');
  return res.data;
}

export function useMyPermissions() {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

  return useQuery({
    queryKey: ['my-permissions'],
    queryFn: fetchMyPermissions,
    enabled: !!token,
    staleTime: 0,
  });
}
