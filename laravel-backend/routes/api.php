<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NhanVienController; // Added this import
use App\Http\Controllers\NhomNguoiDungController;
use App\Http\Controllers\ThuocController;
use App\Http\Controllers\DanhSachTiepNhanController;
use App\Http\Controllers\BenhNhanController;
use App\Http\Controllers\HoaDonController;
use App\Http\Controllers\PhieuKhamController;
use App\Http\Controllers\BaoCaoDoanhThuController;
use App\Http\Controllers\BaoCaoSuDungThuocController;
use App\Http\Controllers\QuiDinhController;
use App\Http\Controllers\PatientProfileController;
use App\Http\Controllers\LichKhamController;
use App\Http\Controllers\LoaiBenhController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user-profile', [AuthController::class, 'userProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/patient/profile', [PatientProfileController::class, 'show']);
    Route::match(['put', 'patch'], '/patient/profile', [PatientProfileController::class, 'update']);
    Route::post('/patient/change-password', [PatientProfileController::class, 'changePassword']);
    Route::get('/patient/medical-records', [PatientProfileController::class, 'medicalRecords']);
    Route::get('/patient/invoices', [PatientProfileController::class, 'invoices']);
    Route::get('/patient/appointments', [PatientProfileController::class, 'appointments']);
    Route::post('/patient/appointments', [PatientProfileController::class, 'storeAppointment']);
    Route::patch('/patient/appointments/{appointment}', [PatientProfileController::class, 'cancelAppointment']);
    Route::get('/patient/notifications', [PatientProfileController::class, 'notifications']);
    Route::get('/patient/dashboard', [PatientProfileController::class, 'dashboard']);
    
    // Lịch khám routes (cho bệnh nhân)
    Route::get('/patient/lich-kham', [LichKhamController::class, 'index']); // Danh sách lịch khám của bệnh nhân
    Route::post('/patient/lich-kham', [LichKhamController::class, 'store']); // Đặt lịch khám
    Route::get('/patient/lich-kham/{id}', [LichKhamController::class, 'show']); // Chi tiết lịch khám
    Route::post('/patient/lich-kham/{id}/cancel', [LichKhamController::class, 'cancel']); // Hủy lịch khám
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/verify-forgot-password-otp', [AuthController::class, 'verifyForgotPasswordOtp']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/register/request-otp', [AuthController::class, 'requestOtp']);
Route::post('/register/verify-otp', [AuthController::class, 'verifyOtp']);

// NhanVien routes
Route::get('/nhanvien', [NhanVienController::class, 'index']); // danh sách
Route::post('/nhanvien', [NhanVienController::class, 'store']); // tạo mới
Route::get('/nhanvien/{id}', [NhanVienController::class, 'show']); // lấy chi tiết
Route::put('/nhanvien/{id}', [NhanVienController::class, 'update']); // sửa
Route::delete('/nhanvien/{id}', [NhanVienController::class, 'destroy']); // xoá

Route::get('/nhom-nguoi-dung', [NhomNguoiDungController::class, 'index']);

// BenhNhan routes
Route::get('/benh-nhan', [BenhNhanController::class, 'index']); // danh sách bệnh nhân
Route::get('/benh-nhan/{id}', [BenhNhanController::class, 'show']); // chi tiết
Route::post('/benh-nhan', [BenhNhanController::class, 'store']); // tạo
Route::put('/benh-nhan/{id}', [BenhNhanController::class, 'update']); // cập nhật
Route::delete('/benh-nhan/{id}', [BenhNhanController::class, 'destroy']); // xoá mềm

// Drug management routes
Route::get('/thuoc', [ThuocController::class, 'index']); // danh sách
Route::post('/thuoc', [ThuocController::class, 'store']); // tạo mới
Route::get('/thuoc/{id}', [ThuocController::class, 'show']); // lấy chi tiết
Route::put('/thuoc/{id}', [ThuocController::class, 'update']); // sửa
Route::delete('/thuoc/{id}', [ThuocController::class, 'destroy']); // xoá
Route::get('/dvt', [ThuocController::class, 'getDVT']); // lấy danh sách đơn vị tính
Route::get('/cach-dung', [ThuocController::class, 'getCachDung']); // lấy danh sách cách dùng

// Appointments (Danh sách tiếp nhận) routes
Route::get('/appointments', [DanhSachTiepNhanController::class, 'index']); // danh sách
Route::post('/appointments', [DanhSachTiepNhanController::class, 'store']); // tạo mới
Route::post('/appointments/from-lich-kham', [DanhSachTiepNhanController::class, 'createFromLichKham']); // tạo tiếp nhận từ lịch khám
Route::get('/appointments/{id}', [DanhSachTiepNhanController::class, 'show']); // lấy chi tiết
Route::put('/appointments/{id}', [DanhSachTiepNhanController::class, 'update']); // sửa
Route::delete('/appointments/{id}', [DanhSachTiepNhanController::class, 'destroy']); // xoá

// Medical records (Phiếu khám) routes
Route::get('/phieu-kham', [PhieuKhamController::class, 'index']);
Route::get('/phieu-kham/{id}', [PhieuKhamController::class, 'show']);
Route::post('/phieu-kham', [PhieuKhamController::class, 'store']); // Tạo phiếu khám mới
Route::put('/phieu-kham/{id}', [PhieuKhamController::class, 'update']); // Cập nhật phiếu khám
Route::post('/phieu-kham/{id}/complete', [PhieuKhamController::class, 'complete']); // Hoàn tất khám
Route::post('/phieu-kham/check-can-create', [PhieuKhamController::class, 'checkCanCreate']); // Kiểm tra có thể tạo phiếu khám

// Invoices (Hoá đơn) routes
Route::get('/invoices', [HoaDonController::class, 'index']); // danh sách
Route::get('/invoices/preview/{phieuKham}', [HoaDonController::class, 'preview']); // xem trước tiền
Route::post('/invoices', [HoaDonController::class, 'store']); // tạo mới
Route::get('/invoices/{id}', [HoaDonController::class, 'show']); // chi tiết
Route::put('/invoices/{id}', [HoaDonController::class, 'update']); // cập nhật
Route::delete('/invoices/{id}', [HoaDonController::class, 'destroy']); // xoá

// Revenue Reports (Báo cáo doanh thu) routes
Route::get('/bao-cao-doanh-thu', [BaoCaoDoanhThuController::class, 'index']); // danh sách
Route::post('/bao-cao-doanh-thu', [BaoCaoDoanhThuController::class, 'store']); // lập báo cáo mới
Route::get('/bao-cao-doanh-thu/{id}', [BaoCaoDoanhThuController::class, 'show']); // chi tiết
Route::delete('/bao-cao-doanh-thu/{id}', [BaoCaoDoanhThuController::class, 'destroy']); // xoá

// Drug Usage Reports (Báo cáo sử dụng thuốc) routes
Route::get('/bao-cao-su-dung-thuoc', [BaoCaoSuDungThuocController::class, 'index']); // danh sách
Route::post('/bao-cao-su-dung-thuoc', [BaoCaoSuDungThuocController::class, 'store']); // lập báo cáo mới
Route::get('/bao-cao-su-dung-thuoc/{id}', [BaoCaoSuDungThuocController::class, 'show']); // chi tiết
Route::delete('/bao-cao-su-dung-thuoc/{id}', [BaoCaoSuDungThuocController::class, 'destroy']); // xoá
Route::delete('/bao-cao-su-dung-thuoc', [BaoCaoSuDungThuocController::class, 'destroyByMonth']); // xoá theo tháng

// Regulations (Quy định) routes
Route::get('/qui-dinh', [QuiDinhController::class, 'index']); // lấy các quy định
Route::put('/qui-dinh', [QuiDinhController::class, 'update']); // cập nhật quy định

// Loai Benh routes
Route::get('/loai-benh', [LoaiBenhController::class, 'index']); // danh sách loại bệnh

// Lịch khám routes (cho admin/lễ tân - cần authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/lich-kham', [LichKhamController::class, 'getAll']); // Tất cả lịch khám
    Route::get('/lich-kham/{id}', [LichKhamController::class, 'show']); // Chi tiết lịch khám
    Route::put('/lich-kham/{id}', [LichKhamController::class, 'update']); // Cập nhật lịch khám
    Route::post('/lich-kham/{id}/confirm', [LichKhamController::class, 'confirm']); // Xác nhận lịch khám
    Route::delete('/lich-kham/{id}', [LichKhamController::class, 'destroy']); // Xóa lịch khám
});
