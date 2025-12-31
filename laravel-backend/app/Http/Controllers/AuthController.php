<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use App\Models\BenhNhan;
use Illuminate\Support\Facades\Mail;
use App\Helpers\RoleHelper;
use App\Models\ChucNang;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'email', 'unique:users', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
            'HoTenBN' => ['required', 'string', 'max:500'],
            'NgaySinh' => ['required', 'date'],
            'GioiTinh' => ['required', 'string', 'max:10'],
            'CCCD' => ['nullable', 'string', 'max:20', 'unique:benh_nhan'],
            'DienThoai' => ['nullable', 'string', 'max:15', 'unique:benh_nhan'],
            'DiaChi' => ['nullable', 'string', 'max:500'],
        ]);

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'patient',
        ]);

        BenhNhan::create([
            'HoTenBN' => $request->HoTenBN,
            'NgaySinh' => $request->NgaySinh,
            'GioiTinh' => $request->GioiTinh,
            'CCCD' => $request->CCCD ?? null,
            'DienThoai' => $request->DienThoai ?? null,
            'DiaChi' => $request->DiaChi ?? null,
            'Email' => $request->email,
            'NgayDK' => now()->toDateString(),
            'user_id' => $user->id,
        ]);

        return response()->json(['message' => 'Registration successful'], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($request->only('email', 'password')))
        {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        $user = Auth::user();
        // Load relationships để frontend có thể lấy role code
        $user->load('nhanVien.nhomNguoiDung', 'benhNhan');
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        // Always return the same message for security - don't reveal if email exists or not
        if (!$user) {
            return response()->json([
                'message' => 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu trong vòng vài phút.',
            ]);
        }

        // Generate OTP for password reset
        $otp = rand(100000, 999999);
        $expired = now()->addMinutes(10);

        // Store OTP in password_reset_tokens table
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'otp' => $otp,
                'otp_het_han' => $expired,
                'token' => Str::random(40),
                'created_at' => now(),
            ]
        );

        // Queue the OTP email for password reset
        Mail::to($request->email)->queue(new \App\Mail\SendOtpMail($otp, $request->email));

        return response()->json([
            'message' => 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu trong vòng vài phút.',
        ]);
    }

    public function requestOtp(Request $request)
    {
        try {
            $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'string', 'min:8'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Format errors to be more readable
            $errors = $e->errors();
            $errorMessages = [];
            
            foreach ($errors as $field => $messages) {
                $fieldName = match($field) {
                    'name' => 'Tên',
                    'email' => 'Email',
                    'password' => 'Mật khẩu',
                    default => $field
                };
                
                // Customize email error message
                if ($field === 'email' && in_array('The email has already been taken.', $messages)) {
                    $errorMessages[$field] = 'Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc <a href="/forgot-password" style="color: #0066cc; text-decoration: underline;">đặt lại mật khẩu</a> nếu bạn quên mật khẩu.';
                } else {
                    $errorMessages[$field] = "$fieldName: " . implode(', ', $messages);
                }
            }
            
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $errorMessages
            ], 422);
        }
        
        $otp = rand(100000, 999999);
        $expired = now()->addMinutes(10);

        // Store OTP in password_reset_tokens table
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'ho_ten' => $request->name,
                'mat_khau' => Hash::make($request->password),
                'otp' => $otp,
                'otp_het_han' => $expired,
                'token' => Str::random(40),
                'created_at' => now(),
            ]
        );

        // Queue the OTP email (will be sent asynchronously)
        Mail::to($request->email)->queue(new \App\Mail\SendOtpMail($otp, $request->email));
        
        return response()->json(['message' => 'OTP đã được gửi đến email của bạn', 'email' => $request->email, 'expired' => $expired]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'string'],
        ]);
        
        // Get record from password_reset_tokens table
        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('otp', $request->otp)
            ->first();
            
        if (!$record) {
            return response()->json(['message' => 'OTP không đúng hoặc không tồn tại!'], 400);
        }
        
        if (now()->greaterThan($record->otp_het_han)) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'OTP đã hết hạn!'], 400);
        }
        
        // Check if user already exists
        if (User::where('email', $record->email)->exists()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Email đã được đăng ký trong hệ thống!'], 400);
        }
        
        // Check if patient already exists with this email but no user account
        $existingPatient = BenhNhan::where('Email', $record->email)->first();

        // Create user
        $user = User::create([
            'email' => $record->email,
            'password' => $record->mat_khau,
            'role' => 'patient',
        ]);

        // If patient already exists, link user to it; otherwise create new patient
        if ($existingPatient) {
            // Update existing patient with user_id and update info if provided
            $existingPatient->update([
                'HoTenBN' => $record->ho_ten ?? $existingPatient->HoTenBN,
                'user_id' => $user->id,
            ]);
        } else {
            // Create new patient record
            BenhNhan::create([
                'HoTenBN' => $record->ho_ten,
                'NgaySinh' => null,
                'GioiTinh' => null,
                'CCCD' => null,
                'DienThoai' => null,
                'DiaChi' => null,
                'Email' => $record->email,
                'NgayDK' => now()->toDateString(),
                'user_id' => $user->id,
            ]);
        }
        
        // Delete the record
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();
        
        return response()->json(['message' => 'Đăng ký xác thực thành công!'], 201);
    }

    public function verifyForgotPasswordOtp(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'string'],
        ]);

        // Get record from password_reset_tokens table
        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('otp', $request->otp)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Mã xác nhận không đúng hoặc không tồn tại!'], 400);
        }

        if (now()->greaterThan($record->otp_het_han)) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Mã xác nhận đã hết hạn!'], 400);
        }

        // Generate a temporary token for password reset
        $resetToken = Str::random(40);
        
        // Update the record with the reset token
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->update([
                'token' => $resetToken,
                'otp' => null,
                'otp_het_han' => null,
            ]);

        return response()->json([
            'message' => 'Xác nhận OTP thành công!',
            'token' => $resetToken,
            'email' => $request->email
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        // Verify the reset token in password_reset_tokens table
        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Mã xác nhận không đúng hoặc đã hết hạn!'], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        // Update password
        $user->forceFill([
            'password' => Hash::make($request->password),
            'remember_token' => Str::random(60),
        ])->save();

        // Delete the reset token record
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Đặt lại mật khẩu thành công!']);
    }

    public function userProfile(Request $request)
    {
        $user = $request->user();
        
        // Load relationships với cả snake_case và camelCase để đảm bảo tương thích
        $user->load([
            'nhanVien' => function($query) {
                $query->with('nhomNguoiDung');
            },
            'benhNhan'
        ]);
        
        // Đảm bảo relationship được serialize đúng
        $userData = $user->toArray();
        
        // Debug: Log để kiểm tra
        \Log::info('User Profile Response', [
            'user_id' => $user->id,
            'has_nhan_vien' => $user->nhanVien !== null,
            'nhan_vien_id' => $user->nhanVien?->ID_NhanVien,
            'has_nhom' => $user->nhanVien?->nhomNguoiDung !== null,
            'ma_nhom' => $user->nhanVien?->nhomNguoiDung?->MaNhom,
        ]);
        
        return response()->json(['user' => $userData]);
    }

    public function myPermissions(Request $request)
    {
        $user = $request->user();

        $roleCode = RoleHelper::getRoleCode($user);
        if (!$roleCode) {
            return response()->json([
                'roleCode' => null,
                'permissions' => [],
            ]);
        }

        if ($roleCode === '@admin') {
            $all = ChucNang::query()->pluck('TenManHinhTuongUong')->toArray();
            return response()->json([
                'roleCode' => $roleCode,
                'permissions' => $all,
            ]);
        }

        $user->load('nhanVien.nhomNguoiDung.chucNangs');
        $group = $user->nhanVien?->nhomNguoiDung;

        $permissions = $group
            ? $group->chucNangs()->pluck('TenManHinhTuongUong')->toArray()
            : [];

        return response()->json([
            'roleCode' => $roleCode,
            'permissions' => $permissions,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout successful']);
    }
}
