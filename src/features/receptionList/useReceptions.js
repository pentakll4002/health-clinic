import { useQuery } from '@tanstack/react-query';
import { getReceptions } from './APIReception';

export function useReceptions() {
  return useQuery({
    queryKey: ['receptions'],
    queryFn: getReceptions,
    staleTime: 1000 * 60 * 2, 
  });
}
