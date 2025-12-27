<?php

namespace App\Http\Controllers;

use App\Models\PhieuNhapThuoc;
use App\Models\ChiTietPhieuNhapThuoc;
use App\Models\Thuoc;
use App\Helpers\RoleHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PhieuNhapThuocController extends Controller
{
    /**
     * Lấy danh sách phiếu nhập thuốc
     */
    public function index(Request $request)
    {
        $limit = $request->get('limit', 10);
        $page = $request->get('page', 1);
        
        $query = PhieuNhapThuoc::with(['nhanVien', 'chiTiet.thuoc'])
            ->orderBy('NgayNhap', 'desc');

        // Filter theo ngày
        if ($request->has('tu_ngay')) {
            $query->whereDate('NgayNhap', '>=', $request->tu_ngay);
        }
        if ($request->has('den_ngay')) {
            $query->whereDate('NgayNhap', '<=', $request->den_ngay);
        }

        $totalCount = $query->count();
        $data = $query->offset(($page - 1) * $limit)->limit($limit)->get();

        return response()->json([
            'data' => $data,
            'totalCount' => $totalCount,
        ]);
    }

    /**
     * Tạo phiếu nhập thuốc mới
     * Chỉ managers mới được nhập thuốc
     */
    public function store(Request $request)
    {
        // Kiểm tra quyền: Chỉ quản lý được nhập thuốc
        $user = $request->user();
        if (!RoleHelper::canManagerManageDrugs($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền nhập thuốc. Chỉ quản lý mới được phép thực hiện chức năng này.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'NgayNhap' => 'required|date',
            'chi_tiet' => 'required|array|min:1',
            'chi_tiet.*.ID_Thuoc' => 'required|integer|exists:thuoc,ID_Thuoc',
            'chi_tiet.*.SoLuongNhap' => 'required|integer|min:1',
            'chi_tiet.*.DonGiaNhap' => 'required|numeric|min:0',
            'chi_tiet.*.HanSuDung' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Lấy ID nhân viên từ user
            $nhanVien = $user->nhan_vien ?? $user->nhanVien;
            if (!$nhanVien) {
                return response()->json([
                    'message' => 'Không tìm thấy thông tin nhân viên',
                ], 400);
            }

            // Tính tổng tiền nhập
            $tongTienNhap = 0;
            foreach ($request->chi_tiet as $item) {
                $tongTienNhap += $item['SoLuongNhap'] * $item['DonGiaNhap'];
            }

            // Tạo phiếu nhập
            $phieuNhap = PhieuNhapThuoc::create([
                'ID_NhanVien' => $nhanVien->ID_NhanVien,
                'NgayNhap' => $request->NgayNhap,
                'TongTienNhap' => $tongTienNhap,
            ]);

            // Tạo chi tiết phiếu nhập và cập nhật tồn kho
            foreach ($request->chi_tiet as $item) {
                $thanhTien = $item['SoLuongNhap'] * $item['DonGiaNhap'];
                
                ChiTietPhieuNhapThuoc::create([
                    'ID_PhieuNhapThuoc' => $phieuNhap->ID_PhieuNhapThuoc,
                    'ID_Thuoc' => $item['ID_Thuoc'],
                    'SoLuongNhap' => $item['SoLuongNhap'],
                    'DonGiaNhap' => $item['DonGiaNhap'],
                    'ThanhTien' => $thanhTien,
                    'HanSuDung' => $item['HanSuDung'] ?? null,
                ]);

                // Cập nhật số lượng tồn kho
                $thuoc = Thuoc::find($item['ID_Thuoc']);
                if ($thuoc) {
                    $thuoc->SoLuongTon = ($thuoc->SoLuongTon ?? 0) + $item['SoLuongNhap'];
                    // Cập nhật đơn giá nhập mới nhất
                    if ($item['DonGiaNhap'] > 0) {
                        $thuoc->DonGiaNhap = $item['DonGiaNhap'];
                    }
                    $thuoc->save();
                }
            }

            DB::commit();

            // Load lại relationships
            $phieuNhap->load(['nhanVien', 'chiTiet.thuoc']);

            return response()->json([
                'message' => 'Tạo phiếu nhập thuốc thành công',
                'data' => $phieuNhap,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi tạo phiếu nhập thuốc: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Lấy chi tiết phiếu nhập thuốc
     */
    public function show($id)
    {
        $phieuNhap = PhieuNhapThuoc::with(['nhanVien', 'chiTiet.thuoc.dvt', 'chiTiet.thuoc.cachDung'])
            ->find($id);

        if (!$phieuNhap) {
            return response()->json([
                'message' => 'Không tìm thấy phiếu nhập thuốc',
            ], 404);
        }

        return response()->json([
            'data' => $phieuNhap,
        ]);
    }

    /**
     * Xóa phiếu nhập thuốc
     * Chỉ managers mới được xóa
     */
    public function destroy($id)
    {
        $user = request()->user();
        if (!RoleHelper::canManagerManageDrugs($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền xóa phiếu nhập thuốc. Chỉ quản lý mới được phép thực hiện chức năng này.',
            ], 403);
        }

        $phieuNhap = PhieuNhapThuoc::with('chiTiet')->find($id);

        if (!$phieuNhap) {
            return response()->json([
                'message' => 'Không tìm thấy phiếu nhập thuốc',
            ], 404);
        }

        DB::beginTransaction();
        try {
            // Hoàn trả số lượng tồn kho
            foreach ($phieuNhap->chiTiet as $chiTiet) {
                $thuoc = Thuoc::find($chiTiet->ID_Thuoc);
                if ($thuoc) {
                    $thuoc->SoLuongTon = max(0, ($thuoc->SoLuongTon ?? 0) - $chiTiet->SoLuongNhap);
                    $thuoc->save();
                }
            }

            // Xóa chi tiết
            $phieuNhap->chiTiet()->delete();
            
            // Xóa phiếu nhập
            $phieuNhap->delete();

            DB::commit();

            return response()->json([
                'message' => 'Xóa phiếu nhập thuốc thành công',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi xóa phiếu nhập thuốc: ' . $e->getMessage(),
            ], 500);
        }
    }
}






