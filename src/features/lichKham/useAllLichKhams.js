import { useQuery } from '@tanstack/react-query';
import { getAllLichKhams } from './APILichKham';

export function useAllLichKhams(params = {}) {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['allLichKhams', params],
    queryFn: () => getAllLichKhams(params),
  });

  return {
    isLoading,
    lichKhams: data?.data || [],
    totalCount: data?.totalCount || 0,
    refetch,
  };
}










