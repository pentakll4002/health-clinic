<?php

namespace App\Http\Controllers;

use App\Models\NhanVien;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class NhanVienController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'HoTenNV' => 'required|string|max:500',
            'NgaySinh' => 'required|date',
            'GioiTinh' => 'required|string|max:10',
            'CCCD' => 'required|string|max:25|unique:nhan_vien',
            'DienThoai' => 'required|string|max:15|unique:nhan_vien',
            'DiaChi' => 'required|string|max:500',
            'HinhAnh' => 'required|string|max:255',
            'ID_Nhom' => 'required|integer|exists:nhom_nguoi_dung,ID_Nhom',
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'nhan_vien',
            ]);

            $nhanVien = NhanVien::create([
                'HoTenNV' => $request->HoTenNV,
                'NgaySinh' => $request->NgaySinh,
                'GioiTinh' => $request->GioiTinh,
                'CCCD' => $request->CCCD,
                'DienThoai' => $request->DienThoai,
                'DiaChi' => $request->DiaChi,
                'Email' => $request->email,
                'HinhAnh' => $request->HinhAnh,
                'TrangThai' => 'Đang làm việc',
                'ID_Nhom' => $request->ID_Nhom,
                'user_id' => $user->id,
            ]);

            DB::commit();

            return response()->json(['message' => 'Employee created successfully', 'nhan_vien' => $nhanVien], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error creating employee', 'error' => $e->getMessage()], 500);
        }
    }

    public function index(Request $request)
    {
        $limit = $request->get('limit', 7);
        $page = $request->get('page', 1);
        $query = \App\Models\NhanVien::query();

        $totalCount = $query->count();
        $data = $query->offset(($page - 1) * $limit)->limit($limit)->get();

        return response()->json([
            'data' => $data,
            'totalCount' => $totalCount,
        ]);
    }

    public function show($id) {
        $nhanVien = NhanVien::find($id);
        if (!$nhanVien) {
            return response()->json(['message' => 'Không tìm thấy bác sĩ'], 404);
        }
        return response()->json($nhanVien);
    }

    public function update(Request $request, $id) {
        $nhanVien = NhanVien::find($id);
        if (!$nhanVien) {
            return response()->json(['message' => 'Không tìm thấy bác sĩ'], 404);
        }
        // Có thể validate tuỳ ý nếu muốn, ở đây giữ đơn giản
        $nhanVien->fill($request->all());
        $nhanVien->save();
        return response()->json(['message' => 'Cập nhật thành công', 'nhan_vien' => $nhanVien]);
    }

    public function destroy($id) {
        $nhanVien = NhanVien::find($id);
        if (!$nhanVien) {
            return response()->json(['message' => 'Không tìm thấy bác sĩ'], 404);
        }
        $nhanVien->delete();
        return response()->json(['message' => 'Xoá thành công']);
    }
}

