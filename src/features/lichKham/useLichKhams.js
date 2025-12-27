import { useQuery } from '@tanstack/react-query';
import { getLichKhams } from './APILichKham';

export function useLichKhams(params = {}) {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['lichKhams', params],
    queryFn: () => getLichKhams(params),
  });

  return {
    isLoading,
    lichKhams: data?.data || [],
    totalCount: data?.totalCount || 0,
    refetch,
  };
}










