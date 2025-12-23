import { useMutation, useQueryClient } from '@tanstack/react-query';
import { confirmLichKham } from './APILichKham';
import toast from 'react-hot-toast';

export function useConfirmLichKham() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmLichKham,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['allLichKhams'] });
      queryClient.invalidateQueries({ queryKey: ['lichKhams'] });
      queryClient.invalidateQueries({ queryKey: ['receptions'] }); // Refresh danh sách tiếp nhận vì đã tự động tạo
      queryClient.invalidateQueries({ queryKey: ['receptionsToday'] }); // Refresh danh sách tiếp nhận hôm nay
      const message = data?.data?.message || 'Xác nhận lịch khám thành công! Bệnh nhân đã được thêm vào danh sách tiếp nhận.';
      toast.success(message);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Xác nhận lịch khám thất bại';
      toast.error(message);
    },
  });
}

