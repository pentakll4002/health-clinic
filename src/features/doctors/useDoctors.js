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

  const allowedCodes = ['@doctors'];
  const filtered = (doctors || []).filter((doctor) => {
    const groupCode =
      doctor?.nhom_nguoi_dung?.MaNhom ||
      doctor?.nhomNguoiDung?.MaNhom ||
      doctor?.MaNhom;
    return allowedCodes.includes(groupCode);
  });

  const rawCount = totalCount ?? filtered.length ?? 0;
  const pageCount = Math.max(1, Math.ceil(rawCount / PAGE_SIZE));

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

  return { isLoading, doctors: filtered, totalCount: filtered.length };
}
