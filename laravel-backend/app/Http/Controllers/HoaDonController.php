<?php

namespace App\Http\Controllers;

use App\Models\HoaDon;
use App\Models\NhanVien;
use App\Models\PhieuKham;
use App\Models\QuiDinh;
use App\Helpers\RoleHelper;
use Illuminate\Http\Request;

class HoaDonController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 7);
        $page = $request->get('page', 1);

        $query = HoaDon::with(['nhanVien', 'phieuKham']);

        $totalCount = $query->count();
        $data = $query->offset(($page - 1) * $limit)->limit($limit)->get();

        return response()->json([
            'data' => $data,
            'totalCount' => $totalCount,
        ]);
    }

    public function preview($phieuKhamId)
    {
        $phieuKham = PhieuKham::with(['toaThuoc', 'hoaDon'])->find($phieuKhamId);
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Phiếu khám không hợp lệ'], 404);
        }

        if ($phieuKham->hoaDon) {
            return response()->json(['message' => 'Phiếu khám này đã được lập hoá đơn'], 409);
        }

        $tienKhamTheoQuyDinh = QuiDinh::getValue('TienKham', 0);
        $tienKham = $tienKhamTheoQuyDinh > 0 ? $tienKhamTheoQuyDinh : ($phieuKham->TienKham ?? 0);

        $tienThuoc = $phieuKham->toaThuoc->sum(function ($item) {
            return (float) $item->TienThuoc;
        });
        if ($tienThuoc <= 0 && $phieuKham->TongTienThuoc !== null) {
            $tienThuoc = (float) $phieuKham->TongTienThuoc;
        }

        return response()->json([
            'TienKham' => $tienKham,
            'TienThuoc' => $tienThuoc,
            'TongTien' => $tienKham + $tienThuoc,
        ]);
    }

    public function show($id)
    {
        $hoaDon = HoaDon::with(['nhanVien', 'phieuKham'])->find($id);
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
            'ID_NhanVien' => 'required|integer|exists:nhan_vien,ID_NhanVien',
            'NgayHoaDon' => 'sometimes|date',
        ]);

        $phieuKham = PhieuKham::with(['toaThuoc', 'hoaDon'])->find($validated['ID_PhieuKham']);
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Phiếu khám không hợp lệ'], 422);
        }

        if ($phieuKham->hoaDon) {
            return response()->json(['message' => 'Phiếu khám này đã được lập hoá đơn'], 409);
        }

        $nhanVien = NhanVien::with('nhomNguoiDung')->find($validated['ID_NhanVien']);
        if (!$nhanVien) {
            return response()->json(['message' => 'Nhân viên không tồn tại'], 404);
        }

        $allowedRoles = ['@cashiers', '@admin'];
        if (
            !$nhanVien->nhomNguoiDung
            || !in_array($nhanVien->nhomNguoiDung->MaNhom, $allowedRoles, true)
        ) {
            return response()->json(['message' => 'Nhân viên không có quyền lập hoá đơn'], 403);
        }

        $tienKhamTheoQuyDinh = QuiDinh::getValue('TienKham', 0);
        $tienKham = $tienKhamTheoQuyDinh > 0 ? $tienKhamTheoQuyDinh : ($phieuKham->TienKham ?? 0);

        $tienThuoc = $phieuKham->toaThuoc->sum(function ($item) {
            return (float) $item->TienThuoc;
        });

        if ($tienThuoc <= 0 && $phieuKham->TongTienThuoc !== null) {
            $tienThuoc = (float) $phieuKham->TongTienThuoc;
        }

        $payload = [
            'ID_PhieuKham' => $validated['ID_PhieuKham'],
            'ID_NhanVien' => $validated['ID_NhanVien'],
            'NgayHoaDon' => $validated['NgayHoaDon'] ?? now()->toDateString(),
            'TienKham' => $tienKham,
            'TienThuoc' => $tienThuoc,
            'TongTien' => $tienKham + $tienThuoc,
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

        $validated = $request->validate([
            'NgayHoaDon' => 'sometimes|date',
            'TienKham' => 'sometimes|numeric|min:0',
            'TienThuoc' => 'sometimes|numeric|min:0',
        ]);

        $payload = [
            'NgayHoaDon' => $validated['NgayHoaDon'] ?? $hoaDon->NgayHoaDon,
        ];

        $tienKham = array_key_exists('TienKham', $validated) ? (float) $validated['TienKham'] : (float) $hoaDon->TienKham;
        $tienThuoc = array_key_exists('TienThuoc', $validated) ? (float) $validated['TienThuoc'] : (float) $hoaDon->TienThuoc;

        $payload['TienKham'] = $tienKham;
        $payload['TienThuoc'] = $tienThuoc;
        $payload['TongTien'] = $tienKham + $tienThuoc;

        $hoaDon->fill($payload);
        $hoaDon->save();

        return response()->json([
            'message' => 'Cập nhật hoá đơn thành công',
            'hoa_don' => $hoaDon->load(['nhanVien', 'phieuKham'])
        ]);
    }

    public function destroy($id)
    {
        $hoaDon = HoaDon::find($id);
        if (!$hoaDon) {
            return response()->json(['message' => 'Không tìm thấy hoá đơn'], 404);
        }

        $hoaDon->delete();
        return response()->json(['message' => 'Xoá hoá đơn thành công']);
    }
}


