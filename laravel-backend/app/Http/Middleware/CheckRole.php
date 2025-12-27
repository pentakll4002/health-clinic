<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Load relationships để lấy role
        $user->load('nhanVien.nhomNguoiDung', 'benhNhan');
        
        // Lấy role code
        $roleCode = null;
        
        // Nếu là nhân viên
        if ($user->nhanVien) {
            $roleCode = $user->nhanVien->nhomNguoiDung?->MaNhom;
        }
        // Nếu là bệnh nhân
        elseif ($user->benhNhan || $user->role === 'patient') {
            $roleCode = '@patient';
        }
        
        // Admin có quyền truy cập tất cả
        if ($roleCode === '@admin') {
            return $next($request);
        }
        
        // Kiểm tra role có trong danh sách được phép không
        if (!in_array($roleCode, $roles, true)) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập chức năng này',
                'required_roles' => $roles,
                'your_role' => $roleCode,
            ], 403);
        }

        return $next($request);
    }
}














