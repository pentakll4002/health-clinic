<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NhanVienController; // Added this import
use App\Http\Controllers\NhomNguoiDungController;
use App\Http\Controllers\ThuocController;
use App\Http\Controllers\DanhSachTiepNhanController;
use App\Http\Controllers\BenhNhanController;
use App\Http\Controllers\PhieuKhamController;
use App\Http\Controllers\ToaThuocController;
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
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
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
Route::get('/appointments/{id}', [DanhSachTiepNhanController::class, 'show']); // lấy chi tiết
Route::put('/appointments/{id}', [DanhSachTiepNhanController::class, 'update']); // sửa
Route::delete('/appointments/{id}', [DanhSachTiepNhanController::class, 'destroy']); // xoá

// PhieuKham (Examination Form) routes
Route::get('/phieu-kham', [PhieuKhamController::class, 'index']); // danh sách
Route::post('/phieu-kham', [PhieuKhamController::class, 'store']); // tạo mới
Route::get('/phieu-kham/{id}', [PhieuKhamController::class, 'show']); // lấy chi tiết
Route::put('/phieu-kham/{id}', [PhieuKhamController::class, 'update']); // sửa
Route::delete('/phieu-kham/{id}', [PhieuKhamController::class, 'destroy']); // xoá

// ToaThuoc (Prescription) routes
Route::post('/toa-thuoc', [ToaThuocController::class, 'store']); // thêm thuốc vào toa
Route::delete('/toa-thuoc/{phieuKhamId}/{thuocId}', [ToaThuocController::class, 'destroy']); // xóa thuốc khỏi toa

// LoaiBenh (Disease Type) routes
Route::get('/loai-benh', [LoaiBenhController::class, 'index']); // danh sách
Route::post('/loai-benh', [LoaiBenhController::class, 'store']); // tạo mới
Route::get('/loai-benh/{id}', [LoaiBenhController::class, 'show']); // lấy chi tiết
Route::put('/loai-benh/{id}', [LoaiBenhController::class, 'update']); // sửa
Route::delete('/loai-benh/{id}', [LoaiBenhController::class, 'destroy']); // xoá
