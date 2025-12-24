<?php

namespace App\Helpers;

use App\Models\User;

class RoleHelper
{
    /**
     * Lấy role code của user hiện tại
     */
    public static function getRoleCode($user): ?string
    {
        if (!$user) {
            return null;
        }

        // Load relationships nếu chưa có
        if (!$user->relationLoaded('nhanVien')) {
            $user->load('nhanVien.nhomNguoiDung');
        }
        if (!$user->relationLoaded('benhNhan')) {
            $user->load('benhNhan');
        }

        // Nếu là nhân viên
        if ($user->nhanVien) {
            return $user->nhanVien->nhomNguoiDung?->MaNhom;
        }

        // Nếu là bệnh nhân
        if ($user->benhNhan || $user->role === 'patient') {
            return '@patient';
        }

        return null;
    }

    /**
     * Kiểm tra user có role cụ thể không
     */
    public static function hasRole($user, string|array $roles): bool
    {
        $roleCode = self::getRoleCode($user);
        
        if (!$roleCode) {
            return false;
        }

        // Admin có quyền tất cả
        if ($roleCode === '@admin') {
            return true;
        }

        $roles = is_array($roles) ? $roles : [$roles];
        return in_array($roleCode, $roles, true);
    }

    /**
     * Kiểm tra user có phải là role cụ thể không
     */
    public static function isRole($user, string $role): bool
    {
        return self::getRoleCode($user) === $role;
    }

    /**
     * Kiểm tra bác sĩ có thể tạo phiếu khám không
     */
    public static function canDoctorCreatePhieuKham($user): bool
    {
        return self::hasRole($user, ['@doctors', '@admin']);
    }

    /**
     * Kiểm tra thu ngân có thể lập hóa đơn không
     */
    public static function canCashierCreateHoaDon($user): bool
    {
        return self::hasRole($user, ['@cashiers', '@admin']);
    }

    /**
     * Kiểm tra lễ tân có thể tiếp nhận không
     */
    public static function canReceptionistCreateTiepNhan($user): bool
    {
        return self::hasRole($user, ['@receptionists', '@admin']);
    }

    /**
     * Kiểm tra quản lý kho có thể nhập thuốc không
     */
    public static function canInventoryManageDrugs($user): bool
    {
        return self::hasRole($user, ['@inventory', '@admin']);
    }
}





