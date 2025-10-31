import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getPatient } from './APIPatient';

export function usePatient() {
  const { ID_BenhNhan } = useParams();

  const { isLoading, data: patient } = useQuery({
    queryKey: ['patient', ID_BenhNhan],
    queryFn: () => getPatient(ID_BenhNhan),
    retry: false,
  });

  return { isLoading, patient };
}
