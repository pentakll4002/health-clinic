<?php

namespace App\Http\Controllers;

use App\Models\DanhSachTiepNhan;
use Illuminate\Http\Request;

class DanhSachTiepNhanController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 7);
        $page = $request->get('page', 1);
        $query = DanhSachTiepNhan::with(['benhNhan', 'nhanVien'])
            ->where('Is_Deleted', false);

        $totalCount = $query->count();
        $data = $query->offset(($page - 1) * $limit)->limit($limit)->get();

        return response()->json([
            'data' => $data,
            'totalCount' => $totalCount,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ID_BenhNhan' => 'required|integer|exists:benh_nhan,ID_BenhNhan',
            'NgayTN' => 'required|date',
            'CaTN' => 'required|string|max:10',
            'ID_NhanVien' => 'required|integer|exists:nhan_vien,ID_NhanVien',
            'TrangThai' => 'nullable|boolean',
        ]);

        $tiepNhan = DanhSachTiepNhan::create($request->all());

        return response()->json([
            'message' => 'Tiếp nhận được tạo thành công',
            'tiepNhan' => $tiepNhan->load(['benhNhan', 'nhanVien'])
        ], 201);
    }

    public function show($id)
    {
        $tiepNhan = DanhSachTiepNhan::with(['benhNhan', 'nhanVien'])->find($id);
        if (!$tiepNhan) {
            return response()->json(['message' => 'Không tìm thấy tiếp nhận'], 404);
        }
        return response()->json($tiepNhan);
    }

    public function update(Request $request, $id)
    {
        $tiepNhan = DanhSachTiepNhan::find($id);
        if (!$tiepNhan) {
            return response()->json(['message' => 'Không tìm thấy tiếp nhận'], 404);
        }

        $request->validate([
            'ID_BenhNhan' => 'sometimes|required|integer|exists:benh_nhan,ID_BenhNhan',
            'NgayTN' => 'sometimes|required|date',
            'CaTN' => 'sometimes|required|string|max:10',
            'ID_NhanVien' => 'sometimes|required|integer|exists:nhan_vien,ID_NhanVien',
            'TrangThai' => 'nullable|boolean',
        ]);

        $tiepNhan->fill($request->all());
        $tiepNhan->save();

        return response()->json([
            'message' => 'Cập nhật thành công',
            'tiepNhan' => $tiepNhan->load(['benhNhan', 'nhanVien'])
        ]);
    }

    public function destroy($id)
    {
        $tiepNhan = DanhSachTiepNhan::find($id);
        if (!$tiepNhan) {
            return response()->json(['message' => 'Không tìm thấy tiếp nhận'], 404);
        }
        
        // Soft delete
        $tiepNhan->Is_Deleted = true;
        $tiepNhan->save();

        return response()->json(['message' => 'Xoá thành công']);
    }
}

