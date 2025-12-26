import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDrugImports, createDrugImport, deleteDrugImport } from './APIDrugs';
import toast from 'react-hot-toast';

export function useDrugImports({ page = 1, limit = 10, tu_ngay, den_ngay } = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['drug-imports', page, limit, tu_ngay, den_ngay],
    queryFn: () => getDrugImports({ page, limit, tu_ngay, den_ngay }),
  });

  const createMutation = useMutation({
    mutationFn: createDrugImport,
    onSuccess: () => {
      queryClient.invalidateQueries(['drug-imports']);
      queryClient.invalidateQueries(['drugs']);
      toast.success('Tạo phiếu nhập thuốc thành công');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Lỗi khi tạo phiếu nhập thuốc';
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDrugImport,
    onSuccess: () => {
      queryClient.invalidateQueries(['drug-imports']);
      queryClient.invalidateQueries(['drugs']);
      toast.success('Xóa phiếu nhập thuốc thành công');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Lỗi khi xóa phiếu nhập thuốc';
      toast.error(message);
    },
  });

  return {
    data: query.data?.data || [],
    totalCount: query.data?.totalCount || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createImport: createMutation.mutate,
    deleteImport: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  };
}

