import { useQuery } from '@tanstack/react-query';
import { getReports } from './APIReports';
import { PAGE_SIZE } from '../../constants/Global';

export function useReports({ thang, nam } = {}) {
  const { isLoading, data: { data: reports, totalCount } = {} } = useQuery({
    queryKey: ['reports', thang, nam],
    queryFn: () => getReports({ page: 1, limit: 100, thang, nam }),
    keepPreviousData: true,
  });

  return { isLoading, reports: reports || [], totalCount: totalCount || 0 };
}

