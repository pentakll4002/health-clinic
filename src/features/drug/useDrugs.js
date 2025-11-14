import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getDrugs } from './APIDrugs';
import { PAGE_SIZE_LOAD_MORE } from '../../constants/Global';

export function useDrugs() {
  const [page, setPage] = useState(1);
  const [drugs, setDrugs] = useState([]);

  const { isLoading, data } = useQuery({
    queryKey: ['drugs'],
    queryFn: () => getDrugs(1, 100), // Get all drugs first, then paginate client-side
  });

  const totalCount = data?.totalCount || 0;

  useEffect(() => {
    if (!data?.data) return;
    const slice = data.data.slice(0, page * PAGE_SIZE_LOAD_MORE);
    setDrugs(slice);
  }, [data, page]);

  function loadMore() {
    setPage((prev) => prev + 1);
  }

  const hasMore = drugs.length < totalCount;

  return { isLoading, drugs, totalCount, hasMore, loadMore };
}

