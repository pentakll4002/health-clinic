import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getAppointment } from './APIAppointments';

export function useAppointment() {
  const { id } = useParams();

  const { isLoading, data: appointment } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => getAppointment(id),
    enabled: !!id,
    retry: false,
  });

  return { isLoading, appointment };
}

























