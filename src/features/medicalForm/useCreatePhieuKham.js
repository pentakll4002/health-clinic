import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPhieuKham } from './API_PhieuKham';
import toast from 'react-hot-toast';

export function useCreatePhieuKham() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPhieuKham,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receptions'] });
      queryClient.invalidateQueries({ queryKey: ['receptionsToday'] });
      queryClient.invalidateQueries({ queryKey: ['phieukham'] });
      toast.success('Tạo phiếu khám thành công!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Tạo phiếu khám thất bại';
      toast.error(message);
    },
  });
}










