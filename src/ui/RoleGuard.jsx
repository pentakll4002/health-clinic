import Spinner from './Spinner';
import { useRolePermissions } from '../hooks/useRolePermissions';

function RoleGuard({ route, anyOf, children }) {
  const { isLoading, canAccessRoute, canAccessAnyRoute } = useRolePermissions();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center w-full h-full py-10'>
        <Spinner />
      </div>
    );
  }

  const allowed = route ? canAccessRoute(route) : canAccessAnyRoute(anyOf || []);

  if (!allowed) {
    return (
      <div className='flex flex-col items-center justify-center w-full h-full gap-2 p-10 text-center border border-dashed rounded-lg border-grey-200'>
        <p className='text-lg font-semibold text-grey-600'>Bạn không có quyền truy cập chức năng này.</p>
        <p className='text-sm text-grey-400'>Vui lòng liên hệ quản trị hệ thống nếu bạn cần quyền truy cập.</p>
      </div>
    );
  }

  return children;
}

export default RoleGuard;

