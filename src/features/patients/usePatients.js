import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getPatients } from './APIPatients';
import { PAGE_SIZE_LOAD_MORE } from '../../constants/Global';

export function usePatients(searchParams = {}) {
  const [page, setPage] = useState(1);
  const [patients, setPatients] = useState([]);

  // Tạo query key dựa trên search params để refetch khi search thay đổi
  const searchKey = JSON.stringify(searchParams);

  const { isLoading, data } = useQuery({
    queryKey: ['patients', searchKey],
    queryFn: () => getPatients({ page: 1, limit: 100, searchParams }), 
  });

  const totalCount = data?.totalCount || 0;

  useEffect(() => {
    // Reset page khi search thay đổi
    setPage(1);
  }, [searchKey]);

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
