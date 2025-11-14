<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NhomNguoiDungSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('nhom_nguoi_dung')->insert([
            ['ID_Nhom' => 1, 'TenNhom' => 'Bác sĩ', 'MaNhom' => '@doctors'],
            ['ID_Nhom' => 2, 'TenNhom' => 'Y tá', 'MaNhom' => '@doctors'],
            ['ID_Nhom' => 3, 'TenNhom' => 'Lễ tân', 'MaNhom' => '@receptionists'],
        ]);
    }
}
