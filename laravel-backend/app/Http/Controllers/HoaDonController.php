<?php

namespace App\Http\Controllers;

use App\Models\HoaDon;
use Illuminate\Http\Request;

class HoaDonController extends Controller
{
    public function index(Request $request)
{
    $limit = $request->get('limit', 7);
    $page  = $request->get('page', 1);

    $dateFrom = $request->get('date_from');
    $dateTo   = $request->get('date_to');

    $query = HoaDon::with(['nhanVien', 'phieuKham'])
        ->when($dateFrom, function ($q) use ($dateFrom) {
            $q->whereDate('NgayHoaDon', '>=', $dateFrom);
        })
        ->when($dateTo, function ($q) use ($dateTo) {
            $q->whereDate('NgayHoaDon', '<=', $dateTo);
        })
        ->orderByDesc('ID_HoaDon');

    $totalCount = $query->count();

    $data = $query
        ->offset(($page - 1) * $limit)
        ->limit($limit)
        ->get();

    return response()->json([
        'data' => $data,
        'totalCount' => $totalCount,
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
        $request->validate([
            'ID_PhieuKham' => 'required|integer|exists:phieu_kham,ID_PhieuKham',
            'ID_NhanVien' => 'required|integer|exists:nhan_vien,ID_NhanVien',
            'NgayHoaDon' => 'required|date',
            'TienKham' => 'nullable|numeric|min:0',
            'TienThuoc' => 'nullable|numeric|min:0',
            'TongTien' => 'nullable|numeric|min:0',
        ]);

        $payload = $request->all();
        if (!isset($payload['TongTien'])) {
            $payload['TongTien'] = (float) ($payload['TienKham'] ?? 0) + (float) ($payload['TienThuoc'] ?? 0);
        }

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

        $request->validate([
            'ID_PhieuKham' => 'sometimes|required|integer|exists:phieu_kham,ID_PhieuKham',
            'ID_NhanVien' => 'sometimes|required|integer|exists:nhan_vien,ID_NhanVien',
            'NgayHoaDon' => 'sometimes|required|date',
            'TienKham' => 'nullable|numeric|min:0',
            'TienThuoc' => 'nullable|numeric|min:0',
            'TongTien' => 'nullable|numeric|min:0',
        ]);

        $payload = $request->all();
        if (!isset($payload['TongTien'])) {
            $payload['TongTien'] = (float) ($payload['TienKham'] ?? $hoaDon->TienKham ?? 0)
                + (float) ($payload['TienThuoc'] ?? $hoaDon->TienThuoc ?? 0);
        }

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


