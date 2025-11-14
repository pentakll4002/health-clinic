import { useQuery } from '@tanstack/react-query';
import { getDrug } from './APIDrugs';

export function useDrug(id) {
  const {
    isLoading,
    data: drug,
    error,
  } = useQuery({
    queryKey: ['drug', id],
    queryFn: () => getDrug(id),
    enabled: !!id,
  });

  return { isLoading, drug, error };
}

