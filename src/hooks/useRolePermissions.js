import { useMemo } from 'react';
import { ROUTE_ROLES } from '../constants/permissions';
import { useUser } from './useUser';

export function useRolePermissions() {
  const { user, nhanVien, isLoading } = useUser();

  // Lấy roleCode từ nhiều nguồn khác nhau (hỗ trợ cả snake_case và camelCase)
  const roleCode = useMemo(() => {
    // Debug: Log để kiểm tra
    console.log('🔍 useRolePermissions - Debug:', {
      hasUser: !!user,
      hasNhanVien: !!nhanVien,
      userNhanVien: user?.nhan_vien || user?.nhanVien,
      nhanVienData: nhanVien,
    });
    
    // Ưu tiên lấy từ nhanVien trực tiếp (từ useUser hook)
    if (nhanVien) {
      const nhom = nhanVien.nhomNguoiDung || nhanVien.nhom_nguoi_dung || nhanVien.nhomNguoiDung;
      if (nhom?.MaNhom) {
        console.log('✅ Role từ nhanVien hook:', nhom.MaNhom);
        return nhom.MaNhom;
      }
    }
    
    // Lấy từ user.nhan_vien (snake_case - Laravel trả về)
    const userNhanVien = user?.nhan_vien || user?.nhanVien;
    if (userNhanVien) {
      const nhom = userNhanVien.nhom_nguoi_dung || userNhanVien.nhomNguoiDung || userNhanVien.nhomNguoiDung;
      if (nhom?.MaNhom) {
        console.log('✅ Role từ user.nhan_vien:', nhom.MaNhom);
        return nhom.MaNhom;
      }
      // Nếu có ID_Nhom nhưng không có relationship, thử query trực tiếp
      if (userNhanVien.ID_Nhom && !nhom) {
        console.warn('⚠️ Có ID_Nhom nhưng không có relationship. Cần kiểm tra lại.');
      }
    }
    
    // Nếu là bệnh nhân - kiểm tra có nhomNguoiDung không
    if (user?.benh_nhan || user?.benhNhan) {
      const benhNhan = user.benh_nhan || user.benhNhan;
      const nhom = benhNhan.nhom_nguoi_dung || benhNhan.nhomNguoiDung;
      if (nhom?.MaNhom) {
        console.log('✅ Role từ benhNhan:', nhom.MaNhom);
        return nhom.MaNhom;
      }
      // Fallback về @patient nếu không có nhomNguoiDung
      console.log('✅ Role fallback: @patient');
      return '@patient';
    }
    
    // Nếu role là patient nhưng không có benh_nhan relationship
    if (user?.role === 'patient') {
      console.log('✅ Role từ user.role: @patient');
      return '@patient';
    }
    
    console.warn('❌ Không tìm thấy role code');
    return null;
  }, [user, nhanVien]);

  // Debug: Log để kiểm tra roleCode
  if (!isLoading && roleCode) {
    console.log('🔍 Role Code:', roleCode);
    console.log('👤 User:', user);
    console.log('👨‍💼 Nhan Vien:', nhanVien);
  }

  // Check xem role có được phép truy cập route không
  const canAccessRoute = (route) => {
    if (!roleCode || !route) return false;
    
    // 👑 Admin (@admin) có quyền truy cập TẤT CẢ routes:
    // - Quản lý nhóm người dùng & phân quyền
    // - Thêm/sửa/khóa tài khoản người dùng
    // - Quản lý nhân viên
    // - Cấu hình hệ thống (Quy định, đơn vị tính, cách dùng, loại bệnh)
    // - Xem toàn bộ báo cáo
    // - Tất cả các chức năng khác
    if (roleCode === '@admin') return true;
    
    const allowedRoles = ROUTE_ROLES[route] || [];
    const hasAccess = allowedRoles.includes(roleCode);
    
    // Debug log
    if (!hasAccess && roleCode) {
      console.log(`❌ Role ${roleCode} không có quyền truy cập route: ${route}`);
      console.log(`   Allowed roles:`, allowedRoles);
    }
    
    return hasAccess;
  };

  // Check xem role có được phép truy cập bất kỳ route nào trong danh sách không
  const canAccessAnyRoute = (routes) => {
    if (!routes || routes.length === 0) return false;
    return routes.some((route) => canAccessRoute(route));
  };

  // Check xem role có phải là role cụ thể không
  const isRole = (role) => {
    return roleCode === role;
  };

  // Check xem role có nằm trong danh sách roles không
  const isAnyRole = (roles) => {
    if (!roles || roles.length === 0) return false;
    return roles.includes(roleCode);
  };

  return {
    roleCode,
    isLoading,
    canAccessRoute,
    canAccessAnyRoute,
    isRole,
    isAnyRole,
  };
}

