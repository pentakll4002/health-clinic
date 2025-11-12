<?php

namespace App\Http\Controllers;

use App\Models\PhieuKham;
use App\Models\ToaThuoc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PhieuKhamController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 7);
        $page = $request->get('page', 1);
        $query = PhieuKham::with(['danhSachTiepNhan.benhNhan', 'loaiBenh', 'toaThuoc.thuoc'])
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
            'ID_TiepNhan' => 'required|integer|exists:danh_sach_tiep_nhan,ID_TiepNhan',
            'CaKham' => 'required|string|max:10',
            'TrieuChung' => 'nullable|string|max:255',
            'ID_LoaiBenh' => 'required|integer|exists:loai_benh,ID_LoaiBenh',
            'TienKham' => 'nullable|numeric|min:0',
            'TongTienThuoc' => 'nullable|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $phieuKham = PhieuKham::create($request->all());

            DB::commit();

            return response()->json([
                'message' => 'Phiếu khám được tạo thành công',
                'phieuKham' => $phieuKham->load(['danhSachTiepNhan.benhNhan', 'loaiBenh'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi tạo phiếu khám',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $phieuKham = PhieuKham::with(['danhSachTiepNhan.benhNhan', 'loaiBenh', 'toaThuoc.thuoc.dvt', 'toaThuoc.thuoc.cachDung'])
            ->find($id);
        if (!$phieuKham) {
            return response()->json(['message' => 'Không tìm thấy phiếu khám'], 404);
        }
        return response()->json($phieuKham);
    }

    public function update(Request $request, $id)
    {
        $phieuKham = PhieuKham::find($id);
        if (!$phieuKham) {
            return response()->json(['message' => 'Không tìm thấy phiếu khám'], 404);
        }

        $request->validate([
            'ID_TiepNhan' => 'sometimes|required|integer|exists:danh_sach_tiep_nhan,ID_TiepNhan',
            'CaKham' => 'sometimes|required|string|max:10',
            'TrieuChung' => 'nullable|string|max:255',
            'ID_LoaiBenh' => 'sometimes|required|integer|exists:loai_benh,ID_LoaiBenh',
            'TienKham' => 'nullable|numeric|min:0',
            'TongTienThuoc' => 'nullable|numeric|min:0',
        ]);

        $phieuKham->fill($request->all());
        $phieuKham->save();

        return response()->json([
            'message' => 'Cập nhật thành công',
            'phieuKham' => $phieuKham->load(['danhSachTiepNhan.benhNhan', 'loaiBenh'])
        ]);
    }

    public function destroy($id)
    {
        $phieuKham = PhieuKham::find($id);
        if (!$phieuKham) {
            return response()->json(['message' => 'Không tìm thấy phiếu khám'], 404);
        }
        
        // Soft delete
        $phieuKham->Is_Deleted = true;
        $phieuKham->save();

        return response()->json(['message' => 'Xoá thành công']);
    }
}

