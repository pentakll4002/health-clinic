<?php

namespace App\Http\Controllers;

use App\Helpers\RoleHelper;
use App\Models\ChiTietPhieuNhapThuoc;
use App\Models\HoaDon;
use App\Models\NhanVien;
use App\Models\PhieuNhapThuoc;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ManagerAnalyticsController extends Controller
{
    public function summary(Request $request)
    {
        $user = $request->user();
        if (!RoleHelper::hasRole($user, ['@managers', '@admin'])) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập thống kê.',
            ], 403);
        }

        $validated = $request->validate([
            'thang' => 'nullable|integer|min:1|max:12',
            'nam' => 'nullable|integer|min:2000|max:2100',
        ]);

        $thang = $validated['thang'] ?? null;
        $nam = $validated['nam'] ?? null;

        $start = null;
        $end = null;
        if ($thang && $nam) {
            $start = Carbon::createFromDate((int) $nam, (int) $thang, 1)->startOfMonth();
            $end = Carbon::createFromDate((int) $nam, (int) $thang, 1)->endOfMonth();
        }

        $phieuNhapQuery = PhieuNhapThuoc::query();
        $chiTietQuery = ChiTietPhieuNhapThuoc::query();
        $hoaDonQuery = HoaDon::query();

        if ($start && $end) {
            $phieuNhapQuery->whereBetween('NgayNhap', [$start, $end]);
            $chiTietQuery->whereHas('phieuNhapThuoc', function ($q) use ($start, $end) {
                $q->whereBetween('NgayNhap', [$start, $end]);
            });
            $hoaDonQuery->whereBetween('NgayHoaDon', [$start->toDateString(), $end->toDateString()]);
        }

        $totalImportSlips = (int) $phieuNhapQuery->count();
        $totalImportAmount = (float) $phieuNhapQuery->sum('TongTienNhap');
        $totalImportQuantity = (int) $chiTietQuery->sum('SoLuongNhap');

        $totalInvoices = (int) $hoaDonQuery->count();
        $totalRevenue = (float) $hoaDonQuery->sum('TongTien');

        return response()->json([
            'filters' => [
                'thang' => $thang,
                'nam' => $nam,
            ],
            'kpis' => [
                'total_import_slips' => $totalImportSlips,
                'total_import_amount' => $totalImportAmount,
                'total_import_quantity' => $totalImportQuantity,
                'total_invoices' => $totalInvoices,
                'total_revenue' => $totalRevenue,
            ],
        ]);
    }

    public function staffPerformance(Request $request)
    {
        $user = $request->user();
        if (!RoleHelper::hasRole($user, ['@managers', '@admin'])) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập thống kê.',
            ], 403);
        }

        $validated = $request->validate([
            'thang' => 'nullable|integer|min:1|max:12',
            'nam' => 'nullable|integer|min:2000|max:2100',
        ]);

        $thang = $validated['thang'] ?? null;
        $nam = $validated['nam'] ?? null;

        $start = null;
        $end = null;
        if ($thang && $nam) {
            $start = Carbon::createFromDate((int) $nam, (int) $thang, 1)->startOfMonth();
            $end = Carbon::createFromDate((int) $nam, (int) $thang, 1)->endOfMonth();
        }

        // 1) Tiếp nhận đã duyệt (lễ tân) - danh_sach_tiep_nhan.ID_LeTanDuyet
        $tiepNhanDuyet = DB::table('danh_sach_tiep_nhan')
            ->select('ID_LeTanDuyet as ID_NhanVien', DB::raw('COUNT(*) as total'))
            ->whereNotNull('ID_LeTanDuyet')
            ->where('Is_Deleted', false);

        if ($start && $end) {
            $tiepNhanDuyet->whereBetween('NgayTN', [$start, $end]);
        }

        $tiepNhanDuyet = $tiepNhanDuyet
            ->groupBy('ID_LeTanDuyet')
            ->pluck('total', 'ID_NhanVien')
            ->toArray();

        // 2) Ca khám đã xử lý (bác sĩ) - phieu_kham.ID_BacSi
        $phieuKham = DB::table('phieu_kham')
            ->select('ID_BacSi as ID_NhanVien', DB::raw('COUNT(*) as total'))
            ->whereNotNull('ID_BacSi')
            ->where('Is_Deleted', false);

        if ($start && $end) {
            // fallback theo created_at vì phieu_kham không có ngày riêng
            $phieuKham->whereBetween('created_at', [$start, $end]);
        }

        $phieuKham = $phieuKham
            ->groupBy('ID_BacSi')
            ->pluck('total', 'ID_NhanVien')
            ->toArray();

        // 3) Doanh thu hoá đơn theo nhân viên lập hoá đơn - hoa_don.ID_NhanVien
        $hoaDon = DB::table('hoa_don')
            ->select('ID_NhanVien', DB::raw('COUNT(*) as total'), DB::raw('COALESCE(SUM(TongTien), 0) as revenue'));

        if ($start && $end) {
            $hoaDon->whereBetween('NgayHoaDon', [$start->toDateString(), $end->toDateString()]);
        }

        $hoaDon = $hoaDon
            ->groupBy('ID_NhanVien')
            ->get();

        $hoaDonCount = [];
        $hoaDonRevenue = [];
        foreach ($hoaDon as $row) {
            $hoaDonCount[(int) $row->ID_NhanVien] = (int) $row->total;
            $hoaDonRevenue[(int) $row->ID_NhanVien] = (float) $row->revenue;
        }

        // 4) Nhập kho theo nhân viên - phieu_nhap_thuoc.ID_NhanVien
        $phieuNhap = DB::table('phieu_nhap_thuoc')
            ->select('ID_NhanVien', DB::raw('COUNT(*) as total'), DB::raw('COALESCE(SUM(TongTienNhap), 0) as amount'))
            ->whereNotNull('ID_NhanVien');

        if ($start && $end) {
            $phieuNhap->whereBetween('NgayNhap', [$start, $end]);
        }

        $phieuNhap = $phieuNhap
            ->groupBy('ID_NhanVien')
            ->get();

        $importCount = [];
        $importAmount = [];
        foreach ($phieuNhap as $row) {
            $importCount[(int) $row->ID_NhanVien] = (int) $row->total;
            $importAmount[(int) $row->ID_NhanVien] = (float) $row->amount;
        }

        // Union IDs from all KPI sources
        $ids = array_unique(array_merge(
            array_map('intval', array_keys($tiepNhanDuyet)),
            array_map('intval', array_keys($phieuKham)),
            array_map('intval', array_keys($hoaDonCount)),
            array_map('intval', array_keys($importCount))
        ));

        if (empty($ids)) {
            return response()->json([
                'filters' => ['thang' => $thang, 'nam' => $nam],
                'data' => [],
            ]);
        }

        $employees = NhanVien::with('nhomNguoiDung')
            ->whereIn('ID_NhanVien', $ids)
            ->get()
            ->keyBy('ID_NhanVien');

        $data = [];
        foreach ($ids as $id) {
            $e = $employees->get($id);
            if (!$e) {
                continue;
            }

            $reception = (int) ($tiepNhanDuyet[$id] ?? 0);
            $medicalForms = (int) ($phieuKham[$id] ?? 0);
            $invoices = (int) ($hoaDonCount[$id] ?? 0);
            $revenue = (float) ($hoaDonRevenue[$id] ?? 0);
            $imports = (int) ($importCount[$id] ?? 0);
            $importMoney = (float) ($importAmount[$id] ?? 0);

            // Simple weighted score (can adjust later)
            $score = ($reception * 2) + ($medicalForms * 3) + ($invoices * 1) + ($revenue / 1000000) + ($imports * 1);

            $data[] = [
                'ID_NhanVien' => (int) $e->ID_NhanVien,
                'HoTenNV' => $e->HoTenNV,
                'nhom_nguoi_dung' => $e->nhomNguoiDung,
                'kpis' => [
                    'reception_approved' => $reception,
                    'medical_forms' => $medicalForms,
                    'invoices' => $invoices,
                    'revenue' => $revenue,
                    'import_slips' => $imports,
                    'import_amount' => $importMoney,
                ],
                'score' => round($score, 2),
            ];
        }

        usort($data, fn ($a, $b) => ($b['score'] <=> $a['score']));

        return response()->json([
            'filters' => ['thang' => $thang, 'nam' => $nam],
            'data' => $data,
        ]);
    }
}
