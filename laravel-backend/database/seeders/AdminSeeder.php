<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\NhanVien;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Get the admin group ID
        $adminGroup = DB::table('nhom_nguoi_dung')
            ->whereIn('MaNhom', ['admin', '@admin'])
            ->first();

        if (!$adminGroup) {
            $this->command->error('Admin group (admin) does not exist. Please run NhomNguoiDungSeeder first.');
            return;
        }

        // Check if admin user already exists
        $existingUser = User::where('email', 'admin@healthclinic.com')->first();
        if ($existingUser) {
            $this->command->info('Admin user already exists. Skipping...');
            return;
        }

        // Create admin user
        $adminUser = User::create([
            'email' => 'admin@healthclinic.com',
            'password' => Hash::make('admin123456'),
            'role' => 'nhan_vien',
        ]);

        // Create admin NhanVien record
        NhanVien::create([
            'HoTenNV' => 'Quản trị viên hệ thống',
            'NgaySinh' => '1990-01-01',
            'GioiTinh' => 'Nam',
            'CCCD' => '0000000000001',
            'DienThoai' => '0000000001',
            'DiaChi' => 'Hệ thống',
            'Email' => 'admin@healthclinic.com',
            'HinhAnh' => 'admin-avatar.jpg',
            'TrangThai' => 'Đang làm việc',
            'ID_Nhom' => $adminGroup->ID_Nhom,
            'user_id' => $adminUser->id,
        ]);

        $this->command->info('Admin account created successfully!');
        $this->command->line('Email: admin@healthclinic.com');
        $this->command->line('Password: admin123456');
    }
}
