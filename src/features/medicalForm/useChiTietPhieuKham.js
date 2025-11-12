import { useQuery } from '@tanstack/react-query';
import { getPhieuKham } from './APIPhieuKham';

export function useChiTietPhieuKham(ID_PhieuKham) {
  const { data, isLoading } = useQuery({
    queryKey: ['phieuKham', ID_PhieuKham],
    queryFn: () => getPhieuKham(ID_PhieuKham),
    enabled: !!ID_PhieuKham, 
  });

  return {
    phieuKham: data,
    isLoading,
  };
}
