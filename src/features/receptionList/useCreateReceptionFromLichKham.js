import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReceptionFromLichKham } from './APIReception';
import toast from 'react-hot-toast';

export function useCreateReceptionFromLichKham() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReceptionFromLichKham,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receptions'] });
      queryClient.invalidateQueries({ queryKey: ['allLichKhams'] });
      toast.success('Tiếp nhận bệnh nhân thành công!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Tiếp nhận thất bại';
      toast.error(message);
    },
  });
}




