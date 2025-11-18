import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

async function getUserProfile() {
  const response = await axiosInstance.get('/user-profile');
  return response.data;
}

export function useUser() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true, // Always enable
  });

  const user = data?.user;
  // Check both snake_case and camelCase (Laravel might return either)
  const nhanVien = user?.nhan_vien || user?.nhanVien;
  // Check if user has nhan_vien relationship OR role is nhan_vien
  const isNhanVien = (nhanVien !== null && nhanVien !== undefined) || user?.role === 'nhan_vien';

  // Debug log
  if (error) {
    console.error('Error fetching user profile:', error);
  }

  return {
    user,
    isLoading,
    isNhanVien,
    nhanVien,
    error,
  };
}

