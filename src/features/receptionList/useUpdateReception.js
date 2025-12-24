import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateReception } from './APIReception';

export function useUpdateReception() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateReception(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receptions'] });
      queryClient.invalidateQueries({ queryKey: ['receptionsToday'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cập nhật tiếp nhận thành công');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Cập nhật tiếp nhận thất bại');
    },
  });
}
