import { useQuery } from '@tanstack/react-query';
import { getDrugReports } from './APIDrugs';
import { PAGE_SIZE } from '../../constants/Global';

export function useDrugReports({ thang, nam, id_thuoc } = {}) {
  const { isLoading, data: { data: reports, totalCount } = {} } = useQuery({
    queryKey: ['drugReports', thang, nam, id_thuoc],
    queryFn: () => getDrugReports({ page: 1, limit: 100, thang, nam, id_thuoc }),
    keepPreviousData: true,
  });

  return { isLoading, reports: reports || [], totalCount: totalCount || 0 };
}

