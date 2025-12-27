import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLichKham } from './APILichKham';
import toast from 'react-hot-toast';

export function useDeleteLichKham() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLichKham,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allLichKhams'] });
      queryClient.invalidateQueries({ queryKey: ['lichKhams'] });
      toast.success('Xóa lịch khám thành công!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Xóa lịch khám thất bại';
      toast.error(message);
    },
  });
}










