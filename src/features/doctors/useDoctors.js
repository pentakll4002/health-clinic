import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZE } from '../../constants/Global';
import { getDoctors } from './APIdoctors';

export function useDoctors() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const page = !searchParams.get('page') ? 1 : Number(searchParams.get('page'));

  //QUERY
  const { isLoading, data: { data: doctors, totalCount } = {} } = useQuery({
    queryKey: ['doctors', page],
    queryFn: () => getDoctors({ page }),
    keepPreviousData: true,
  });

  const pageCount = Math.ceil(totalCount / PAGE_SIZE);

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ['doctors', page + 1],
      queryFn: () => getDoctors({ page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ['doctors', page - 1],
      queryFn: () => getDoctors({ page: page - 1 }),
    });

  return { isLoading, doctors, totalCount };
}
