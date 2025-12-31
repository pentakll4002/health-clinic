import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZE } from '../../constants/Global';
import { getEmployees } from './APIEmployees';

export function useEmployees() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const page = !searchParams.get('page') ? 1 : Number(searchParams.get('page'));
  const search = searchParams.get('search') || '';

  const { isLoading, data: { data: employees, totalCount } = {} } = useQuery({
    queryKey: ['employees', page, search],
    queryFn: () => getEmployees({ page, search }),
    keepPreviousData: true,
  });

  const pageCount = Math.max(1, Math.ceil((totalCount ?? 0) / PAGE_SIZE));

  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ['employees', page + 1],
      queryFn: () => getEmployees({ page: page + 1, search }),
    });
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ['employees', page - 1],
      queryFn: () => getEmployees({ page: page - 1, search }),
    });
  }

  return {
    employees,
    totalCount,
    isLoading,
  };
}



















