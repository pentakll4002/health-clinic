import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

async function getUserProfile() {
  try {
    const response = await axiosInstance.get('/user-profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Nếu lỗi 401, clear token và redirect về login
    if (error?.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
      window.location.href = '/sign-in';
    }
    throw error;
  }
}

export function useUser() {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    retry: (failureCount, error) => {
      // Không retry nếu lỗi 401 (Unauthorized)
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token, // Chỉ enable khi có token
  });

  const user = data?.user;
  // Check both snake_case and camelCase (Laravel might return either)
  const nhanVien = user?.nhan_vien || user?.nhanVien;
  // Check if user has nhan_vien relationship OR role is nhan_vien
  const isNhanVien = (nhanVien !== null && nhanVien !== undefined) || user?.role === 'nhan_vien';

  // Debug log để kiểm tra
  if (!isLoading && user) {
    console.log('👤 useUser - User data:', {
      hasUser: !!user,
      hasNhanVien: !!nhanVien,
      nhanVienKeys: nhanVien ? Object.keys(nhanVien) : null,
      nhanVienNhom: nhanVien?.nhom_nguoi_dung || nhanVien?.nhomNguoiDung,
    });
  }
  
  if (error) {
    console.error('❌ Error fetching user profile:', error);
  }

  return {
    user,
    isLoading,
    isNhanVien,
    nhanVien,
    error,
  };
}

