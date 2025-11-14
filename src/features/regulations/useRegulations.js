import { useQuery } from '@tanstack/react-query';
import { getRegulations } from './APIRegulations';

export function useRegulations() {
  const { isLoading, data } = useQuery({
    queryKey: ['regulations'],
    queryFn: getRegulations,
  });

  return { isLoading, regulations: data || {} };
}


