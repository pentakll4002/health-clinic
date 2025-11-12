<?php

namespace App\Http\Controllers;

use App\Models\ToaThuoc;
use App\Models\PhieuKham;
use App\Models\Thuoc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ToaThuocController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'ID_PhieuKham' => 'required|integer|exists:phieu_kham,ID_PhieuKham',
            'ID_Thuoc' => 'required|integer|exists:thuoc,ID_Thuoc',
            'SoLuong' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            $thuoc = Thuoc::find($request->ID_Thuoc);
            if (!$thuoc) {
                return response()->json(['message' => 'Không tìm thấy thuốc'], 404);
            }

            // Kiểm tra số lượng tồn
            if ($thuoc->SoLuongTon < $request->SoLuong) {
                return response()->json([
                    'message' => 'Số lượng thuốc không đủ. Số lượng tồn: ' . $thuoc->SoLuongTon
                ], 400);
            }

            $donGiaBan = $thuoc->DonGiaBan ?? 0;
            $tienThuoc = $donGiaBan * $request->SoLuong;

            $toaThuoc = ToaThuoc::create([
                'ID_PhieuKham' => $request->ID_PhieuKham,
                'ID_Thuoc' => $request->ID_Thuoc,
                'SoLuong' => $request->SoLuong,
                'DonGiaBan_LuocMua' => $donGiaBan,
                'TienThuoc' => $tienThuoc,
            ]);

            // Cập nhật số lượng tồn
            $thuoc->SoLuongTon -= $request->SoLuong;
            $thuoc->save();

            // Cập nhật tổng tiền thuốc trong phiếu khám
            $phieuKham = PhieuKham::find($request->ID_PhieuKham);
            $tongTienThuoc = ToaThuoc::where('ID_PhieuKham', $request->ID_PhieuKham)
                ->sum('TienThuoc');
            $phieuKham->TongTienThuoc = $tongTienThuoc;
            $phieuKham->save();

            DB::commit();

            return response()->json([
                'message' => 'Thêm thuốc vào toa thành công',
                'toaThuoc' => $toaThuoc->load(['thuoc.dvt', 'thuoc.cachDung'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi thêm thuốc vào toa',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($phieuKhamId, $thuocId)
    {
        DB::beginTransaction();
        try {
            $toaThuoc = ToaThuoc::where('ID_PhieuKham', $phieuKhamId)
                ->where('ID_Thuoc', $thuocId)
                ->first();

            if (!$toaThuoc) {
                return response()->json(['message' => 'Không tìm thấy thuốc trong toa'], 404);
            }

            // Trả lại số lượng tồn
            $thuoc = Thuoc::find($thuocId);
            if ($thuoc) {
                $thuoc->SoLuongTon += $toaThuoc->SoLuong;
                $thuoc->save();
            }

            // Cập nhật tổng tiền thuốc
            $toaThuoc->delete();
            $phieuKham = PhieuKham::find($phieuKhamId);
            $tongTienThuoc = ToaThuoc::where('ID_PhieuKham', $phieuKhamId)
                ->sum('TienThuoc');
            $phieuKham->TongTienThuoc = $tongTienThuoc;
            $phieuKham->save();

            DB::commit();

            return response()->json(['message' => 'Xóa thuốc khỏi toa thành công']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi xóa thuốc khỏi toa',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

