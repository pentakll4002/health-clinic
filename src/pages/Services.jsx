import styled from 'styled-components';
import Spinner from '../ui/Spinner';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useServices } from '../features/services/useServices';
import { createService, deleteService, updateService } from '../features/services/APIServices';
import ServicesTable from '../features/services/ServicesTable';

const LayoutServices = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f5f6f8;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

function Services() {
  const queryClient = useQueryClient();
  const { isLoading, services } = useServices();

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      toast.success('Tạo dịch vụ thành công');
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Tạo dịch vụ thất bại');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateService(id, payload),
    onSuccess: () => {
      toast.success('Cập nhật dịch vụ thành công');
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Cập nhật dịch vụ thất bại');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      toast.success('Xoá dịch vụ thành công');
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Xoá dịch vụ thất bại');
    },
  });

  if (isLoading) return <Spinner />;

  const isSubmitting = createMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading;

  return (
    <LayoutServices>
      <Header>
        <div className='flex flex-col gap-1'>
          <h2 className='text-xl font-bold leading-6 text-grey-900'>Dịch vụ khám</h2>
          <p className='text-sm text-grey-500'>Quản lý danh mục dịch vụ và đơn giá</p>
        </div>
      </Header>

      <ServicesTable
        services={services}
        isSubmitting={isSubmitting}
        onCreate={(payload) => createMutation.mutate(payload)}
        onUpdate={(id, payload) => updateMutation.mutate({ id, payload })}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </LayoutServices>
  );
}

export default Services;
