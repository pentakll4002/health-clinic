import { useQuery } from '@tanstack/react-query';
import { getPhieuKhamById } from './API_PhieuKham';

export function useChiTietPhieuKham(ID_PhieuKham) {
  const { data, isLoading } = useQuery({
    queryKey: ['phieuKham', ID_PhieuKham],
    queryFn: () => getPhieuKhamById(ID_PhieuKham),
    enabled: !!ID_PhieuKham, 
  });

  return {
    phieuKham: data,
    isLoading,
  };
}
