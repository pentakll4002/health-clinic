import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLichKham } from './APILichKham';
import toast from 'react-hot-toast';

export function useCreateLichKham() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLichKham,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lichKhams'] });
      toast.success('Đặt lịch khám thành công!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Đặt lịch khám thất bại';
      toast.error(message);
    },
  });
}









