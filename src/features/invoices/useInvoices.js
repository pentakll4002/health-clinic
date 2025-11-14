import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getInvoices } from './APIInvoices';
import { PAGE_SIZE_LOAD_MORE } from '../../constants/Global';

export function useInvoices() {
  const [page, setPage] = useState(1);
  const [invoices, setInvoices] = useState([]);

  const { isLoading, data } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => getInvoices(1, 100),
  });

  const totalCount = data?.totalCount || 0;

  useEffect(() => {
    if (!data?.data) return;
    const slice = data.data.slice(0, page * PAGE_SIZE_LOAD_MORE);
    setInvoices(slice);
  }, [data, page]);

  function loadMore() {
    setPage((prev) => prev + 1);
  }

  const hasMore = invoices.length < totalCount;

  return { isLoading, invoices, totalCount, hasMore, loadMore };
}


