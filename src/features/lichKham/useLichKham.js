import { useQuery } from '@tanstack/react-query';
import { getLichKham } from './APILichKham';

export function useLichKham(id) {
  const { isLoading, data } = useQuery({
    queryKey: ['lichKham', id],
    queryFn: () => getLichKham(id),
    enabled: !!id,
  });

  return {
    isLoading,
    lichKham: data,
  };
}














