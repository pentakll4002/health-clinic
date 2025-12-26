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

  // Reset về trang 1 khi keyword thay đổi
  useEffect(() => {
    setPage(1);
    setDrugs([]);
  }, [keyword]);

  useEffect(() => {
    if (!data?.data) return;
    
    // Nếu đang ở trang 1, thay thế danh sách
    // Nếu load more (trang > 1), append vào danh sách
    if (curPage === 1) {
      setDrugs(data.data);
    } else {
      setDrugs((prev) => {
        // Tránh duplicate khi append
        const existingIds = new Set(prev.map(d => d.ID_Thuoc));
        const newDrugs = data.data.filter(d => !existingIds.has(d.ID_Thuoc));
        return [...prev, ...newDrugs];
      });
    }
  }, [data, curPage]);

  function loadMore() {
    setPage((prev) => prev + 1);
  }

  const hasMore = drugs.length < totalCount;

  return { isLoading, drugs, totalCount, hasMore, loadMore };
}

