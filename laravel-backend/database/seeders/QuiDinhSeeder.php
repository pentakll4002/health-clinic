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
        ];

        foreach ($quyDinhs as $quyDinh) {
            QuiDinh::updateOrCreate(
                ['TenQuyDinh' => $quyDinh['TenQuyDinh']],
                ['GiaTri' => $quyDinh['GiaTri']]
            );
        }
    }
}







