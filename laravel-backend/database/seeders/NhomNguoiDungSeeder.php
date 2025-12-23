<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NhomNguoiDungSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            ['TenNhom' => 'Quản trị hệ thống', 'MaNhom' => '@admin'],
            ['TenNhom' => 'Bác sĩ', 'MaNhom' => '@doctors'],
            ['TenNhom' => 'Y tá', 'MaNhom' => '@nurses'],
            ['TenNhom' => 'Lễ tân', 'MaNhom' => '@receptionists'],
            ['TenNhom' => 'Kế toán', 'MaNhom' => '@accountants'],
            ['TenNhom' => 'Thu ngân', 'MaNhom' => '@cashiers'],
            ['TenNhom' => 'Quản lý kho', 'MaNhom' => '@inventory'],
            ['TenNhom' => 'Quản lý', 'MaNhom' => '@managers'],
            ['TenNhom' => 'Bệnh nhân', 'MaNhom' => '@patient'],
        ];

        foreach ($groups as $group) {
            DB::table('nhom_nguoi_dung')->updateOrInsert(
                ['MaNhom' => $group['MaNhom']],
                ['TenNhom' => $group['TenNhom']]
            );
        }
    }
}
