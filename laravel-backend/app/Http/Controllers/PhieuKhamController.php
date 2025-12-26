<?php

namespace App\Http\Controllers;

use App\Models\PhieuKham;
use App\Models\DichVu;
use App\Models\ToaThuoc;
use App\Models\Thuoc;
use App\Models\CtPhieuKhamDichVu;
use App\Models\QuiDinh;
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
        $onlyCompleted = filter_var($request->get('only_completed', false), FILTER_VALIDATE_BOOLEAN);
        $benhNhanId = $request->get('ID_BenhNhan');

        $query = PhieuKham::with(['toaThuoc', 'hoaDon', 'tiepNhan.benhNhan', 'bacSi', 'dichVu', 'ctDichVuPhu.dichVu'])
            ->where('Is_Deleted', false);

        if ($benhNhanId !== null && $benhNhanId !== '') {
            $query->whereHas('tiepNhan', function ($q) use ($benhNhanId) {
                $q->where('ID_BenhNhan', (int) $benhNhanId);
            });
        }

        if ($onlyWithoutInvoice) {
            $query->whereDoesntHave('hoaDon');
        }

        if ($onlyCompleted) {
            $query->where('TrangThai', 'DaKham');
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

    public function addToaThuoc(Request $request, $id)
    {
        $user = $request->user();
        if (!RoleHelper::canDoctorCreatePhieuKham($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền kê toa thuốc. Chỉ bác sĩ mới được phép thực hiện chức năng này.',
            ], 403);
        }

        $phieuKham = PhieuKham::with(['toaThuoc.thuoc', 'tiepNhan'])->find($id);
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Không tìm thấy phiếu khám'], 404);
        }

        $nhanVien = $user->nhanVien ?? $user->nhan_vien;
        if (!$nhanVien || !$nhanVien->ID_NhanVien) {
            return response()->json([
                'message' => 'Không tìm thấy thông tin bác sĩ. Vui lòng đăng nhập lại.',
            ], 400);
        }

        if (!RoleHelper::isRole($user, '@admin')) {
            $doctorId = (int) $nhanVien->ID_NhanVien;

            $doctorBusy = PhieuKham::where('Is_Deleted', false)
                ->where('TrangThai', 'DangKham')
                ->where('ID_BacSi', $doctorId)
                ->where('ID_PhieuKham', '!=', (int) $phieuKham->ID_PhieuKham)
                ->with(['tiepNhan.benhNhan', 'bacSi'])
                ->first();

            if ($doctorBusy) {
                return response()->json([
                    'message' => 'Bác sĩ đang khám cho một bệnh nhân khác. Vui lòng hoàn tất phiếu khám đang khám trước.',
                    'conflict_type' => 'DOCTOR_BUSY',
                    'conflict' => $doctorBusy,
                ], 409);
            }

            $patientId = $phieuKham->tiepNhan?->ID_BenhNhan;
            if ($patientId) {
                $patientBusy = PhieuKham::where('Is_Deleted', false)
                    ->where('TrangThai', 'DangKham')
                    ->where('ID_PhieuKham', '!=', (int) $phieuKham->ID_PhieuKham)
                    ->whereHas('tiepNhan', function ($q) use ($patientId) {
                        $q->where('ID_BenhNhan', (int) $patientId);
                    })
                    ->with(['tiepNhan.benhNhan', 'bacSi'])
                    ->first();

                if ($patientBusy) {
                    return response()->json([
                        'message' => 'Bệnh nhân đang có một phiếu khám khác ở trạng thái đang khám.',
                        'conflict_type' => 'PATIENT_BUSY',
                        'conflict' => $patientBusy,
                    ], 409);
                }
            }
        }

        // Nếu phiếu đã có bác sĩ khác claim (trừ admin) thì không cho kê toa
        if (!RoleHelper::isRole($user, '@admin') && $phieuKham->ID_BacSi && $phieuKham->ID_BacSi !== $nhanVien->ID_NhanVien) {
            return response()->json([
                'message' => 'Phiếu khám này đang do bác sĩ khác phụ trách.',
            ], 403);
        }

        // Khi bắt đầu kê toa: auto-claim + chuyển trạng thái sang Đang khám
        if (!$phieuKham->ID_BacSi) {
            $phieuKham->ID_BacSi = $nhanVien->ID_NhanVien;
        }
        if ($phieuKham->TrangThai === 'ChoKham') {
            $phieuKham->TrangThai = 'DangKham';
        }
        $phieuKham->save();

        $tiepNhan = $phieuKham->tiepNhan;
        if ($tiepNhan && ($tiepNhan->TrangThaiTiepNhan ?? null) === 'CHO_KHAM') {
            $tiepNhan->TrangThaiTiepNhan = 'DANG_KHAM';
            $tiepNhan->save();
        }

        $request->validate([
            'ID_Thuoc' => 'required|integer|exists:thuoc,ID_Thuoc',
            'SoLuong' => 'required|integer|min:1',
            'CachDung' => 'nullable|string|max:255',
        ]);

        $thuoc = Thuoc::find($request->ID_Thuoc);
        if (!$thuoc || $thuoc->Is_Deleted) {
            return response()->json(['message' => 'Không tìm thấy thuốc'], 404);
        }

        $donGia = (float) $thuoc->DonGiaBan;
        $tienThuoc = (float) $request->SoLuong * $donGia;

        $item = ToaThuoc::updateOrCreate(
            ['ID_PhieuKham' => $phieuKham->ID_PhieuKham, 'ID_Thuoc' => $thuoc->ID_Thuoc],
            [
                'SoLuong' => (int) $request->SoLuong,
                'CachDung' => $request->CachDung,
                'DonGiaBan_LuocMua' => $donGia,
                'TienThuoc' => $tienThuoc,
            ]
        );

        $tongTien = (float) ToaThuoc::where('ID_PhieuKham', $phieuKham->ID_PhieuKham)->sum('TienThuoc');
        $phieuKham->TongTienThuoc = $tongTien;
        $phieuKham->save();

        $phieuKham->load(['toaThuoc.thuoc.dvt', 'tiepNhan.benhNhan', 'loaiBenh', 'bacSi']);

        return response()->json([
            'message' => 'Cập nhật toa thuốc thành công',
            'data' => $phieuKham,
            'item' => $item->load('thuoc'),
        ]);
    }

    public function updateToaThuoc(Request $request, $id, $thuocId)
    {
        $user = $request->user();
        if (!RoleHelper::canDoctorCreatePhieuKham($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền kê toa thuốc. Chỉ bác sĩ mới được phép thực hiện chức năng này.',
            ], 403);
        }

        $phieuKham = PhieuKham::find($id);
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Không tìm thấy phiếu khám'], 404);
        }

        $request->validate([
            'SoLuong' => 'nullable|integer|min:1',
            'CachDung' => 'nullable|string|max:255',
        ]);

        $item = ToaThuoc::where('ID_PhieuKham', $phieuKham->ID_PhieuKham)
            ->where('ID_Thuoc', $thuocId)
            ->first();

        if (!$item) {
            return response()->json(['message' => 'Không tìm thấy thuốc trong toa'], 404);
        }

        if ($request->has('SoLuong')) {
            $donGia = (float) ($item->DonGiaBan_LuocMua ?? 0);
            $item->SoLuong = (int) $request->SoLuong;
            $item->TienThuoc = (float) $item->SoLuong * $donGia;
        }
        if ($request->has('CachDung')) {
            $item->CachDung = $request->CachDung;
        }
        $item->save();

        $tongTien = (float) ToaThuoc::where('ID_PhieuKham', $phieuKham->ID_PhieuKham)->sum('TienThuoc');
        $phieuKham->TongTienThuoc = $tongTien;
        $phieuKham->save();

        $phieuKham->load(['toaThuoc.thuoc.dvt', 'tiepNhan.benhNhan', 'loaiBenh', 'bacSi']);

        return response()->json([
            'message' => 'Cập nhật toa thuốc thành công',
            'data' => $phieuKham,
        ]);
    }

    public function removeToaThuoc(Request $request, $id, $thuocId)
    {
        $user = $request->user();
        if (!RoleHelper::canDoctorCreatePhieuKham($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền kê toa thuốc. Chỉ bác sĩ mới được phép thực hiện chức năng này.',
            ], 403);
        }

        $phieuKham = PhieuKham::find($id);
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Không tìm thấy phiếu khám'], 404);
        }

        ToaThuoc::where('ID_PhieuKham', $phieuKham->ID_PhieuKham)
            ->where('ID_Thuoc', $thuocId)
            ->delete();

        $tongTien = (float) ToaThuoc::where('ID_PhieuKham', $phieuKham->ID_PhieuKham)->sum('TienThuoc');
        $phieuKham->TongTienThuoc = $tongTien;
        $phieuKham->save();

        $phieuKham->load(['toaThuoc.thuoc.dvt', 'tiepNhan.benhNhan', 'loaiBenh', 'bacSi']);

        return response()->json([
            'message' => 'Xóa thuốc khỏi toa thành công',
            'data' => $phieuKham,
        ]);
    }

    public function show($id)
    {
        $phieuKham = PhieuKham::with([
            'toaThuoc.thuoc.dvt',
            'hoaDon',
            'tiepNhan.benhNhan',
            'loaiBenh',
            'bacSi',
            'dichVu',
            'ctDichVuPhu.dichVu',
        ])->find($id);
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
        // Kiểm tra quyền: Lễ tân hoặc admin được tạo phiếu khám rỗng (chờ khám)
        $user = $request->user();
        if (!RoleHelper::canReceptionistCreateTiepNhan($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền tạo phiếu khám. Chỉ lễ tân mới được phép thực hiện chức năng này.',
            ], 403);
        }

        $request->validate([
            'ID_TiepNhan' => 'required|integer|exists:danh_sach_tiep_nhan,ID_TiepNhan',
            'CaKham' => 'required|string|max:10',
        ]);

        // Lấy thông tin tiếp nhận
        $tiepNhan = \App\Models\DanhSachTiepNhan::with('benhNhan')->find($request->ID_TiepNhan);
        
        if (!$tiepNhan) {
            return response()->json(['message' => 'Không tìm thấy thông tin tiếp nhận'], 404);
        }

        // Validation: Kiểm tra điều kiện nghiệp vụ
        // Option B: chỉ cho phép bác sĩ tạo phiếu khám khi tiếp nhận đã được lễ tân xác nhận (CHO_KHAM)
        if (($tiepNhan->TrangThaiTiepNhan ?? null) !== 'CHO_KHAM') {
            return response()->json([
                'message' => 'Tiếp nhận này chưa được lễ tân xác nhận hoặc không ở trạng thái chờ khám',
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

        // Tạo phiếu khám rỗng (chờ khám)
        $phieuKham = PhieuKham::create([
            'ID_TiepNhan' => $request->ID_TiepNhan,
            'ID_BacSi' => null,
            'CaKham' => $request->CaKham,
            'TrieuChung' => null,
            'ChanDoan' => null,
            'ID_LoaiBenh' => 1,
            'TienKham' => null,
            'TongTienThuoc' => 0,
            'TrangThai' => 'ChoKham',
            'Is_Deleted' => false,
        ]);

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

        $phieuKham = PhieuKham::with(['tiepNhan.benhNhan', 'loaiBenh', 'bacSi', 'dichVu', 'ctDichVuPhu.dichVu'])->find($id);
        
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Không tìm thấy phiếu khám'], 404);
        }
        
        // Kiểm tra bác sĩ chỉ được sửa phiếu khám của chính mình (trừ admin)
        // Nếu phiếu chưa có bác sĩ phụ trách (ID_BacSi null) thì cho phép cập nhật và sẽ auto-claim khi bắt đầu khám.
        $nhanVien = $user->nhanVien ?? $user->nhan_vien;
        $doctorId = $nhanVien?->ID_NhanVien;
        if (!RoleHelper::isRole($user, '@admin') && $phieuKham->ID_BacSi && $phieuKham->ID_BacSi !== $doctorId) {
            return response()->json([
                'message' => 'Bạn chỉ được phép cập nhật phiếu khám do chính mình tạo.',
            ], 403);
        }

        $request->validate([
            'TrieuChung' => 'nullable|string|max:255',
            'ChanDoan' => 'nullable|string|max:255',
            'ID_LoaiBenh' => 'nullable|integer|exists:loai_benh,ID_LoaiBenh',
            'TienKham' => 'nullable|numeric|min:0',
            'ID_DichVu' => 'nullable|integer|exists:dich_vu,ID_DichVu',
            'TrangThai' => 'nullable|string|in:ChoKham,DangKham,DaKham',
        ]);

        $payload = $request->only(['TrieuChung', 'ChanDoan', 'ID_LoaiBenh', 'TrangThai']);
        if (RoleHelper::isRole($user, '@admin')) {
            $payload['TienKham'] = $request->input('TienKham');
        }

        // Tính tiền khám: Lấy từ quy định, nếu có dịch vụ thì cộng thêm giá dịch vụ
        $tienKhamQuyDinh = (float) QuiDinh::getValue('TienKham', 0);
        
        // Bác sĩ chọn dịch vụ khám
        if ($request->has('ID_DichVu')) {
            $idDichVu = $request->input('ID_DichVu');
            if ($idDichVu === null) {
                $payload['ID_DichVu'] = null;
                // Nếu bỏ chọn dịch vụ, chỉ lấy tiền khám từ quy định
                $payload['TienKham'] = $tienKhamQuyDinh;
            } else {
                $dichVu = DichVu::query()->where('Is_Deleted', false)->find($idDichVu);
                if (!$dichVu) {
                    return response()->json([
                        'message' => 'Dịch vụ không hợp lệ hoặc đã bị xoá',
                    ], 422);
                }

                $payload['ID_DichVu'] = $dichVu->ID_DichVu;
                // Tính tiền khám: Tiền khám từ quy định + Đơn giá dịch vụ
                $donGiaDichVu = (float) $dichVu->DonGia;
                $payload['TienKham'] = $tienKhamQuyDinh + $donGiaDichVu;
            }
        } else {
            // Nếu không có thay đổi dịch vụ, giữ nguyên hoặc lấy từ quy định nếu chưa có
            if (!isset($payload['TienKham']) && !$phieuKham->TienKham) {
                $payload['TienKham'] = $tienKhamQuyDinh;
            }
        }

        if (($payload['TrangThai'] ?? null) === 'DangKham') {
            $nhanVien = $user->nhanVien ?? $user->nhan_vien;
            if (!$nhanVien || !$nhanVien->ID_NhanVien) {
                return response()->json([
                    'message' => 'Không tìm thấy thông tin bác sĩ. Vui lòng đăng nhập lại.',
                ], 400);
            }

            if (!RoleHelper::isRole($user, '@admin')) {
                $doctorId = (int) $nhanVien->ID_NhanVien;

                $doctorBusy = PhieuKham::where('Is_Deleted', false)
                    ->where('TrangThai', 'DangKham')
                    ->where('ID_BacSi', $doctorId)
                    ->where('ID_PhieuKham', '!=', (int) $phieuKham->ID_PhieuKham)
                    ->with(['tiepNhan.benhNhan', 'bacSi'])
                    ->first();

                if ($doctorBusy) {
                    return response()->json([
                        'message' => 'Bác sĩ đang khám cho một bệnh nhân khác. Vui lòng hoàn tất phiếu khám đang khám trước.',
                        'conflict_type' => 'DOCTOR_BUSY',
                        'conflict' => $doctorBusy,
                    ], 409);
                }

                $patientId = $phieuKham->tiepNhan?->ID_BenhNhan;
                if ($patientId) {
                    $patientBusy = PhieuKham::where('Is_Deleted', false)
                        ->where('TrangThai', 'DangKham')
                        ->where('ID_PhieuKham', '!=', (int) $phieuKham->ID_PhieuKham)
                        ->whereHas('tiepNhan', function ($q) use ($patientId) {
                            $q->where('ID_BenhNhan', (int) $patientId);
                        })
                        ->with(['tiepNhan.benhNhan', 'bacSi'])
                        ->first();

                    if ($patientBusy) {
                        return response()->json([
                            'message' => 'Bệnh nhân đang có một phiếu khám khác ở trạng thái đang khám.',
                            'conflict_type' => 'PATIENT_BUSY',
                            'conflict' => $patientBusy,
                        ], 409);
                    }
                }
            }

            if (!$phieuKham->ID_BacSi) {
                $phieuKham->ID_BacSi = $nhanVien->ID_NhanVien;
            }

            $tiepNhan = $phieuKham->tiepNhan;
            if ($tiepNhan) {
                $tiepNhan->TrangThaiTiepNhan = 'DANG_KHAM';
                $tiepNhan->save();
            }
        }

        $phieuKham->fill($payload);
        $phieuKham->save();
        $phieuKham->load(['tiepNhan.benhNhan', 'loaiBenh', 'bacSi', 'dichVu', 'ctDichVuPhu.dichVu']);

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
        $phieuKham = PhieuKham::with(['tiepNhan.benhNhan', 'loaiBenh', 'bacSi', 'toaThuoc', 'ctDichVuPhu.dichVu'])->find($id);
        
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Không tìm thấy phiếu khám'], 404);
        }

        if (!$phieuKham->ID_DichVu) {
            return response()->json([
                'message' => 'Vui lòng chọn dịch vụ khám trước khi hoàn tất khám.',
            ], 400);
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
                    $tiepNhan->TrangThaiTiepNhan = 'DA_KHAM';
                    $tiepNhan->save();
                }

                DB::commit();
                $phieuKham->load(['tiepNhan.benhNhan', 'loaiBenh', 'bacSi', 'toaThuoc', 'ctDichVuPhu.dichVu']);

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
                $tiepNhan->TrangThaiTiepNhan = 'DA_KHAM';
                $tiepNhan->save();
            }

            DB::commit();
            $phieuKham->load(['tiepNhan.benhNhan', 'loaiBenh', 'bacSi', 'toaThuoc', 'ctDichVuPhu.dichVu']);

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
            (($tiepNhan->TrangThaiTiepNhan ?? null) === 'CHO_KHAM') &&
            $ngayTN === $today &&
            !$tiepNhan->phieuKhams()->where('Is_Deleted', false)->exists();

        return response()->json([
            'canCreate' => $canCreate,
            'reasons' => !$canCreate ? [
                'TrangThaiTiepNhan' => (($tiepNhan->TrangThaiTiepNhan ?? null) !== 'CHO_KHAM') ? 'Tiếp nhận không ở trạng thái chờ khám' : null,
                'NgayTN' => $ngayTN !== $today ? 'Không phải ngày tiếp nhận hôm nay' : null,
                'HasPhieuKham' => $tiepNhan->phieuKhams()->where('Is_Deleted', false)->exists() ? 'Đã có phiếu khám' : null,
            ] : [],
        ]);
    }

    public function addDichVuPhu(Request $request, $id)
    {
        $user = $request->user();
        if (!RoleHelper::canDoctorCreatePhieuKham($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền chọn dịch vụ phụ. Chỉ bác sĩ mới được phép thực hiện chức năng này.',
            ], 403);
        }

        $phieuKham = PhieuKham::with(['hoaDon', 'dichVu', 'ctDichVuPhu'])->find($id);
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Không tìm thấy phiếu khám'], 404);
        }

        if (($phieuKham->TrangThai ?? null) === 'DaKham' || $phieuKham->hoaDon) {
            return response()->json([
                'message' => 'Không thể thêm dịch vụ phụ sau khi phiếu khám đã hoàn tất hoặc đã lập hoá đơn.',
            ], 400);
        }

        $nhanVien = $user->nhanVien ?? $user->nhan_vien;
        $doctorId = $nhanVien?->ID_NhanVien;
        if (!RoleHelper::isRole($user, '@admin') && $phieuKham->ID_BacSi && $phieuKham->ID_BacSi !== $doctorId) {
            return response()->json([
                'message' => 'Phiếu khám này đang do bác sĩ khác phụ trách.',
            ], 403);
        }

        $request->validate([
            'ID_DichVu' => 'required|integer|exists:dich_vu,ID_DichVu',
            'SoLuong' => 'nullable|integer|min:1',
        ]);

        $dichVu = DichVu::query()->where('Is_Deleted', false)->find($request->ID_DichVu);
        if (!$dichVu) {
            return response()->json([
                'message' => 'Dịch vụ không hợp lệ hoặc đã bị xoá',
            ], 422);
        }

        $soLuong = (int) ($request->SoLuong ?? 1);
        $donGia = (float) $dichVu->DonGia;
        $thanhTien = (float) $soLuong * $donGia;

        $item = CtPhieuKhamDichVu::updateOrCreate(
            ['ID_PhieuKham' => $phieuKham->ID_PhieuKham, 'ID_DichVu' => $dichVu->ID_DichVu],
            [
                'SoLuong' => $soLuong,
                'DonGiaApDung' => $donGia,
                'ThanhTien' => $thanhTien,
                'Is_Deleted' => false,
            ]
        );

        $phieuKham->load(['ctDichVuPhu.dichVu']);

        return response()->json([
            'message' => 'Thêm dịch vụ phụ thành công',
            'data' => $phieuKham,
            'item' => $item->load('dichVu'),
        ]);
    }

    public function updateDichVuPhu(Request $request, $id, $dichVuId)
    {
        $user = $request->user();
        if (!RoleHelper::canDoctorCreatePhieuKham($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền cập nhật dịch vụ phụ. Chỉ bác sĩ mới được phép thực hiện chức năng này.',
            ], 403);
        }

        $phieuKham = PhieuKham::with(['hoaDon'])->find($id);
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Không tìm thấy phiếu khám'], 404);
        }

        if (($phieuKham->TrangThai ?? null) === 'DaKham' || $phieuKham->hoaDon) {
            return response()->json([
                'message' => 'Không thể cập nhật dịch vụ phụ sau khi phiếu khám đã hoàn tất hoặc đã lập hoá đơn.',
            ], 400);
        }

        $request->validate([
            'SoLuong' => 'required|integer|min:1',
        ]);

        $item = CtPhieuKhamDichVu::where('ID_PhieuKham', $phieuKham->ID_PhieuKham)
            ->where('ID_DichVu', (int) $dichVuId)
            ->where('Is_Deleted', false)
            ->first();

        if (!$item) {
            return response()->json(['message' => 'Không tìm thấy dịch vụ phụ trong phiếu khám'], 404);
        }

        $item->SoLuong = (int) $request->SoLuong;
        $donGia = (float) ($item->DonGiaApDung ?? 0);
        $item->ThanhTien = (float) $item->SoLuong * $donGia;
        $item->save();

        $phieuKham->load(['ctDichVuPhu.dichVu']);

        return response()->json([
            'message' => 'Cập nhật dịch vụ phụ thành công',
            'data' => $phieuKham,
            'item' => $item->load('dichVu'),
        ]);
    }

    public function removeDichVuPhu(Request $request, $id, $dichVuId)
    {
        $user = $request->user();
        if (!RoleHelper::canDoctorCreatePhieuKham($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền xoá dịch vụ phụ. Chỉ bác sĩ mới được phép thực hiện chức năng này.',
            ], 403);
        }

        $phieuKham = PhieuKham::with(['hoaDon'])->find($id);
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Không tìm thấy phiếu khám'], 404);
        }

        if (($phieuKham->TrangThai ?? null) === 'DaKham' || $phieuKham->hoaDon) {
            return response()->json([
                'message' => 'Không thể xoá dịch vụ phụ sau khi phiếu khám đã hoàn tất hoặc đã lập hoá đơn.',
            ], 400);
        }

        $item = CtPhieuKhamDichVu::where('ID_PhieuKham', $phieuKham->ID_PhieuKham)
            ->where('ID_DichVu', (int) $dichVuId)
            ->where('Is_Deleted', false)
            ->first();

        if (!$item) {
            return response()->json(['message' => 'Không tìm thấy dịch vụ phụ trong phiếu khám'], 404);
        }

        $item->Is_Deleted = true;
        $item->save();

        $phieuKham->load(['ctDichVuPhu.dichVu']);

        return response()->json([
            'message' => 'Xoá dịch vụ phụ thành công',
            'data' => $phieuKham,
        ]);
    }
}




























