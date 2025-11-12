import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getAppointments } from './APIAppointments';
import { PAGE_SIZE_LOAD_MORE } from '../../constants/Global';

export function useAppointments() {
  const [page, setPage] = useState(1);
  const [appointments, setAppointments] = useState([]);

  const { isLoading, data } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => getAppointments(1, 100), // Get all appointments first, then paginate client-side
  });

  const totalCount = data?.totalCount || 0;

  useEffect(() => {
    if (!data?.data) return;
    const slice = data.data.slice(0, page * PAGE_SIZE_LOAD_MORE);
    setAppointments(slice);
  }, [data, page]);

  function loadMore() {
    setPage((prev) => prev + 1);
  }

  const hasMore = appointments.length < totalCount;

  return { isLoading, appointments, totalCount, hasMore, loadMore };
}

