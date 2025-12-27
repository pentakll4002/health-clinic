import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { getInvoices } from './APIInvoices';
import { PAGE_SIZE_LOAD_MORE } from '../../constants/Global';

export function useInvoices({ date_from, date_to } = {}) {
  const [page, setPage] = useState(1);

  const { isLoading, data } = useQuery({
    queryKey: ['invoices', date_from, date_to],
    queryFn: () =>
      getInvoices(1, 100, {
        date_from,
        date_to,
      }),
    keepPreviousData: true,
  });

  const allInvoices = data?.data || [];
  const totalCount = data?.totalCount || 0;

  // Chỉ lấy số lượng cần hiển thị (load more)
  const invoices = useMemo(() => {
    return allInvoices.slice(0, page * PAGE_SIZE_LOAD_MORE);
  }, [allInvoices, page]);

  function loadMore() {
    setPage((prev) => prev + 1);
  }

  const hasMore = invoices.length < totalCount;

  return {
    isLoading,
    invoices,
    totalCount,
    hasMore,
    loadMore,
  };
}
