import { useMemo } from 'react';
import { ROUTE_PERMISSIONS, ROUTE_ROLES } from '../constants/permissions';
import { useUser } from './useUser';
import { useMyPermissions } from './useMyPermissions';

export function useRolePermissions() {
  const { user, nhanVien, isLoading } = useUser();
  const { data: myPermData, isLoading: isPermLoading } = useMyPermissions();

  const roleCode = useMemo(() => {
    console.log('🔍 useRolePermissions - Debug:', {
      hasUser: !!user,
      hasNhanVien: !!nhanVien,
      userNhanVien: user?.nhan_vien || user?.nhanVien,
      nhanVienData: nhanVien,
    });
    
    if (nhanVien) {
      const nhom = nhanVien.nhomNguoiDung || nhanVien.nhom_nguoi_dung || nhanVien.nhomNguoiDung;
      if (nhom?.MaNhom) {
        const code = nhom.MaNhom.startsWith('@') ? nhom.MaNhom : `@${nhom.MaNhom}`;
        console.log('Role từ nhanVien hook:', code);
        return code;
      }
    }
    
    const userNhanVien = user?.nhan_vien || user?.nhanVien;
    if (userNhanVien) {
      const nhom = userNhanVien.nhom_nguoi_dung || userNhanVien.nhomNguoiDung || userNhanVien.nhomNguoiDung;
      if (nhom?.MaNhom) {
        const code = nhom.MaNhom.startsWith('@') ? nhom.MaNhom : `@${nhom.MaNhom}`;
        console.log('Role từ user.nhan_vien:', code);
        return code;
      }
      if (userNhanVien.ID_Nhom && !nhom) {
        console.warn('Có ID_Nhom nhưng không có relationship. Cần kiểm tra lại.');
      }
    }
    
    if (user?.benh_nhan || user?.benhNhan) {
      const benhNhan = user.benh_nhan || user.benhNhan;
      const nhom = benhNhan.nhom_nguoi_dung || benhNhan.nhomNguoiDung;
      if (nhom?.MaNhom) {
        const code = nhom.MaNhom.startsWith('@') ? nhom.MaNhom : `@${nhom.MaNhom}`;
        console.log('Role từ benhNhan:', code);
        return code;
      }
      console.log('Role fallback: @patient');
      return '@patient';
    }
    
    if (user?.role === 'patient') {
      console.log('Role từ user.role: @patient');
      return '@patient';
    }
    
    console.warn('Không tìm thấy role code');
    return null;
  }, [user, nhanVien]);

  if (!isLoading && roleCode) {
    console.log('Role Code:', roleCode);
    console.log('User:', user);
    console.log('Nhan Vien:', nhanVien);
  }

  const canAccessRoute = (route) => {
    if (!roleCode || !route) return false;
    
    if (roleCode === '@admin') return true;

    const perms = myPermData?.permissions;
    const requiredPermission = ROUTE_PERMISSIONS[route];
    if (Array.isArray(perms) && requiredPermission) {
      return perms.includes(requiredPermission);
    }
    
    const allowedRoles = ROUTE_ROLES[route] || [];
    const hasAccess = allowedRoles.includes(roleCode);
    
    if (!hasAccess && roleCode) {
      console.log(`❌ Role ${roleCode} không có quyền truy cập route: ${route}`);
      console.log(`   Allowed roles:`, allowedRoles);
    }
    
    return hasAccess;
  };

  const canAccessAnyRoute = (routes) => {
    if (!routes || routes.length === 0) return false;
    return routes.some((route) => canAccessRoute(route));
  };

  const isRole = (role) => {
    return roleCode === role;
  };

  const isAnyRole = (roles) => {
    if (!roles || roles.length === 0) return false;
    return roles.includes(roleCode);
  };

  return {
    roleCode,
    isLoading: isLoading || isPermLoading,
    canAccessRoute,
    canAccessAnyRoute,
    isRole,
    isAnyRole,
  };
}

