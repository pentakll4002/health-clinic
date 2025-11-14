<?php

namespace App\Http\Controllers;

use App\Models\BaoCaoSuDungThuoc;
use App\Models\ChiTietPhieuNhapThuoc;
use App\Models\ToaThuoc;
use App\Models\PhieuKham;
use App\Models\PhieuNhapThuoc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BaoCaoSuDungThuocController extends Controller
{
    public function index(Request $request)
    {
        $thang = $request->get('thang');
        $nam = $request->get('nam');
        $idThuoc = $request->get('id_thuoc');
        $limit = $request->get('limit', 10);
        $page = $request->get('page', 1);

        $query = BaoCaoSuDungThuoc::with('thuoc');

        if ($thang) {
            $query->where('Thang', $thang);
        }
        if ($nam) {
            $query->where('Nam', $nam);
        }
        if ($idThuoc) {
            $query->where('ID_Thuoc', $idThuoc);
        }

        $totalCount = $query->count();
        $data = $query->orderBy('Nam', 'desc')
            ->orderBy('Thang', 'desc')
            ->orderBy('ID_Thuoc', 'asc')
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
        $baoCao = BaoCaoSuDungThuoc::with('thuoc')->find($id);
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
        $existingReports = BaoCaoSuDungThuoc::where('Thang', $thang)
            ->where('Nam', $nam)
            ->exists();

        if ($existingReports) {
            return response()->json([
                'message' => 'Báo cáo cho tháng này đã tồn tại',
            ], 409);
        }

        // Tính khoảng thời gian trong tháng
        $startDate = "$nam-$thang-01";
        $endDate = date('Y-m-t 23:59:59', strtotime($startDate));

        // Lấy tất cả phiếu nhập thuốc trong tháng
        $phieuNhapThuocs = PhieuNhapThuoc::whereBetween('NgayNhap', [$startDate, $endDate])
            ->with('chiTiet')
            ->get();

        // Lấy tất cả phiếu khám trong tháng (để tính số lượng dùng)
        // Lấy các ID_TiepNhan trong tháng
        $tiepNhanIds = DB::table('danh_sach_tiep_nhan')
            ->whereBetween('NgayTN', [$startDate, $endDate])
            ->pluck('ID_TiepNhan');
        
        $phieuKhams = PhieuKham::whereIn('ID_TiepNhan', $tiepNhanIds)
            ->where('Is_Deleted', false)
            ->with('toaThuoc')
            ->get();

        // Lấy tất cả chi tiết phiếu nhập thuốc trong tháng
        $chiTietNhaps = ChiTietPhieuNhapThuoc::whereHas('phieuNhapThuoc', function ($query) use ($startDate, $endDate) {
            $query->whereBetween('NgayNhap', [$startDate, $endDate]);
        })->get();

        // Lấy tất cả toa thuốc từ các phiếu khám trong tháng
        $toaThuocs = collect();
        foreach ($phieuKhams as $phieuKham) {
            $toaThuocs = $toaThuocs->merge($phieuKham->toaThuoc);
        }

        // Nhóm theo ID_Thuoc
        $tongSoLuongNhapByThuoc = $chiTietNhaps->groupBy('ID_Thuoc')->map(function ($items) {
            return $items->sum('SoLuongNhap');
        });

        $soLuongDungByThuoc = $toaThuocs->groupBy('ID_Thuoc')->map(function ($items) {
            return $items->sum('SoLuong');
        });

        $soLanDungByThuoc = $toaThuocs->groupBy('ID_Thuoc')->map(function ($items) {
            return $items->count();
        });

        // Lấy tất cả các thuốc có trong báo cáo (có nhập hoặc có dùng)
        $allThuocIds = $tongSoLuongNhapByThuoc->keys()
            ->merge($soLuongDungByThuoc->keys())
            ->unique()
            ->sort();

        // Tạo báo cáo cho từng thuốc
        $baoCaoData = [];
        foreach ($allThuocIds as $idThuoc) {
            $baoCaoData[] = [
                'Thang' => $thang,
                'Nam' => $nam,
                'ID_Thuoc' => $idThuoc,
                'TongSoLuongNhap' => $tongSoLuongNhapByThuoc->get($idThuoc, 0),
                'SoLuongDung' => $soLuongDungByThuoc->get($idThuoc, 0),
                'SoLanDung' => $soLanDungByThuoc->get($idThuoc, 0),
            ];
        }

        // Chèn tất cả báo cáo
        if (!empty($baoCaoData)) {
            BaoCaoSuDungThuoc::insert($baoCaoData);
        }

        // Lấy lại dữ liệu đã tạo
        $createdReports = BaoCaoSuDungThuoc::where('Thang', $thang)
            ->where('Nam', $nam)
            ->with('thuoc')
            ->get();

        return response()->json([
            'message' => 'Lập báo cáo sử dụng thuốc thành công',
            'data' => $createdReports,
            'total' => $createdReports->count(),
        ], 201);
    }

    public function destroy($id)
    {
        $baoCao = BaoCaoSuDungThuoc::find($id);
        if (!$baoCao) {
            return response()->json(['message' => 'Không tìm thấy báo cáo'], 404);
        }

        $baoCao->delete();
        return response()->json(['message' => 'Xoá báo cáo thành công']);
    }

    public function destroyByMonth(Request $request)
    {
        $validated = $request->validate([
            'Thang' => 'required|integer|min:1|max:12',
            'Nam' => 'required|integer|min:2000|max:2100',
        ]);

        $deleted = BaoCaoSuDungThuoc::where('Thang', $validated['Thang'])
            ->where('Nam', $validated['Nam'])
            ->delete();

        return response()->json([
            'message' => 'Xoá báo cáo thành công',
            'deleted' => $deleted,
        ]);
    }
}

