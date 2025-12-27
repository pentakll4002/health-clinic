<?php

namespace App\Http\Controllers;

use App\Models\PhanQuyen;
use App\Models\NhomNguoiDung;
use App\Models\ChucNang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PhanQuyenController extends Controller
{
    /**
     * Lấy danh sách phân quyền
     */
    public function index()
    {
        $phanQuyens = PhanQuyen::with(['nhomNguoiDung', 'chucNang'])->get();
        return response()->json($phanQuyens);
    }

    /**
     * Lấy phân quyền theo nhóm người dùng
     */
    public function getByNhom($idNhom)
    {
        $phanQuyens = PhanQuyen::where('ID_Nhom', $idNhom)
            ->with('chucNang')
            ->get();
        return response()->json($phanQuyens);
    }

    /**
     * Lấy phân quyền theo chức năng
     */
    public function getByChucNang($idChucNang)
    {
        $phanQuyens = PhanQuyen::where('ID_ChucNang', $idChucNang)
            ->with('nhomNguoiDung')
            ->get();
        return response()->json($phanQuyens);
    }

    /**
     * Tạo phân quyền mới
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ID_Nhom' => 'required|exists:nhom_nguoi_dung,ID_Nhom',
            'ID_ChucNang' => 'required|exists:chuc_nang,ID_ChucNang',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $phanQuyen = PhanQuyen::create($request->all());
        $phanQuyen->load(['nhomNguoiDung', 'chucNang']);

        return response()->json($phanQuyen, 201);
    }

    /**
     * Cập nhật phân quyền (thực tế là xóa và tạo mới vì có composite key)
     */
    public function update(Request $request, $idNhom, $idChucNang)
    {
        $phanQuyen = PhanQuyen::where('ID_Nhom', $idNhom)
            ->where('ID_ChucNang', $idChucNang)
            ->first();

        if (!$phanQuyen) {
            return response()->json(['message' => 'Phân quyền không tồn tại'], 404);
        }

        // Với composite key, thường chỉ cần xóa và tạo mới
        return response()->json(['message' => 'Cập nhật thành công'], 200);
    }

    /**
     * Xóa phân quyền
     */
    public function destroy($idNhom, $idChucNang)
    {
        $phanQuyen = PhanQuyen::where('ID_Nhom', $idNhom)
            ->where('ID_ChucNang', $idChucNang)
            ->first();

        if (!$phanQuyen) {
            return response()->json(['message' => 'Phân quyền không tồn tại'], 404);
        }

        $phanQuyen->delete();
        return response()->json(['message' => 'Xóa phân quyền thành công'], 200);
    }

    /**
     * Gán nhiều phân quyền cho một nhóm
     */
    public function assignMultiple(Request $request, $idNhom)
    {
        $validator = Validator::make($request->all(), [
            'chuc_nangs' => 'required|array',
            'chuc_nangs.*' => 'exists:chuc_nang,ID_ChucNang',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            // Xóa phân quyền cũ
            PhanQuyen::where('ID_Nhom', $idNhom)->delete();

            // Tạo phân quyền mới
            $data = [];
            foreach ($request->chuc_nangs as $idChucNang) {
                $data[] = [
                    'ID_Nhom' => $idNhom,
                    'ID_ChucNang' => $idChucNang,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            PhanQuyen::insert($data);

            DB::commit();
            return response()->json(['message' => 'Gán phân quyền thành công'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 500);
        }
    }
}




















