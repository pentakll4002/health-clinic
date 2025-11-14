<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NhomNguoiDungSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            ['TenNhom' => 'Bác sĩ', 'MaNhom' => '@doctors'],
            ['TenNhom' => 'Y tá', 'MaNhom' => '@nurses'],
            ['TenNhom' => 'Lễ tân', 'MaNhom' => '@receptionists'],
            ['TenNhom' => 'Kế toán', 'MaNhom' => '@accountants'],
        ];

        foreach ($groups as $group) {
            DB::table('nhom_nguoi_dung')->updateOrInsert(
                ['MaNhom' => $group['MaNhom']],
                ['TenNhom' => $group['TenNhom']]
            );
        }
    }
}
