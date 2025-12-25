<?php

namespace Database\Seeders;

use App\Models\DichVu;
use Illuminate\Database\Seeder;

class DichVuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaults = [
            ['TenDichVu' => 'Khám thường', 'DonGia' => 100000],
            ['TenDichVu' => 'Khám chuyên sâu', 'DonGia' => 200000],
            ['TenDichVu' => 'Tái khám', 'DonGia' => 50000],
        ];

        foreach ($defaults as $item) {
            DichVu::updateOrCreate(
                ['TenDichVu' => $item['TenDichVu']],
                [
                    'DonGia' => $item['DonGia'],
                    'Is_Deleted' => false,
                ]
            );
        }
    }
}
