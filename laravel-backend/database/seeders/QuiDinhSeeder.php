<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\QuiDinh;

class QuiDinhSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $quyDinhs = [
            [
                'TenQuyDinh' => 'SoBenhNhanToiDa',
                'GiaTri' => 50, // Số bệnh nhân tối đa trong ngày
            ],
            [
                'TenQuyDinh' => 'TienKham',
                'GiaTri' => 50000, // Tiền khám mặc định (VNĐ) - lấy từ quy định
            ],
            [
                'TenQuyDinh' => 'TyLeGiaBan',
                'GiaTri' => 0.2, // Tỷ lệ đơn giá bán thuốc (%) - dùng để tính giá bán từ giá nhập
            ],
            [
                'TenQuyDinh' => 'GioLamViec_Sang_BatDau',
                'GiaTri' => 420, // 07:00
            ],
            [
                'TenQuyDinh' => 'GioLamViec_Sang_KetThuc',
                'GiaTri' => 690, // 11:30
            ],
            [
                'TenQuyDinh' => 'GioLamViec_Chieu_BatDau',
                'GiaTri' => 810, // 13:30
            ],
            [
                'TenQuyDinh' => 'GioLamViec_Chieu_KetThuc',
                'GiaTri' => 1020, // 17:00
            ],
            [
                'TenQuyDinh' => 'GioLamViec_Toi_BatDau',
                'GiaTri' => 1080, // 18:00
            ],
            [
                'TenQuyDinh' => 'GioLamViec_Toi_KetThuc',
                'GiaTri' => 1260, // 21:00
            ],
        ];

        foreach ($quyDinhs as $quyDinh) {
            QuiDinh::updateOrCreate(
                ['TenQuyDinh' => $quyDinh['TenQuyDinh']],
                ['GiaTri' => $quyDinh['GiaTri']]
            );
        }
    }
}







