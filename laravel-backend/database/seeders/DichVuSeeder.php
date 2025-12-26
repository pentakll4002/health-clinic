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
            // Dịch vụ khám chính (có thể dùng làm dịch vụ chính hoặc phụ)
            ['TenDichVu' => 'Khám thường', 'DonGia' => 100000],
            ['TenDichVu' => 'Khám chuyên sâu', 'DonGia' => 200000],
            ['TenDichVu' => 'Tái khám', 'DonGia' => 50000],
            
            // Dịch vụ phụ - Xét nghiệm
            ['TenDichVu' => 'Xét nghiệm máu', 'DonGia' => 150000],
            ['TenDichVu' => 'Xét nghiệm nước tiểu', 'DonGia' => 50000],
            ['TenDichVu' => 'Xét nghiệm sinh hóa máu', 'DonGia' => 200000],
            ['TenDichVu' => 'Xét nghiệm miễn dịch', 'DonGia' => 250000],
            ['TenDichVu' => 'Xét nghiệm vi sinh', 'DonGia' => 180000],
            
            ['TenDichVu' => 'Chụp X-quang ngực', 'DonGia' => 200000],
            ['TenDichVu' => 'Chụp X-quang xương', 'DonGia' => 180000],
            ['TenDichVu' => 'Siêu âm bụng', 'DonGia' => 250000],
            ['TenDichVu' => 'Siêu âm tim', 'DonGia' => 300000],
            ['TenDichVu' => 'Siêu âm tuyến giáp', 'DonGia' => 200000],
            ['TenDichVu' => 'Chụp CT scan', 'DonGia' => 1500000],
            ['TenDichVu' => 'Chụp MRI', 'DonGia' => 2500000],
            
            // Dịch vụ phụ - Thăm dò chức năng
            ['TenDichVu' => 'Điện tim (ECG)', 'DonGia' => 150000],
            ['TenDichVu' => 'Đo huyết áp 24h', 'DonGia' => 500000],
            ['TenDichVu' => 'Đo mật độ xương', 'DonGia' => 400000],
            
            // Dịch vụ phụ - Nội soi
            ['TenDichVu' => 'Nội soi dạ dày', 'DonGia' => 800000],
            ['TenDichVu' => 'Nội soi đại tràng', 'DonGia' => 1000000],
            ['TenDichVu' => 'Nội soi tai mũi họng', 'DonGia' => 300000],
            
            // Dịch vụ phụ - Khác
            ['TenDichVu' => 'Tiêm phòng', 'DonGia' => 200000],
            ['TenDichVu' => 'Truyền dịch', 'DonGia' => 150000],
            ['TenDichVu' => 'Thay băng vết thương', 'DonGia' => 50000],
            ['TenDichVu' => 'Khâu vết thương', 'DonGia' => 200000],
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
