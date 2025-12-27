<?php

namespace App\Http\Controllers;

use App\Models\NhomNguoiDung;
use App\Models\ChucNang;
use App\Models\PhanQuyen;
use Illuminate\Http\Request;

class RolesDataController extends Controller
{
    /**
     * Lấy toàn bộ dữ liệu roles và permissions cho chatbot
     * Endpoint này có thể public hoặc protected tùy nhu cầu
     */
    public function getRolesData()
    {
        // Lấy tất cả roles
        $roles = NhomNguoiDung::orderBy('ID_Nhom')->get();
        
        // Lấy tất cả functions
        $functions = ChucNang::orderBy('ID_ChucNang')->get();
        
        // Lấy tất cả permissions với relationships
        $permissions = PhanQuyen::with(['nhomNguoiDung', 'chucNang'])->get();
        
        // Format data for easier consumption
        $formattedData = [
            'roles' => $roles->map(function ($role) {
                return [
                    'ID_Nhom' => $role->ID_Nhom,
                    'TenNhom' => $role->TenNhom,
                    'MaNhom' => $role->MaNhom,
                ];
            }),
            'functions' => $functions->map(function ($func) {
                return [
                    'ID_ChucNang' => $func->ID_ChucNang,
                    'TenChucNang' => $func->TenChucNang,
                    'TenManHinhTuongUong' => $func->TenManHinhTuongUong,
                ];
            }),
            'permissions' => $permissions->map(function ($perm) {
                return [
                    'ID_Nhom' => $perm->ID_Nhom,
                    'ID_ChucNang' => $perm->ID_ChucNang,
                    'nhom_nguoi_dung' => [
                        'ID_Nhom' => $perm->nhomNguoiDung->ID_Nhom ?? null,
                        'TenNhom' => $perm->nhomNguoiDung->TenNhom ?? null,
                        'MaNhom' => $perm->nhomNguoiDung->MaNhom ?? null,
                    ],
                    'chuc_nang' => [
                        'ID_ChucNang' => $perm->chucNang->ID_ChucNang ?? null,
                        'TenChucNang' => $perm->chucNang->TenChucNang ?? null,
                        'TenManHinhTuongUong' => $perm->chucNang->TenManHinhTuongUong ?? null,
                    ],
                ];
            }),
        ];
        
        return response()->json($formattedData);
    }
}

