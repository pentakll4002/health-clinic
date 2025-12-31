import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelLichKham } from './APILichKham';
import toast from 'react-hot-toast';

export function useCancelLichKham() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelLichKham,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lichKhams'] });
      toast.success('Hủy lịch khám thành công!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Hủy lịch khám thất bại';
      toast.error(message);
    },
  });
}















