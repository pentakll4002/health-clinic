import { useQuery } from '@tanstack/react-query';
import { getReceptionsToday } from './APIReception';

export function useReceptionsToday(params = {}) {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['receptionsToday', params],
    queryFn: () => getReceptionsToday(params),
  });

  return {
    isLoading,
    receptions: data?.data || [],
    totalCount: data?.totalCount || 0,
    refetch,
  };
}










