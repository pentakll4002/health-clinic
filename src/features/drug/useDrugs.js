import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getDrugs } from './APIDrugs';
import { PAGE_SIZE_LOAD_MORE } from '../../constants/Global';

export function useDrugs({ keyword = '', page = 1, limit = 100 } = {}) {
  const [curPage, setPage] = useState(page);
  const [drugs, setDrugs] = useState([]);
  const { isLoading, data } = useQuery({
    queryKey: ['drugs', keyword, curPage, limit],
    queryFn: () => getDrugs(curPage, limit, keyword),
  });

  const totalCount = data?.totalCount || 0;

  useEffect(() => {
    setPage(page);
  }, [page]);

  useEffect(() => {
    if (!data?.data) return;
    setDrugs(data.data);
  }, [data]);

  function loadMore() {
    setPage((prev) => prev + 1);
  }

  const hasMore = drugs.length < totalCount;

  return { isLoading, drugs, totalCount, hasMore, loadMore };
}

