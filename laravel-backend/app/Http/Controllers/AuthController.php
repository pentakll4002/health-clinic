<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use App\Models\BenhNhan;
use App\Models\PendingRegister;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'unique:users', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
            'NgaySinh' => ['nullable', 'date'],
            'GioiTinh' => ['nullable', 'string', 'max:10'],
            'CCCD' => ['nullable', 'string', 'max:20', 'unique:benh_nhan'],
            'DienThoai' => ['nullable', 'string', 'max:15', 'unique:benh_nhan'],
            'DiaChi' => ['nullable', 'string', 'max:500'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'patient',
        ]);

        BenhNhan::create([
            'HoTenBN' => $request->name,
            'NgaySinh' => $request->NgaySinh ?? null,
            'GioiTinh' => $request->GioiTinh ?? null,
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

        if (!$user) {
            return response()->json(['message' => 'We could not find a user with that email address.'], 404);
        }

        $token = Password::broker()->createToken($user);

        return response()->json([
            'message' => 'Password reset link sent to your email.',
            'token' => $token,
            'email' => $user->email
        ]);
    }

    public function requestOtp(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
        ]);
        $otp = rand(100000, 999999);
        $expired = now()->addMinutes(10);

        PendingRegister::updateOrCreate(
            ['email' => $request->email],
            [
                'name' => $request->name,
                'password' => Hash::make($request->password),
                'otp' => $otp,
                'otp_expired_at' => $expired,
            ]
        );

        Mail::raw("Mã xác thực OTP đăng ký tài khoản của bạn là: $otp", function (
            $message
        ) use ($request) {
            $message->to($request->email)
                ->subject('Xác thực OTP đăng ký tài khoản');
        });
        return response()->json(['message' => 'OTP sent to email', 'email' => $request->email, 'expired' => $expired]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'string'],
        ]);
        $pending = PendingRegister::where('email', $request->email)
            ->where('otp', $request->otp)
            ->first();
        if (!$pending) {
            return response()->json(['message' => 'OTP không đúng hoặc không tồn tại!'], 400);
        }
        if (now()->greaterThan($pending->otp_expired_at)) {
            return response()->json(['message' => 'OTP đã hết hạn!'], 400);
        }
        // Kiểm tra lại các trường unique trước khi tạo
        if (
            \App\Models\User::where('email', $pending->email)->exists() ||
            \App\Models\BenhNhan::where('Email', $pending->email)->exists()
        ) {
            $pending->delete();
            return response()->json(['message' => 'Email đã tồn tại, vui lòng dùng email khác!'], 400);
        }
        // Tạo user role patient
        $user = User::create([
            'name' => $pending->name,
            'email' => $pending->email,
            'password' => $pending->password,
            'role' => 'patient',
        ]);

        BenhNhan::create([
            'HoTenBN' => $pending->name,
            'NgaySinh' => null,
            'GioiTinh' => null,
            'CCCD' => null,
            'DienThoai' => null,
            'DiaChi' => null,
            'Email' => $pending->email,
            'NgayDK' => now()->toDateString(),
            'user_id' => $user->id,
        ]);
        $pending->delete();
        return response()->json(['message' => 'Đăng ký xác thực thành công!'], 201);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Password::broker()->tokenExists($user, $request->token)) {
            throw ValidationException::withMessages([
                'token' => ['This password reset token is invalid or has expired.'],
            ]);
        }

        $user->forceFill([
            'password' => Hash::make($request->password),
            'remember_token' => Str::random(60),
        ])->save();

        Password::broker()->deleteToken($user);

        return response()->json(['message' => 'Password reset successfully.']);
    }

    public function userProfile(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout successful']);
    }
}
