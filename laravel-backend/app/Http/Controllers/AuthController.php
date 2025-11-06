<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'unique:users', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'patient', // Default role for registration
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

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Password::broker()->tokenExists($user, $request->token)) {
            throw ValidationException::withMessages([
                'token' => ['This password reset token is invalid or has expired.'],
            ]);
        }

        return response()->json(['message' => 'OTP verified successfully.']);
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
}
