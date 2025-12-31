<?php

namespace App\Http\Controllers;

use App\Models\DanhSachTiepNhan;
use App\Models\HoaDon;
use App\Models\NhanVien;
use App\Models\PhieuKham;
use App\Models\QuiDinh;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class PatientProfileController extends Controller
{
    private function minutesNow(): int
    {
        $now = Carbon::now();
        return ((int) $now->format('H')) * 60 + ((int) $now->format('i'));
    }

    private function getShiftRange(string $shift): array
    {
        // Values are minutes since midnight. Defaults match QuiDinhSeeder.
        return match ($shift) {
            'Sáng' => [
                (int) QuiDinh::getValue('GioLamViec_Sang_BatDau', 420),
                (int) QuiDinh::getValue('GioLamViec_Sang_KetThuc', 690),
            ],
            'Chiều' => [
                (int) QuiDinh::getValue('GioLamViec_Chieu_BatDau', 810),
                (int) QuiDinh::getValue('GioLamViec_Chieu_KetThuc', 1020),
            ],
            'Tối' => [
                (int) QuiDinh::getValue('GioLamViec_Toi_BatDau', 1080),
                (int) QuiDinh::getValue('GioLamViec_Toi_KetThuc', 1260),
            ],
            default => [0, 0],
        };
    }

    private function isShiftStillBookableToday(string $shift): bool
    {
        [$start, $end] = $this->getShiftRange($shift);
        $nowMinutes = $this->minutesNow();

        // If current time already passed shift end -> cannot book that shift for today.
        return $nowMinutes <= $end;
    }
    private function getAllowedShifts(): array
    {
        return ['Sáng', 'Chiều', 'Tối'];
    }

    private function suggestNextSlots(string $fromDate, ?string $shift = null, int $daysToCheck = 7): array
    {
        $allowedShifts = $this->getAllowedShifts();
        $from = Carbon::parse($fromDate)->startOfDay();

        $results = [];
        for ($i = 0; $i < $daysToCheck; $i++) {
            $date = $from->copy()->addDays($i)->toDateString();

            $checkShifts = $shift ? [$shift] : $allowedShifts;
            foreach ($checkShifts as $s) {
                $results[] = [
                    'NgayTN' => $date,
                    'CaTN' => $s,
                ];
            }
        }

        return $results;
    }
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

        $hasUpdatableField = false;
        foreach (['DienThoai', 'Email', 'DiaChi', 'Avatar'] as $field) {
            if (array_key_exists($field, $validated)) {
                $hasUpdatableField = true;
                break;
            }
        }

        if (!$hasUpdatableField) {
            Log::warning('PatientProfileController@update: No updatable fields provided', [
                'user_id' => $user->id,
                'benh_nhan_id' => $benhNhan->ID_BenhNhan,
                'content_type' => $request->header('Content-Type'),
                'keys' => array_keys($request->all()),
                'has_file_avatar' => $request->hasFile('avatar'),
            ]);

            return response()->json([
                'message' => 'Không có dữ liệu hợp lệ để cập nhật',
                'errors' => [
                    'payload' => ['Vui lòng nhập ít nhất 1 thông tin để cập nhật.'],
                ],
            ], 422);
        }

        if (array_key_exists('Email', $validated)) {
            $user->email = $validated['Email'];
            $user->save();
        }

        $payload = [];
        foreach (['DienThoai', 'DiaChi', 'Email', 'Avatar'] as $field) {
            if (array_key_exists($field, $validated)) {
                $payload[$field] = $validated[$field];
            }
        }

        $benhNhan->fill($payload);
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
            'NgayTN' => 'required|date|after_or_equal:today',
            'CaTN' => 'required|string|in:Sáng,Chiều,Tối',
            'ID_NhanVien' => 'required|integer|exists:nhan_vien,ID_NhanVien',
        ]);

        $ngayTN = Carbon::parse($validated['NgayTN'])->toDateString();
        $caTN = $validated['CaTN'];

        // 5) Đặt ca không hợp lệ / ngoài giờ làm việc (Option B: cấu hình QuiDinh)
        // For same-day booking, if the shift already ended, reject and suggest remaining shifts.
        if ($ngayTN === Carbon::today()->toDateString() && !$this->isShiftStillBookableToday($caTN)) {
            $allowedShifts = $this->getAllowedShifts();
            $availableShifts = array_values(array_filter($allowedShifts, fn ($s) => $this->isShiftStillBookableToday($s)));

            return response()->json([
                'message' => 'Không thể đặt lịch vì đã ngoài giờ làm việc của ca được chọn. Vui lòng chọn ca khác.',
                'conflict_type' => 'OUTSIDE_WORKING_HOURS',
                'conflict' => [
                    'NgayTN' => $ngayTN,
                    'CaTN' => $caTN,
                ],
                'suggestions' => [
                    'allowed_shifts' => $allowedShifts,
                    'available_shifts_today' => $availableShifts,
                    'slots' => $this->suggestNextSlots($ngayTN, null, 7),
                ],
            ], 409);
        }

        $doctor = NhanVien::with('nhomNguoiDung')->find($validated['ID_NhanVien']);
        $doctorGroupCode = $doctor?->nhomNguoiDung?->MaNhom;
        $doctorGroupCode = $doctorGroupCode
            ? (str_starts_with($doctorGroupCode, '@') ? $doctorGroupCode : ('@' . $doctorGroupCode))
            : null;
        if (!$doctor || $doctorGroupCode !== '@doctors') {
            return response()->json([
                'message' => 'Chỉ được phép chọn bác sĩ để đặt lịch khám',
                'errors' => [
                    'ID_NhanVien' => ['Nhân viên được chọn không phải bác sĩ.'],
                ],
            ], 422);
        }

        // 1) Vượt quá số bệnh nhân tối đa trong ngày
        $soBenhNhanToiDa = (int) QuiDinh::getValue('SoBenhNhanToiDa', 50);
        $soBenhNhanHienTai = DanhSachTiepNhan::whereDate('NgayTN', $ngayTN)
            ->where('Is_Deleted', false)
            ->count();

        if ($soBenhNhanHienTai >= $soBenhNhanToiDa) {
            return response()->json([
                'message' => "Đã đạt số bệnh nhân tối đa trong ngày ({$soBenhNhanHienTai}/{$soBenhNhanToiDa}). Vui lòng chọn ngày/ca khác.",
                'conflict_type' => 'MAX_DAILY_PATIENTS',
                'conflict' => [
                    'NgayTN' => $ngayTN,
                    'current' => $soBenhNhanHienTai,
                    'max' => $soBenhNhanToiDa,
                ],
                'suggestions' => [
                    'slots' => $this->suggestNextSlots($ngayTN, null, 7),
                    'allowed_shifts' => $this->getAllowedShifts(),
                ],
            ], 409);
        }

        // 2) Bệnh nhân đã có lịch trong ngày/ca (chặn đặt thêm)
        $duplicatePatient = DanhSachTiepNhan::where('ID_BenhNhan', $benhNhan->ID_BenhNhan)
            ->whereDate('NgayTN', $ngayTN)
            ->where('CaTN', $caTN)
            ->where('Is_Deleted', false)
            ->first();

        if ($duplicatePatient) {
            return response()->json([
                'message' => 'Bạn đã có lịch khám trong ngày/ca này. Vui lòng chọn ngày/ca khác.',
                'conflict_type' => 'PATIENT_DUPLICATE_APPOINTMENT',
                'conflict' => [
                    'ID_TiepNhan' => $duplicatePatient->ID_TiepNhan,
                    'NgayTN' => optional($duplicatePatient->NgayTN)->toDateString() ?? $ngayTN,
                    'CaTN' => $duplicatePatient->CaTN,
                    'TrangThaiTiepNhan' => $duplicatePatient->TrangThaiTiepNhan,
                ],
                'suggestions' => [
                    'slots' => $this->suggestNextSlots($ngayTN, null, 7),
                    'allowed_shifts' => $this->getAllowedShifts(),
                ],
            ], 409);
        }

        // 3) Trùng lịch theo bác sĩ + ngày + ca
        $doctorBusy = DanhSachTiepNhan::where('ID_NhanVien', $doctor->ID_NhanVien)
            ->whereDate('NgayTN', $ngayTN)
            ->where('CaTN', $caTN)
            ->where('Is_Deleted', false)
            ->first();

        if ($doctorBusy) {
            return response()->json([
                'message' => 'Bác sĩ đã có lịch trùng ngày và ca. Vui lòng chọn khung giờ khác.',
                'conflict_type' => 'DOCTOR_SLOT_CONFLICT',
                'conflict' => [
                    'ID_TiepNhan' => $doctorBusy->ID_TiepNhan,
                    'ID_NhanVien' => $doctor->ID_NhanVien,
                    'NgayTN' => optional($doctorBusy->NgayTN)->toDateString() ?? $ngayTN,
                    'CaTN' => $doctorBusy->CaTN,
                    'TrangThaiTiepNhan' => $doctorBusy->TrangThaiTiepNhan,
                ],
                'suggestions' => [
                    'slots' => $this->suggestNextSlots($ngayTN, null, 7),
                    'allowed_shifts' => $this->getAllowedShifts(),
                ],
            ], 409);
        }

        $appointment = DanhSachTiepNhan::create([
            'ID_BenhNhan' => $benhNhan->ID_BenhNhan,
            'NgayTN' => Carbon::parse($ngayTN),
            'CaTN' => $caTN,
            'ID_NhanVien' => $doctor->ID_NhanVien,
            // Option B: Trạng thái nghiệp vụ bắt đầu là CHO_XAC_NHAN (lễ tân duyệt)
            'TrangThaiTiepNhan' => 'CHO_XAC_NHAN',
            'Is_Deleted' => false,
        ]);

        return response()->json([
            'message' => 'Đặt lịch thành công',
            'appointment' => $appointment->load('nhanVien:ID_NhanVien,HoTenNV'),
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

