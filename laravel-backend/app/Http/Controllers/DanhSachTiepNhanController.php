<?php

namespace App\Http\Controllers;

use App\Models\DanhSachTiepNhan;
use App\Models\LichKham;
use App\Models\QuiDinh;
use Illuminate\Http\Request;

class DanhSachTiepNhanController extends Controller
{
    /**
     * Kiểm tra số bệnh nhân tối đa trong ngày
     * 
     * Logic: Nếu số bệnh nhân hiện tại < số bệnh nhân tối đa thì cho phép thêm
     * Nếu số bệnh nhân hiện tại >= số bệnh nhân tối đa thì KHÔNG cho phép thêm
     * 
     * @param string $ngayTN Ngày tiếp nhận (format: Y-m-d)
     * @return array ['allowed' => bool, 'current' => int, 'max' => int]
     */
    private function checkSoBenhNhanToiDa($ngayTN)
    {
        // Lấy số bệnh nhân tối đa từ quy định (mặc định 50 nếu chưa có)
        $soBenhNhanToiDa = (int) QuiDinh::getValue('SoBenhNhanToiDa', 50);
        
        // Đếm số tiếp nhận trong ngày (chỉ đếm các bản ghi chưa bị xóa)
        $soBenhNhanHienTai = DanhSachTiepNhan::whereDate('NgayTN', $ngayTN)
            ->where('Is_Deleted', false)
            ->count();
        
        // Cho phép nếu số hiện tại < số tối đa (ví dụ: 1 < 2, 2 < 2 = false)
        return [
            'allowed' => $soBenhNhanHienTai < $soBenhNhanToiDa,
            'current' => $soBenhNhanHienTai,
            'max' => $soBenhNhanToiDa,
        ];
    }

    public function index(Request $request)
    {
        $limit = $request->get('limit', 7);
        $page = $request->get('page', 1);
        $query = DanhSachTiepNhan::with(['benhNhan', 'nhanVien', 'leTanDuyet', 'phieuKhams'])
            ->where('Is_Deleted', false);

        // Filter theo ngày nếu có
        if ($request->has('ngay')) {
            $query->whereDate('NgayTN', $request->ngay);
        }

        if ($request->has('TrangThaiTiepNhan')) {
            $query->where('TrangThaiTiepNhan', $request->TrangThaiTiepNhan);
        }

        // Filter chỉ lấy bệnh nhân chưa khám (cho bác sĩ)
        if ($request->has('chua_kham')) {
            $query->where('TrangThaiTiepNhan', 'CHO_KHAM')
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
            'TrangThaiTiepNhan' => 'nullable|string|in:CHO_XAC_NHAN,CHO_KHAM,DANG_KHAM,DA_KHAM,HUY',
        ]);

        $payload = $request->all();

        $existing = DanhSachTiepNhan::where('ID_BenhNhan', (int) $payload['ID_BenhNhan'])
            ->whereDate('NgayTN', $payload['NgayTN'])
            ->where('CaTN', $payload['CaTN'])
            ->where('Is_Deleted', false)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Bệnh nhân này đã được tiếp nhận trong ngày và ca này.',
                'conflict_type' => 'TIEP_NHAN_DUPLICATE',
                'conflict' => $existing->load(['benhNhan', 'nhanVien', 'leTanDuyet', 'phieuKhams']),
            ], 409);
        }

        // Khi lễ tân duyệt online appointment: chuyển sang CHO_KHAM và lưu đúng lễ tân duyệt
        if (array_key_exists('TrangThaiTiepNhan', $payload) && $payload['TrangThaiTiepNhan'] === 'CHO_KHAM') {
            $user = $request->user();
            $nhanVien = $user ? ($user->nhanVien ?? $user->nhan_vien) : null;
            if ($nhanVien && $nhanVien->ID_NhanVien) {
                $payload['ID_LeTanDuyet'] = $nhanVien->ID_NhanVien;
            }
        }
        if (!array_key_exists('TrangThaiTiepNhan', $payload) || !$payload['TrangThaiTiepNhan']) {
            $payload['TrangThaiTiepNhan'] = 'CHO_KHAM';
        }

        // Kiểm tra số bệnh nhân tối đa trong ngày
        $checkResult = $this->checkSoBenhNhanToiDa($payload['NgayTN']);
        if (!$checkResult['allowed']) {
            return response()->json([
                'message' => "Đã đạt số bệnh nhân tối đa trong ngày ({$checkResult['current']}/{$checkResult['max']}). Không thể thêm bệnh nhân mới.",
            ], 400);
        }

        $tiepNhan = DanhSachTiepNhan::create($payload);

        return response()->json([
            'message' => 'Tiếp nhận được tạo thành công',
            'tiepNhan' => $tiepNhan->load(['benhNhan', 'nhanVien', 'leTanDuyet'])
        ], 201);
    }

    public function show($id)
    {
        $tiepNhan = DanhSachTiepNhan::with(['benhNhan', 'nhanVien', 'leTanDuyet', 'phieuKhams'])->find($id);
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
            'TrangThaiTiepNhan' => 'nullable|string|in:CHO_XAC_NHAN,CHO_KHAM,DANG_KHAM,DA_KHAM,HUY',
        ]);

        $payload = $request->all();

        // Khi lễ tân duyệt online appointment: chuyển sang CHO_KHAM và lưu đúng lễ tân duyệt
        if (array_key_exists('TrangThaiTiepNhan', $payload) && $payload['TrangThaiTiepNhan'] === 'CHO_KHAM') {
            $user = $request->user();
            $nhanVien = $user ? ($user->nhanVien ?? $user->nhan_vien) : null;
            if ($nhanVien && $nhanVien->ID_NhanVien) {
                $payload['ID_LeTanDuyet'] = $nhanVien->ID_NhanVien;
            }
        }

        // Nếu từ chối/huỷ theo Option B: soft delete
        if (array_key_exists('TrangThaiTiepNhan', $payload) && $payload['TrangThaiTiepNhan'] === 'HUY') {
            $tiepNhan->Is_Deleted = true;
        }

        $tiepNhan->fill($payload);
        $tiepNhan->save();

        return response()->json([
            'message' => 'Cập nhật thành công',
            'tiepNhan' => $tiepNhan->load(['benhNhan', 'nhanVien', 'leTanDuyet'])
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
                'message' => 'Bệnh nhân này đã được tiếp nhận trong ngày và ca này.',
                'conflict_type' => 'TIEP_NHAN_DUPLICATE',
                'conflict' => $existingTiepNhan->load(['benhNhan', 'nhanVien', 'leTanDuyet', 'phieuKhams']),
            ], 409);
        }

        // Kiểm tra số bệnh nhân tối đa trong ngày
        $checkResult = $this->checkSoBenhNhanToiDa($lichKham->NgayKhamDuKien);
        if (!$checkResult['allowed']) {
            return response()->json([
                'message' => "Đã đạt số bệnh nhân tối đa trong ngày ({$checkResult['current']}/{$checkResult['max']}). Không thể tiếp nhận thêm bệnh nhân.",
            ], 400);
        }

        // Tạo tiếp nhận từ lịch khám
        $tiepNhan = DanhSachTiepNhan::create([
            'ID_BenhNhan' => $lichKham->ID_BenhNhan,
            'NgayTN' => $lichKham->NgayKhamDuKien,
            'CaTN' => $lichKham->CaKham,
            'ID_NhanVien' => $request->ID_NhanVien,
            'TrangThaiTiepNhan' => 'CHO_KHAM',
            'Is_Deleted' => false,
        ]);

        return response()->json([
            'message' => 'Tiếp nhận bệnh nhân thành công',
            'tiepNhan' => $tiepNhan->load(['benhNhan', 'nhanVien', 'leTanDuyet']),
        ], 201);
    }
}

