<?php

namespace App\Http\Controllers;

use App\Models\BaoCaoDoanhThu;
use App\Models\ChiTietBaoCaoDoanhThu;
use App\Models\HoaDon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BaoCaoDoanhThuController extends Controller
{
    public function index(Request $request)
    {
        $thang = $request->get('thang');
        $nam = $request->get('nam');
        $limit = $request->get('limit', 10);
        $page = $request->get('page', 1);

        $query = BaoCaoDoanhThu::with('chiTiet');

        if ($thang) {
            $query->where('Thang', $thang);
        }
        if ($nam) {
            $query->where('Nam', $nam);
        }

        $totalCount = $query->count();
        $data = $query->orderBy('Nam', 'desc')
            ->orderBy('Thang', 'desc')
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
        $baoCao = BaoCaoDoanhThu::with('chiTiet')->find($id);
        if (!$baoCao) {
            return response()->json(['message' => 'Không tìm thấy báo cáo'], 404);
        }
        return response()->json($baoCao);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Thang' => 'required|integer|min:1|max:12',
            'Nam' => 'required|integer|min:2000|max:2100',
        ]);

        $thang = $validated['Thang'];
        $nam = $validated['Nam'];

        // Kiểm tra xem báo cáo đã tồn tại chưa
        $existingReport = BaoCaoDoanhThu::where('Thang', $thang)
            ->where('Nam', $nam)
            ->first();

        if ($existingReport) {
            return response()->json([
                'message' => 'Báo cáo cho tháng này đã tồn tại',
                'bao_cao' => $existingReport->load('chiTiet')
            ], 409);
        }

        // Lấy tất cả hóa đơn trong tháng
        $startDate = "$nam-$thang-01";
        $endDate = date('Y-m-t', strtotime($startDate)); // Ngày cuối cùng của tháng

        $hoaDons = HoaDon::whereBetween('NgayHoaDon', [$startDate, $endDate])
            ->whereNotNull('TongTien')
            ->get();

        // Tính tổng doanh thu
        $tongDoanhThu = $hoaDons->sum('TongTien');

        // Tạo báo cáo tổng
        $baoCao = BaoCaoDoanhThu::create([
            'Thang' => $thang,
            'Nam' => $nam,
            'TongDoanhThu' => $tongDoanhThu,
        ]);

        // Tính chi tiết theo ngày
        $soNgayTrongThang = (int) date('t', strtotime($startDate));
        $chiTietData = [];

        for ($ngay = 1; $ngay <= $soNgayTrongThang; $ngay++) {
            $ngayStr = sprintf("%04d-%02d-%02d", $nam, $thang, $ngay);
            $hoaDonTrongNgay = $hoaDons->filter(function ($hoaDon) use ($ngayStr) {
                return date('Y-m-d', strtotime($hoaDon->NgayHoaDon)) === $ngayStr;
            });

            $soBenhNhan = $hoaDonTrongNgay->count();
            $doanhThu = $hoaDonTrongNgay->sum('TongTien');
            $tyLe = $tongDoanhThu > 0 ? ($doanhThu / $tongDoanhThu) * 100 : 0;

            $chiTietData[] = [
                'ID_BCDT' => $baoCao->ID_BCDT,
                'Ngay' => $ngay,
                'SoBenhNhan' => $soBenhNhan,
                'DoanhThu' => $doanhThu,
                'TyLe' => round($tyLe, 2),
            ];
        }

        // Chèn tất cả chi tiết
        ChiTietBaoCaoDoanhThu::insert($chiTietData);

        return response()->json([
            'message' => 'Lập báo cáo doanh thu thành công',
            'bao_cao' => $baoCao->load('chiTiet')
        ], 201);
    }

    public function destroy($id)
    {
        $baoCao = BaoCaoDoanhThu::find($id);
        if (!$baoCao) {
            return response()->json(['message' => 'Không tìm thấy báo cáo'], 404);
        }

        // Xóa chi tiết trước
        ChiTietBaoCaoDoanhThu::where('ID_BCDT', $id)->delete();
        $baoCao->delete();

        return response()->json(['message' => 'Xoá báo cáo thành công']);
    }
}

