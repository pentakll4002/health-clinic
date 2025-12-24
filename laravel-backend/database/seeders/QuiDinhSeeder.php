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
                'TenQuyDinh' => 'SoBenhNhanToiDaNgay',
                'GiaTri' => 50, // Số bệnh nhân tối đa trong ngày
            ],
            [
                'TenQuyDinh' => 'TienKham',
                'GiaTri' => 50000, // Tiền khám mặc định (VNĐ)
            ],
            [
                'TenQuyDinh' => 'TyLeDonGiaBanThuoc',
                'GiaTri' => 50, // Tỷ lệ đơn giá bán thuốc (%)
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




