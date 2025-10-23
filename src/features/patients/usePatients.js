import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getPatients } from './APIPatients';
import { PAGE_SIZE_LOAD_MORE } from '../../constants/Global';

export function usePatients() {
  const [page, setPage] = useState(1);
  const [patients, setPatients] = useState([]);

  const { isLoading, data } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients, 
  });

  const totalCount = data?.totalCount || 0;

  useEffect(() => {
    if (!data?.data) return;
    const slice = data.data.slice(0, page * PAGE_SIZE_LOAD_MORE);
    setPatients(slice);
  }, [data, page]);

  function loadMore() {
    setPage((prev) => prev + 1);
  }

  const hasMore = patients.length < totalCount;

  return { isLoading, patients, totalCount, hasMore, loadMore };
}
