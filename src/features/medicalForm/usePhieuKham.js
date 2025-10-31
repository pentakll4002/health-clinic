import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getPhieuKhamByBenhNhan } from './API_PhieuKham';

export function usePhieuKhamByBenhNhan() {
  const { ID_BenhNhan } = useParams();

  const { isLoading, data } = useQuery({
    queryKey: ['phieukham', ID_BenhNhan],
    queryFn: () => getPhieuKhamByBenhNhan(ID_BenhNhan),
    enabled: !!ID_BenhNhan,
  });

  return {
    isLoading,
    phieuKhams: data?.data || [],
    totalCount: data?.totalCount || 0,
  };
}
