import { useQuery } from '@tanstack/react-query';
import { getStaffPerformance } from './APIAnalytics';

export function useStaffPerformance({ thang, nam } = {}) {
  const { isLoading, data } = useQuery({
    queryKey: ['staff-performance', thang || null, nam || null],
    queryFn: () => getStaffPerformance({ thang, nam }),
    keepPreviousData: true,
  });

  return {
    isLoading,
    data: data || null,
    items: data?.data || [],
  };
}
