<?php

namespace App\Http\Controllers;

use App\Models\DanhSachTiepNhan;
use App\Models\LichKham;
use Illuminate\Http\Request;

class DanhSachTiepNhanController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 7);
        $page = $request->get('page', 1);
        $query = DanhSachTiepNhan::with(['benhNhan', 'nhanVien', 'phieuKhams'])
            ->where('Is_Deleted', false);

        // Filter theo ngày nếu có
        if ($request->has('ngay')) {
            $query->whereDate('NgayTN', $request->ngay);
        }

        // Filter theo trạng thái nếu có (0 = Chưa khám, 1 = Đã khám)
        if ($request->has('TrangThai')) {
            $query->where('TrangThai', $request->TrangThai);
        }

        // Filter chỉ lấy bệnh nhân chưa khám (cho bác sĩ)
        if ($request->has('chua_kham')) {
            $query->where('TrangThai', false)
                  ->whereDoesntHave('phieuKhams', function($q) {
                      $q->where('Is_Deleted', false);
                  });
        }

        $totalCount = $query->count();
        $data = $query->orderBy('NgayTN', 'desc')
                      ->orderBy('CaTN', 'asc')
                      ->offset(($page - 1) * $limit)
                      ->limit($limit)
                      ->get();

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

    /**
     * Tạo tiếp nhận từ lịch khám đã xác nhận
     */
    public function createFromLichKham(Request $request)
    {
        $request->validate([
            'ID_LichKham' => 'required|integer|exists:lich_kham,ID_LichKham',
            'ID_NhanVien' => 'required|integer|exists:nhan_vien,ID_NhanVien',
        ]);

        $lichKham = LichKham::with('benhNhan')->find($request->ID_LichKham);
        
        if (!$lichKham) {
            return response()->json(['message' => 'Không tìm thấy lịch khám'], 404);
        }

        // Chỉ cho phép tiếp nhận từ lịch khám đã xác nhận
        if ($lichKham->TrangThai !== 'DaXacNhan') {
            return response()->json([
                'message' => 'Chỉ có thể tiếp nhận từ lịch khám đã được xác nhận',
            ], 400);
        }

        // Kiểm tra xem đã có tiếp nhận cho lịch khám này chưa (tránh trùng lặp)
        $existingTiepNhan = DanhSachTiepNhan::where('ID_BenhNhan', $lichKham->ID_BenhNhan)
            ->whereDate('NgayTN', $lichKham->NgayKhamDuKien)
            ->where('CaTN', $lichKham->CaKham)
            ->where('Is_Deleted', false)
            ->first();

        if ($existingTiepNhan) {
            return response()->json([
                'message' => 'Bệnh nhân này đã được tiếp nhận trong ngày này',
                'tiepNhan' => $existingTiepNhan->load(['benhNhan', 'nhanVien']),
            ], 400);
        }

        // Tạo tiếp nhận từ lịch khám
        $tiepNhan = DanhSachTiepNhan::create([
            'ID_BenhNhan' => $lichKham->ID_BenhNhan,
            'NgayTN' => $lichKham->NgayKhamDuKien,
            'CaTN' => $lichKham->CaKham,
            'ID_NhanVien' => $request->ID_NhanVien,
            'TrangThai' => false, // Chưa khám
            'Is_Deleted' => false,
        ]);

        return response()->json([
            'message' => 'Tiếp nhận bệnh nhân thành công',
            'tiepNhan' => $tiepNhan->load(['benhNhan', 'nhanVien']),
        ], 201);
    }
}

