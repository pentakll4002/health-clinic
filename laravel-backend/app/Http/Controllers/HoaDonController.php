<?php

namespace App\Http\Controllers;

use App\Models\HoaDon;
use App\Models\PhieuKham;
use App\Models\QuiDinh;
use App\Helpers\RoleHelper;
use Illuminate\Http\Request;

class HoaDonController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!RoleHelper::canCashierCreateHoaDon($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập danh sách hoá đơn.',
            ], 403);
        }

        $limit = $request->get('limit', 7);
        $page = $request->get('page', 1);

        $query = HoaDon::with(['nhanVien', 'phieuKham.tiepNhan.benhNhan'])
            ->orderByDesc('ID_HoaDon');

        $totalCount = $query->count();
        $data = $query->offset(($page - 1) * $limit)->limit($limit)->get();

        return response()->json([
            'data' => $data,
            'totalCount' => $totalCount,
        ]);
    }

    public function preview($phieuKhamId)
    {
        $phieuKham = PhieuKham::with(['toaThuoc', 'hoaDon', 'dichVu', 'ctDichVuPhu.dichVu'])->find($phieuKhamId);
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Phiếu khám không hợp lệ'], 404);
        }

        if (!$phieuKham->ID_DichVu) {
            return response()->json([
                'message' => 'Chưa chọn dịch vụ khám. Vui lòng yêu cầu bác sĩ chọn dịch vụ trước khi lập hoá đơn.',
            ], 400);
        }

        if (($phieuKham->TrangThai ?? null) !== 'DaKham') {
            return response()->json([
                'message' => 'Chỉ được lập hoá đơn khi phiếu khám đã hoàn tất (Đã khám).',
            ], 400);
        }

        if ($phieuKham->hoaDon) {
            return response()->json(['message' => 'Phiếu khám này đã được lập hoá đơn'], 409);
        }

        $tienKhamSnapshot = (float) ($phieuKham->TienKham ?? 0);
        if ($tienKhamSnapshot > 0) {
            $tienKham = $tienKhamSnapshot;
        } else {
            $tienKham = (float) QuiDinh::getValue('TienKham', 0);
        }

        $tienThuoc = $phieuKham->toaThuoc->sum(function ($item) {
            return (float) $item->TienThuoc;
        });
        if ($tienThuoc <= 0 && $phieuKham->TongTienThuoc !== null) {
            $tienThuoc = (float) $phieuKham->TongTienThuoc;
        }

        $tienDichVu = (float) $phieuKham->ctDichVuPhu->sum(function ($item) {
            return (float) $item->ThanhTien;
        });

        return response()->json([
            'DichVu' => $phieuKham->dichVu,
            'DichVuPhu' => $phieuKham->ctDichVuPhu,
            'TienKham' => $tienKham,
            'TienThuoc' => $tienThuoc,
            'TienDichVu' => $tienDichVu,
            'TongTien' => $tienKham + $tienThuoc + $tienDichVu,
        ]);
    }

    public function show($id)
    {
        $user = request()->user();
        if (!RoleHelper::canCashierCreateHoaDon($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền xem hoá đơn.',
            ], 403);
        }

        $hoaDon = HoaDon::with([
            'nhanVien',
            'phieuKham.tiepNhan.benhNhan',
            'phieuKham.dichVu',
            'phieuKham.toaThuoc.thuoc',
            'phieuKham.ctDichVuPhu.dichVu',
        ])->find($id);
        if (!$hoaDon) {
            return response()->json(['message' => 'Không tìm thấy hoá đơn'], 404);
        }
        return response()->json($hoaDon);
    }

    public function store(Request $request)
    {
        // Kiểm tra quyền: Chỉ thu ngân và admin được lập hóa đơn
        $user = $request->user();
        if (!RoleHelper::canCashierCreateHoaDon($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền lập hóa đơn. Chỉ thu ngân mới được phép thực hiện chức năng này.',
            ], 403);
        }

        $validated = $request->validate([
            'ID_PhieuKham' => 'required|integer|exists:phieu_kham,ID_PhieuKham',
            'NgayHoaDon' => 'sometimes|date',
        ]);

        $phieuKham = PhieuKham::with(['toaThuoc', 'hoaDon', 'dichVu', 'ctDichVuPhu'])->find($validated['ID_PhieuKham']);
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Phiếu khám không hợp lệ'], 422);
        }

        if (!$phieuKham->ID_DichVu) {
            return response()->json([
                'message' => 'Không thể lập hoá đơn vì phiếu khám chưa chọn dịch vụ khám.',
            ], 400);
        }

        if (($phieuKham->TrangThai ?? null) !== 'DaKham') {
            return response()->json([
                'message' => 'Chỉ được lập hoá đơn khi phiếu khám đã hoàn tất (Đã khám).',
            ], 400);
        }

        if ($phieuKham->hoaDon) {
            return response()->json(['message' => 'Phiếu khám này đã được lập hoá đơn'], 409);
        }

        // Nhân viên lập hoá đơn lấy từ user đăng nhập (không cho client tuỳ ý truyền)
        $nhanVien = $user->nhanVien ?? $user->nhan_vien;
        if (!$nhanVien || !$nhanVien->ID_NhanVien) {
            return response()->json([
                'message' => 'Không tìm thấy thông tin nhân viên lập hoá đơn. Vui lòng đăng nhập lại.',
            ], 400);
        }

        $tienKhamSnapshot = (float) ($phieuKham->TienKham ?? 0);
        if ($tienKhamSnapshot > 0) {
            $tienKham = $tienKhamSnapshot;
        } else {
            $tienKham = (float) QuiDinh::getValue('TienKham', 0);
        }

        $tienThuoc = $phieuKham->toaThuoc->sum(function ($item) {
            return (float) $item->TienThuoc;
        });

        if ($tienThuoc <= 0 && $phieuKham->TongTienThuoc !== null) {
            $tienThuoc = (float) $phieuKham->TongTienThuoc;
        }

        $tienDichVu = (float) $phieuKham->ctDichVuPhu->sum(function ($item) {
            return (float) $item->ThanhTien;
        });

        $payload = [
            'ID_PhieuKham' => $validated['ID_PhieuKham'],
            'ID_NhanVien' => $nhanVien->ID_NhanVien,
            'NgayHoaDon' => $validated['NgayHoaDon'] ?? now()->toDateString(),
            'TienKham' => $tienKham,
            'TienThuoc' => $tienThuoc,
            'TienDichVu' => $tienDichVu,
            'TongTien' => $tienKham + $tienThuoc + $tienDichVu,
        ];

        $hoaDon = HoaDon::create($payload);

        return response()->json([
            'message' => 'Tạo hoá đơn thành công',
            'hoa_don' => $hoaDon->load(['nhanVien', 'phieuKham'])
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $hoaDon = HoaDon::find($id);
        if (!$hoaDon) {
            return response()->json(['message' => 'Không tìm thấy hoá đơn'], 404);
        }

        // Kiểm tra quyền: Chỉ thu ngân/lễ tân/admin được cập nhật thông tin hoá đơn
        $user = $request->user();
        if (!RoleHelper::canCashierCreateHoaDon($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền cập nhật hoá đơn.',
            ], 403);
        }

        $validated = $request->validate([
            'NgayHoaDon' => 'sometimes|date',
            // Không cho phép sửa các khoản tiền vì hệ thống tự tính
        ]);

        $payload = [
            'NgayHoaDon' => $validated['NgayHoaDon'] ?? $hoaDon->NgayHoaDon,
        ];

        $payload['TongTien'] = (float) ($hoaDon->TienKham ?? 0)
            + (float) ($hoaDon->TienThuoc ?? 0)
            + (float) ($hoaDon->TienDichVu ?? 0);

        $hoaDon->fill($payload);
        $hoaDon->save();

        return response()->json([
            'message' => 'Cập nhật hoá đơn thành công',
            'hoa_don' => $hoaDon->load(['nhanVien', 'phieuKham'])
        ]);
    }

    public function destroy($id)
    {
        $user = request()->user();
        if (!RoleHelper::canCashierCreateHoaDon($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền xoá hoá đơn.',
            ], 403);
        }

        $hoaDon = HoaDon::find($id);
        if (!$hoaDon) {
            return response()->json(['message' => 'Không tìm thấy hoá đơn'], 404);
        }

        $hoaDon->delete();
        return response()->json(['message' => 'Xoá hoá đơn thành công']);
    }
}


