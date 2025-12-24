<?php

namespace App\Http\Controllers;

use App\Models\DanhSachTiepNhan;
use App\Models\HoaDon;
use App\Models\NhanVien;
use App\Models\PhieuKham;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class PatientProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load('benhNhan');

        if (!$user->benhNhan) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ bệnh nhân'], 404);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'role' => $user->role,
            ],
            'benh_nhan' => $user->benhNhan,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user()->load('benhNhan');

        if (!$user->benhNhan) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ bệnh nhân'], 404);
        }

        $benhNhan = $user->benhNhan;

        $validated = $request->validate([
            'DienThoai' => 'nullable|string|max:15|unique:benh_nhan,DienThoai,' . $benhNhan->ID_BenhNhan . ',ID_BenhNhan',
            'Email' => 'nullable|email|max:255|unique:benh_nhan,Email,' . $benhNhan->ID_BenhNhan . ',ID_BenhNhan',
            'DiaChi' => 'nullable|string|max:500',
            'avatar' => 'nullable|image|max:2048',
        ]);

        foreach (['DienThoai', 'Email', 'DiaChi'] as $nullableField) {
            if (array_key_exists($nullableField, $validated) && $validated[$nullableField] === '') {
                $validated[$nullableField] = null;
            }
        }

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');

            if ($benhNhan->Avatar && Storage::disk('public')->exists($benhNhan->Avatar)) {
                Storage::disk('public')->delete($benhNhan->Avatar);
            }

            $validated['Avatar'] = $avatarPath;
        }

        if (array_key_exists('Email', $validated) && $validated['Email']) {
            $user->email = $validated['Email'];
            $user->save();
        }

        $benhNhan->fill([
            'DienThoai' => $validated['DienThoai'] ?? $benhNhan->DienThoai,
            'DiaChi' => $validated['DiaChi'] ?? $benhNhan->DiaChi,
            'Email' => $validated['Email'] ?? $benhNhan->Email,
            'Avatar' => $validated['Avatar'] ?? $benhNhan->Avatar,
        ]);
        $benhNhan->save();

        $benhNhan->refresh();
        $user->refresh()->load('benhNhan');

        return response()->json([
            'message' => 'Cập nhật hồ sơ thành công',
            'benh_nhan' => $benhNhan,
            'user' => $user,
        ]);
    }

    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Mật khẩu hiện tại không chính xác.'],
            ]);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Đổi mật khẩu thành công']);
    }

    public function medicalRecords(Request $request)
    {
        $benhNhan = $request->user()->benhNhan;

        if (!$benhNhan) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ bệnh nhân'], 404);
        }

        $records = PhieuKham::with([
            'loaiBenh:ID_LoaiBenh,TenLoaiBenh',
            'toaThuoc.thuoc:ID_Thuoc,TenThuoc,DonGiaBan',
            'hoaDon:ID_HoaDon,ID_PhieuKham,TienKham,TienThuoc,TongTien,NgayHoaDon',
            'tiepNhan:ID_TiepNhan,ID_BenhNhan,NgayTN,CaTN',
        ])
            ->where('Is_Deleted', false)
            ->whereHas('tiepNhan', function ($query) use ($benhNhan) {
                $query->where('ID_BenhNhan', $benhNhan->ID_BenhNhan);
            })
            ->orderByDesc('ID_PhieuKham')
            ->get();

        return response()->json(['data' => $records]);
    }

    public function invoices(Request $request)
    {
        $benhNhan = $request->user()->benhNhan;

        if (!$benhNhan) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ bệnh nhân'], 404);
        }

        $invoices = HoaDon::with([
            'phieuKham.loaiBenh:ID_LoaiBenh,TenLoaiBenh',
            'phieuKham.tiepNhan:ID_TiepNhan,ID_BenhNhan,NgayTN,CaTN',
        ])
            ->whereHas('phieuKham.tiepNhan', function ($query) use ($benhNhan) {
                $query->where('ID_BenhNhan', $benhNhan->ID_BenhNhan);
            })
            ->orderByDesc('NgayHoaDon')
            ->get();

        return response()->json(['data' => $invoices]);
    }

    public function appointments(Request $request)
    {
        $benhNhan = $request->user()->benhNhan;

        if (!$benhNhan) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ bệnh nhân'], 404);
        }

        $appointments = DanhSachTiepNhan::with(['nhanVien:ID_NhanVien,HoTenNV'])
            ->where('Is_Deleted', false)
            ->where('ID_BenhNhan', $benhNhan->ID_BenhNhan)
            ->orderByDesc('NgayTN')
            ->get();

        return response()->json(['data' => $appointments]);
    }

    public function storeAppointment(Request $request)
    {
        $benhNhan = $request->user()->benhNhan;

        if (!$benhNhan) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ bệnh nhân'], 404);
        }

        $validated = $request->validate([
            'NgayTN' => 'required|date|after:now',
            'CaTN' => 'required|string|max:10',
            'ID_NhanVien' => 'required|integer|exists:nhan_vien,ID_NhanVien',
        ]);

        $doctor = NhanVien::with('nhomNguoiDung')->find($validated['ID_NhanVien']);
        $doctorGroupCode = $doctor?->nhomNguoiDung?->MaNhom;
        if (!$doctor || $doctorGroupCode !== '@doctors') {
            return response()->json([
                'message' => 'Chỉ được phép chọn bác sĩ để đặt lịch khám',
                'errors' => [
                    'ID_NhanVien' => ['Nhân viên được chọn không phải bác sĩ.'],
                ],
            ], 422);
        }

        $appointment = DanhSachTiepNhan::create([
            'ID_BenhNhan' => $benhNhan->ID_BenhNhan,
            'NgayTN' => Carbon::parse($validated['NgayTN']),
            'CaTN' => $validated['CaTN'],
            'ID_NhanVien' => $doctor->ID_NhanVien,
            // Option B: Trạng thái nghiệp vụ bắt đầu là CHO_XAC_NHAN (lễ tân duyệt)
            'TrangThaiTiepNhan' => 'CHO_XAC_NHAN',
            'Is_Deleted' => false,
        ]);

        return response()->json([
            'message' => 'Đặt lịch thành công',
            'appointment' => $appointment->load('nhanVien:ID_NhanVien,HoTenNV,ChucVu'),
        ], 201);
    }

    public function cancelAppointment(Request $request, $appointment)
    {
        $benhNhan = $request->user()->benhNhan;

        if (!$benhNhan) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ bệnh nhân'], 404);
        }

        $appointment = DanhSachTiepNhan::where('ID_TiepNhan', $appointment)
            ->where('ID_BenhNhan', $benhNhan->ID_BenhNhan)
            ->first();

        if (!$appointment) {
            return response()->json(['message' => 'Không tìm thấy lịch khám'], 404);
        }

        // Option B: chỉ cho phép huỷ khi lịch còn đang chờ xác nhận
        if (($appointment->TrangThaiTiepNhan ?? null) !== 'CHO_XAC_NHAN') {
            return response()->json(['message' => 'Lịch đã được xử lý không thể huỷ'], 400);
        }

        $appointment->Is_Deleted = true;
        $appointment->save();

        return response()->json(['message' => 'Huỷ lịch thành công']);
    }

    public function notifications(Request $request)
    {
        $benhNhan = $request->user()->benhNhan;

        if (!$benhNhan) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ bệnh nhân'], 404);
        }

        $now = Carbon::now();
        $notifications = [];

        $appointments = DanhSachTiepNhan::where('ID_BenhNhan', $benhNhan->ID_BenhNhan)
            ->orderByDesc('NgayTN')
            ->limit(5)
            ->get();

        foreach ($appointments as $appointment) {
            $tt = $appointment->TrangThaiTiepNhan ?? null;
            $statusText = match ($tt) {
                'CHO_XAC_NHAN' => 'Lịch khám đang chờ lễ tân xác nhận',
                'CHO_KHAM' => 'Lịch khám đã được xác nhận',
                'DANG_KHAM' => 'Bệnh nhân đang khám',
                'DA_KHAM' => 'Bệnh nhân đã khám xong',
                'HUY' => 'Lịch khám đã bị huỷ',
                default => ($appointment->NgayTN->lessThan($now)
                    ? 'Lịch khám đã kết thúc - chờ kết quả'
                    : 'Trạng thái lịch khám chưa xác định'),
            };

            $notifications[] = [
                'type' => 'appointment',
                'title' => 'Trạng thái lịch khám',
                'message' => sprintf(
                    '%s (%s - Ca %s)',
                    $statusText,
                    $appointment->NgayTN->format('d/m/Y H:i'),
                    $appointment->CaTN
                ),
                'created_at' => $appointment->NgayTN,
            ];
        }

        $latestPhieuKham = PhieuKham::with(['loaiBenh', 'tiepNhan'])
            ->whereHas('tiepNhan', function ($query) use ($benhNhan) {
                $query->where('ID_BenhNhan', $benhNhan->ID_BenhNhan);
            })
            ->orderByDesc('ID_PhieuKham')
            ->first();

        if ($latestPhieuKham && $latestPhieuKham->tiepNhan && $latestPhieuKham->tiepNhan->NgayTN) {
            $daysSinceVisit = $latestPhieuKham->tiepNhan->NgayTN->diffInDays($now);
            if ($daysSinceVisit >= 30) {
                $notifications[] = [
                    'type' => 'reminder',
                    'title' => 'Nhắc tái khám',
                    'message' => 'Đã ' . $daysSinceVisit . ' ngày kể từ lần khám gần nhất. Vui lòng đặt lịch tái khám nếu cần.',
                    'created_at' => $now,
                ];
            }
        }

        if ($latestPhieuKham) {
            $totalMedicines = $latestPhieuKham->toaThuoc->sum('SoLuong');
            if ($totalMedicines > 0) {
                $notifications[] = [
                    'type' => 'medicine',
                    'title' => 'Theo dõi thuốc đã kê',
                    'message' => 'Bạn còn ' . $totalMedicines . ' liều thuốc trong toa gần nhất. Đừng quên uống đúng giờ!',
                    'created_at' => $now,
                ];
            }
        }

        return response()->json(['data' => $notifications]);
    }

    public function dashboard(Request $request)
    {
        $benhNhan = $request->user()->benhNhan;

        if (!$benhNhan) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ bệnh nhân'], 404);
        }

        $phieuKhams = PhieuKham::with(['loaiBenh:ID_LoaiBenh,TenLoaiBenh', 'tiepNhan.nhanVien:ID_NhanVien,HoTenNV'])
            ->whereHas('tiepNhan', function ($query) use ($benhNhan) {
                $query->where('ID_BenhNhan', $benhNhan->ID_BenhNhan);
            })
            ->get();

        $totalVisits = $phieuKhams->count();

        $diseaseTimeline = $phieuKhams->map(function ($record) {
            $visitDate = optional($record->tiepNhan)->NgayTN;

            return [
                'date' => $visitDate ? $visitDate->format('d/m/Y') : null,
                'disease' => $record->loaiBenh->TenLoaiBenh ?? 'Chưa xác định',
            ];
        })->filter(fn ($item) => $item['date'] !== null)->values();

        $doctorStats = $phieuKhams
            ->filter(fn ($record) => $record->tiepNhan && $record->tiepNhan->nhanVien)
            ->groupBy(function ($record) {
                return $record->tiepNhan->nhanVien->ID_NhanVien;
            })
            ->map(function ($group) {
                /** @var \App\Models\PhieuKham $first */
                $first = $group->first();
                return [
                    'doctor_id' => $first->tiepNhan->nhanVien->ID_NhanVien,
                    'doctor_name' => $first->tiepNhan->nhanVien->HoTenNV,
                    'visits' => $group->count(),
                ];
            })
            ->values();

        return response()->json([
            'total_visits' => $totalVisits,
            'disease_count' => $diseaseTimeline->unique('disease')->count(),
            'doctor_count' => $doctorStats->count(),
            'disease_timeline' => $diseaseTimeline,
            'doctors' => $doctorStats,
        ]);
    }
}

