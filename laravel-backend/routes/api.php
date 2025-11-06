<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NhanVienController; // Added this import
use App\Http\Controllers\NhomNguoiDungController;

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
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/nhanvien', [NhanVienController::class, 'index']); // danh sách
Route::post('/nhanvien', [NhanVienController::class, 'store']); // tạo mới
Route::get('/nhanvien/{id}', [NhanVienController::class, 'show']); // lấy chi tiết
Route::put('/nhanvien/{id}', [NhanVienController::class, 'update']); // sửa
Route::delete('/nhanvien/{id}', [NhanVienController::class, 'destroy']); // xoá

Route::get('/nhom-nguoi-dung', [NhomNguoiDungController::class, 'index']);
