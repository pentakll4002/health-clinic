import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLichKham } from './APILichKham';
import toast from 'react-hot-toast';

export function useUpdateLichKham() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateLichKham(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allLichKhams'] });
      queryClient.invalidateQueries({ queryKey: ['lichKhams'] });
      toast.success('Cập nhật lịch khám thành công!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Cập nhật lịch khám thất bại';
      toast.error(message);
    },
  });
}















