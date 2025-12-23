<?php

namespace App\Http\Controllers;

use App\Models\LichKham;
use App\Models\BenhNhan;
use App\Models\DanhSachTiepNhan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LichKhamController extends Controller
{
    /**
     * Lấy danh sách lịch khám của bệnh nhân hiện tại (cho bệnh nhân)
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $benhNhan = $user->benhNhan;

        if (!$benhNhan) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ bệnh nhân'], 404);
        }

        $query = LichKham::where('ID_BenhNhan', $benhNhan->ID_BenhNhan)
            ->where('Is_Deleted', false)
            ->with('benhNhan')
            ->orderBy('NgayKhamDuKien', 'desc')
            ->orderBy('created_at', 'desc');

        if ($request->has('TrangThai')) {
            $query->where('TrangThai', $request->TrangThai);
        }

        $lichKhams = $query->get();

        return response()->json([
            'data' => $lichKhams,
            'totalCount' => $lichKhams->count(),
        ]);
    }

    /**
     * Lấy tất cả lịch khám (cho admin/lễ tân)
     */
    public function getAll(Request $request)
    {
        $query = LichKham::where('Is_Deleted', false)
            ->with('benhNhan')
            ->orderBy('NgayKhamDuKien', 'desc')
            ->orderBy('created_at', 'desc');

        // Filter theo trạng thái
        if ($request->has('TrangThai')) {
            $query->where('TrangThai', $request->TrangThai);
        }

        // Filter theo ngày
        if ($request->has('NgayKhamDuKien')) {
            $query->whereDate('NgayKhamDuKien', $request->NgayKhamDuKien);
        }

        $limit = $request->get('limit', 100);
        $page = $request->get('page', 1);
        $totalCount = $query->count();
        $data = $query->offset(($page - 1) * $limit)->limit($limit)->get();

        return response()->json([
            'data' => $data,
            'totalCount' => $totalCount,
        ]);
    }

    /**
     * Tạo lịch khám mới (bệnh nhân đặt lịch)
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $benhNhan = $user->benhNhan;

        if (!$benhNhan) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ bệnh nhân'], 404);
        }

        $validator = Validator::make($request->all(), [
            'NgayKhamDuKien' => 'required|date|after_or_equal:today',
            'CaKham' => 'required|string|in:Sáng,Chiều,Tối',
            'GhiChu' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $lichKham = LichKham::create([
            'ID_BenhNhan' => $benhNhan->ID_BenhNhan,
            'NgayKhamDuKien' => $request->NgayKhamDuKien,
            'CaKham' => $request->CaKham,
            'TrangThai' => 'ChoXacNhan',
            'GhiChu' => $request->GhiChu,
            'Is_Deleted' => false,
        ]);

        $lichKham->load('benhNhan');

        return response()->json([
            'message' => 'Đặt lịch khám thành công',
            'data' => $lichKham,
        ], 201);
    }

    /**
     * Xem chi tiết lịch khám
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $benhNhan = $user->benhNhan;

        $lichKham = LichKham::with('benhNhan')->find($id);

        if (!$lichKham) {
            return response()->json(['message' => 'Không tìm thấy lịch khám'], 404);
        }

        // Bệnh nhân chỉ xem được lịch khám của mình
        if ($benhNhan && $lichKham->ID_BenhNhan !== $benhNhan->ID_BenhNhan) {
            return response()->json(['message' => 'Không có quyền truy cập'], 403);
        }

        return response()->json($lichKham);
    }

    /**
     * Hủy lịch khám (chỉ bệnh nhân, chỉ khi chưa xác nhận)
     */
    public function cancel(Request $request, $id)
    {
        $user = $request->user();
        $benhNhan = $user->benhNhan;

        if (!$benhNhan) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ bệnh nhân'], 404);
        }

        $lichKham = LichKham::find($id);

        if (!$lichKham) {
            return response()->json(['message' => 'Không tìm thấy lịch khám'], 404);
        }

        if ($lichKham->ID_BenhNhan !== $benhNhan->ID_BenhNhan) {
            return response()->json(['message' => 'Không có quyền hủy lịch khám này'], 403);
        }

        if ($lichKham->TrangThai !== 'ChoXacNhan') {
            return response()->json(['message' => 'Chỉ có thể hủy lịch khám chưa xác nhận'], 400);
        }

        $lichKham->TrangThai = 'Huy';
        $lichKham->save();

        return response()->json([
            'message' => 'Hủy lịch khám thành công',
            'data' => $lichKham,
        ]);
    }

    /**
     * Cập nhật lịch khám (cho lễ tân/admin)
     */
    public function update(Request $request, $id)
    {
        $lichKham = LichKham::with('benhNhan')->find($id);

        if (!$lichKham) {
            return response()->json(['message' => 'Không tìm thấy lịch khám'], 404);
        }

        $validator = Validator::make($request->all(), [
            'NgayKhamDuKien' => 'sometimes|required|date|after_or_equal:today',
            'CaKham' => 'sometimes|required|string|in:Sáng,Chiều,Tối',
            'TrangThai' => 'sometimes|required|string|in:ChoXacNhan,DaXacNhan,Huy',
            'GhiChu' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $lichKham->fill($request->only(['NgayKhamDuKien', 'CaKham', 'TrangThai', 'GhiChu']));
        $lichKham->save();
        $lichKham->load('benhNhan');

        return response()->json([
            'message' => 'Cập nhật lịch khám thành công',
            'data' => $lichKham,
        ]);
    }

    /**
     * Xác nhận lịch khám (cho lễ tân/admin)
     * Tự động tạo record trong DANHSACHTIEPNHAN khi xác nhận
     */
    public function confirm(Request $request, $id)
    {
        $lichKham = LichKham::with('benhNhan')->find($id);

        if (!$lichKham) {
            return response()->json(['message' => 'Không tìm thấy lịch khám'], 404);
        }

        if ($lichKham->TrangThai !== 'ChoXacNhan') {
            return response()->json(['message' => 'Lịch khám này không thể xác nhận'], 400);
        }

        // Lấy thông tin nhân viên từ request (lễ tân đang xác nhận)
        $user = $request->user();
        $nhanVien = $user->nhanVien ?? $user->nhan_vien;

        if (!$nhanVien || !$nhanVien->ID_NhanVien) {
            return response()->json([
                'message' => 'Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại.',
            ], 400);
        }

        // Kiểm tra xem đã có tiếp nhận cho lịch khám này chưa (tránh trùng lặp)
        $existingTiepNhan = DanhSachTiepNhan::where('ID_BenhNhan', $lichKham->ID_BenhNhan)
            ->whereDate('NgayTN', $lichKham->NgayKhamDuKien)
            ->where('CaTN', $lichKham->CaKham)
            ->where('Is_Deleted', false)
            ->first();

        if ($existingTiepNhan) {
            // Nếu đã có tiếp nhận, chỉ cập nhật trạng thái lịch khám
            $lichKham->TrangThai = 'DaXacNhan';
            $lichKham->save();
            $lichKham->load('benhNhan');

            return response()->json([
                'message' => 'Lịch khám đã được xác nhận. Bệnh nhân đã có trong danh sách tiếp nhận.',
                'data' => $lichKham,
            ]);
        }

        // Tự động tạo record trong DANHSACHTIEPNHAN
        // TrangThai = 0 (Chưa khám) để bác sĩ có thể lập phiếu khám
        $tiepNhan = DanhSachTiepNhan::create([
            'ID_BenhNhan' => $lichKham->ID_BenhNhan,
            'NgayTN' => $lichKham->NgayKhamDuKien, // Sử dụng ngày khám dự kiến
            'CaTN' => $lichKham->CaKham,
            'ID_NhanVien' => $nhanVien->ID_NhanVien,
            'TrangThai' => false, // 0 = Chưa khám (để bác sĩ có thể lập phiếu khám)
            'Is_Deleted' => false,
        ]);

        // Cập nhật trạng thái lịch khám thành Đã xác nhận
        $lichKham->TrangThai = 'DaXacNhan';
        $lichKham->save();
        $lichKham->load('benhNhan');

        return response()->json([
            'message' => 'Xác nhận lịch khám thành công. Bệnh nhân đã được thêm vào danh sách tiếp nhận.',
            'data' => $lichKham,
            'tiepNhan' => $tiepNhan->load(['benhNhan', 'nhanVien']),
        ]);
    }

    /**
     * Xóa lịch khám (soft delete)
     */
    public function destroy($id)
    {
        $lichKham = LichKham::find($id);

        if (!$lichKham) {
            return response()->json(['message' => 'Không tìm thấy lịch khám'], 404);
        }

        $lichKham->Is_Deleted = true;
        $lichKham->save();

        return response()->json(['message' => 'Xóa lịch khám thành công']);
    }
}

