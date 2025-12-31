import { useQuery } from '@tanstack/react-query';
import { getManagerAnalyticsSummary } from './APIAnalytics';

export function useManagerAnalytics({ thang, nam } = {}) {
  const { isLoading, data } = useQuery({
    queryKey: ['manager-analytics-summary', thang || null, nam || null],
    queryFn: () => getManagerAnalyticsSummary({ thang, nam }),
    keepPreviousData: true,
  });

  return {
    isLoading,
    data: data || null,
    kpis: data?.kpis || null,
  };
}
