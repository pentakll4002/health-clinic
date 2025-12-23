<?php

namespace App\Http\Controllers;

use App\Models\PhieuKham;
use App\Models\ToaThuoc;
use App\Models\Thuoc;
use App\Helpers\RoleHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PhieuKhamController extends Controller
{
    public function index(Request $request)
    {
        $limit = (int) $request->get('limit', 15);
        $page = (int) $request->get('page', 1);
        $onlyWithoutInvoice = filter_var($request->get('only_without_invoice', false), FILTER_VALIDATE_BOOLEAN);

        $query = PhieuKham::with(['toaThuoc', 'hoaDon'])
            ->where('Is_Deleted', false);

        if ($onlyWithoutInvoice) {
            $query->whereDoesntHave('hoaDon');
        }

        $totalCount = $query->count();
        $records = $query
            ->orderByDesc('ID_PhieuKham')
            ->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $records,
            'totalCount' => $totalCount,
        ]);
    }

    public function show($id)
    {
        $phieuKham = PhieuKham::with(['toaThuoc.thuoc', 'hoaDon', 'tiepNhan.benhNhan'])->find($id);
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Không tìm thấy phiếu khám'], 404);
        }

        return response()->json($phieuKham);
    }

    /**
     * Tạo phiếu khám mới (Bước 1: Tạo record rỗng)
     * Chỉ cho phép khi:
     * - Bệnh nhân có trong DANHSACHTIEPNHAN
     * - Trạng thái = Chưa khám (TrangThai = false)
     * - Ngày khám = ngày hiện tại
     * - Chưa tồn tại PHIEUKHAM
     */
    public function store(Request $request)
    {
        // Kiểm tra quyền: Chỉ bác sĩ và admin được tạo phiếu khám
        $user = $request->user();
        if (!RoleHelper::canDoctorCreatePhieuKham($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền tạo phiếu khám. Chỉ bác sĩ mới được phép thực hiện chức năng này.',
            ], 403);
        }

        $request->validate([
            'ID_TiepNhan' => 'required|integer|exists:danh_sach_tiep_nhan,ID_TiepNhan',
            'CaKham' => 'required|string|max:10',
            'ID_LoaiBenh' => 'nullable|integer|exists:loai_benh,ID_LoaiBenh',
            'TrieuChung' => 'nullable|string|max:255',
            'TienKham' => 'nullable|numeric|min:0',
        ]);

        // Lấy thông tin tiếp nhận
        $tiepNhan = \App\Models\DanhSachTiepNhan::with('benhNhan')->find($request->ID_TiepNhan);
        
        if (!$tiepNhan) {
            return response()->json(['message' => 'Không tìm thấy thông tin tiếp nhận'], 404);
        }

        // Validation: Kiểm tra điều kiện nghiệp vụ
        // 1. Trạng thái phải là "Chưa khám" (TrangThai = false)
        if ($tiepNhan->TrangThai !== false && $tiepNhan->TrangThai !== 0) {
            return response()->json([
                'message' => 'Bệnh nhân này đã được khám hoặc không ở trạng thái chờ khám',
            ], 400);
        }

        // 2. Ngày tiếp nhận phải là ngày hiện tại
        $today = now()->toDateString();
        $ngayTN = $tiepNhan->NgayTN instanceof \DateTime 
            ? $tiepNhan->NgayTN->format('Y-m-d') 
            : date('Y-m-d', strtotime($tiepNhan->NgayTN));
        
        if ($ngayTN !== $today) {
            return response()->json([
                'message' => 'Chỉ có thể lập phiếu khám cho bệnh nhân tiếp nhận trong ngày',
            ], 400);
        }

        // 3. Chưa tồn tại PHIEUKHAM cho tiếp nhận này
        $existingPhieuKham = PhieuKham::where('ID_TiepNhan', $request->ID_TiepNhan)
            ->where('Is_Deleted', false)
            ->first();
        
        if ($existingPhieuKham) {
            return response()->json([
                'message' => 'Bệnh nhân này đã có phiếu khám. Vui lòng cập nhật phiếu khám hiện có.',
                'ID_PhieuKham' => $existingPhieuKham->ID_PhieuKham,
            ], 400);
        }

        // Lấy thông tin bác sĩ từ user hiện tại
        $user = $request->user();
        $nhanVien = $user->nhanVien ?? $user->nhan_vien;
        
        if (!$nhanVien || !$nhanVien->ID_NhanVien) {
            return response()->json([
                'message' => 'Không tìm thấy thông tin bác sĩ. Vui lòng đăng nhập lại.',
            ], 400);
        }

        // Tạo phiếu khám mới (record rỗng - bước 1)
        $phieuKham = PhieuKham::create([
            'ID_TiepNhan' => $request->ID_TiepNhan,
            'ID_BacSi' => $nhanVien->ID_NhanVien,
            'CaKham' => $request->CaKham,
            'TrieuChung' => $request->TrieuChung ?? null,
            'ChanDoan' => $request->ChanDoan ?? null,
            'ID_LoaiBenh' => $request->ID_LoaiBenh ?? 1, // Mặc định loại bệnh 1 nếu chưa có
            'TienKham' => $request->TienKham ?? null,
            'TongTienThuoc' => 0,
            'TrangThai' => 'DangKham', // Đang khám
            'Is_Deleted' => false,
        ]);

        // Cập nhật trạng thái tiếp nhận thành "Đang khám"
        $tiepNhan->TrangThai = true; // true = Đang khám
        $tiepNhan->save();

        $phieuKham->load(['tiepNhan.benhNhan', 'loaiBenh']);

        return response()->json([
            'message' => 'Tạo phiếu khám thành công',
            'data' => $phieuKham,
        ], 201);
    }

    /**
     * Cập nhật phiếu khám (Bước 2: Cập nhật nội dung khám)
     */
    public function update(Request $request, $id)
    {
        // Kiểm tra quyền: Chỉ bác sĩ và admin được cập nhật phiếu khám
        $user = $request->user();
        if (!RoleHelper::canDoctorCreatePhieuKham($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền cập nhật phiếu khám. Chỉ bác sĩ mới được phép thực hiện chức năng này.',
            ], 403);
        }

        $phieuKham = PhieuKham::with(['tiepNhan.benhNhan', 'loaiBenh', 'bacSi'])->find($id);
        
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Không tìm thấy phiếu khám'], 404);
        }
        
        // Kiểm tra bác sĩ chỉ được sửa phiếu khám của chính mình (trừ admin)
        if (!RoleHelper::isRole($user, '@admin') && $phieuKham->ID_BacSi !== $user->nhanVien?->ID_NhanVien) {
            return response()->json([
                'message' => 'Bạn chỉ được phép cập nhật phiếu khám do chính mình tạo.',
            ], 403);
        }

        $request->validate([
            'TrieuChung' => 'nullable|string|max:255',
            'ChanDoan' => 'nullable|string|max:255',
            'ID_LoaiBenh' => 'nullable|integer|exists:loai_benh,ID_LoaiBenh',
            'TienKham' => 'nullable|numeric|min:0',
            'TrangThai' => 'nullable|string|in:DangKham,DaKham',
        ]);

        $phieuKham->fill($request->only(['TrieuChung', 'ChanDoan', 'ID_LoaiBenh', 'TienKham', 'TrangThai']));
        $phieuKham->save();
        $phieuKham->load(['tiepNhan.benhNhan', 'loaiBenh', 'bacSi']);

        return response()->json([
            'message' => 'Cập nhật phiếu khám thành công',
            'data' => $phieuKham,
        ]);
    }
    
    /**
     * Hoàn tất khám (Bước 4: Cập nhật TrangThai = DaKham)
     */
    public function complete(Request $request, $id)
    {
        $phieuKham = PhieuKham::with(['tiepNhan.benhNhan', 'loaiBenh', 'bacSi', 'toaThuoc'])->find($id);
        
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Không tìm thấy phiếu khám'], 404);
        }

        // Transaction để đảm bảo kiểm tra và trừ kho an toàn
        DB::beginTransaction();
        try {
            $toaThuocs = $phieuKham->toaThuoc()->with('thuoc')->get();

            // Nếu không có thuốc: chỉ cập nhật trạng thái phiếu khám, không trừ kho
            if ($toaThuocs->isEmpty()) {
                $phieuKham->TrangThai = 'DaKham';
                $phieuKham->save();

                $tiepNhan = $phieuKham->tiepNhan;
                if ($tiepNhan) {
                    $tiepNhan->TrangThai = true; // Đã khám
                    $tiepNhan->save();
                }

                DB::commit();
                $phieuKham->load(['tiepNhan.benhNhan', 'loaiBenh', 'bacSi', 'toaThuoc']);

                return response()->json([
                    'message' => 'Hoàn tất khám thành công (không kê thuốc).',
                    'data' => $phieuKham,
                ]);
            }

            $totalTienThuoc = 0;

            foreach ($toaThuocs as $item) {
                /** @var ToaThuoc $item */
                $thuoc = $item->thuoc;
                if (!$thuoc) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Không tìm thấy thuốc ID {$item->ID_Thuoc}",
                    ], 404);
                }

                // Nếu chưa có snapshot giá, lấy giá hiện tại làm snapshot
                if ($item->DonGiaBan_LuocMua === null) {
                    $item->DonGiaBan_LuocMua = $thuoc->DonGiaBan;
                    $item->TienThuoc = $item->SoLuong * (float) $item->DonGiaBan_LuocMua;
                    $item->save();
                }

                // Kiểm tra tồn kho
                if ($thuoc->SoLuongTon < $item->SoLuong) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Không đủ thuốc \"{$thuoc->TenThuoc}\" trong kho. Cần {$item->SoLuong}, tồn {$thuoc->SoLuongTon}.",
                    ], 400);
                }

                $totalTienThuoc += (float) $item->TienThuoc;
            }

            // Trừ kho sau khi đã đảm bảo không thiếu thuốc
            foreach ($toaThuocs as $item) {
                $thuoc = $item->thuoc;
                $thuoc->SoLuongTon -= $item->SoLuong;
                $thuoc->save();
            }

            // Cập nhật phiếu khám
            $phieuKham->TrangThai = 'DaKham';
            $phieuKham->TongTienThuoc = $totalTienThuoc;
            $phieuKham->save();

            // Cập nhật trạng thái tiếp nhận thành "Đã khám"
            $tiepNhan = $phieuKham->tiepNhan;
            if ($tiepNhan) {
                $tiepNhan->TrangThai = true; // Đã khám
                $tiepNhan->save();
            }

            DB::commit();
            $phieuKham->load(['tiepNhan.benhNhan', 'loaiBenh', 'bacSi', 'toaThuoc']);

            return response()->json([
                'message' => 'Hoàn tất khám thành công. Thuốc đã được trừ kho và dữ liệu sẵn sàng cho thu ngân.',
                'data' => $phieuKham,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi hoàn tất khám',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Kiểm tra xem có thể tạo phiếu khám cho tiếp nhận không
     */
    public function checkCanCreate(Request $request)
    {
        $request->validate([
            'ID_TiepNhan' => 'required|integer|exists:danh_sach_tiep_nhan,ID_TiepNhan',
        ]);

        $tiepNhan = \App\Models\DanhSachTiepNhan::with(['benhNhan', 'phieuKhams'])->find($request->ID_TiepNhan);
        
        if (!$tiepNhan) {
            return response()->json(['message' => 'Không tìm thấy thông tin tiếp nhận'], 404);
        }

        $today = now()->toDateString();
        $ngayTN = $tiepNhan->NgayTN instanceof \DateTime 
            ? $tiepNhan->NgayTN->format('Y-m-d') 
            : date('Y-m-d', strtotime($tiepNhan->NgayTN));

        $canCreate = 
            ($tiepNhan->TrangThai === false || $tiepNhan->TrangThai === 0) && // Chưa khám
            $ngayTN === $today && // Ngày hôm nay
            !$tiepNhan->phieuKhams()->where('Is_Deleted', false)->exists(); // Chưa có phiếu khám

        return response()->json([
            'canCreate' => $canCreate,
            'reasons' => !$canCreate ? [
                'TrangThai' => $tiepNhan->TrangThai !== false && $tiepNhan->TrangThai !== 0 ? 'Bệnh nhân đã được khám' : null,
                'NgayTN' => $ngayTN !== $today ? 'Không phải ngày tiếp nhận hôm nay' : null,
                'HasPhieuKham' => $tiepNhan->phieuKhams()->where('Is_Deleted', false)->exists() ? 'Đã có phiếu khám' : null,
            ] : [],
        ]);
    }
}




























