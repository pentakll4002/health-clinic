<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LichKham;
use App\Models\BenhNhan;
use Carbon\Carbon;

class LichKhamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy tất cả bệnh nhân từ database (không bị xóa)
        $benhNhans = BenhNhan::where('Is_Deleted', false)->get();

        // Nếu không có bệnh nhân nào, không tạo lịch khám
        if ($benhNhans->isEmpty()) {
            $this->command->warn('Không tìm thấy bệnh nhân nào. Vui lòng tạo bệnh nhân trước khi seed lịch khám.');
            return;
        }

        // Các ca khám có thể chọn
        $caKhams = ['Sáng', 'Chiều', 'Tối'];
        
        // Các trạng thái có thể chọn
        $trangThais = ['ChoXacNhan', 'DaXacNhan', 'Huy'];

        // Tạo lịch khám cho mỗi bệnh nhân
        foreach ($benhNhans as $index => $benhNhan) {
            // Mỗi bệnh nhân sẽ có 3-4 lịch khám với các trạng thái khác nhau
            
            // Lịch khám 1: Chờ xác nhận (ngày tương lai)
            LichKham::create([
                'ID_BenhNhan' => $benhNhan->ID_BenhNhan,
                'NgayKhamDuKien' => Carbon::now()->addDays(rand(1, 7))->format('Y-m-d'),
                'CaKham' => $caKhams[array_rand($caKhams)],
                'TrangThai' => 'ChoXacNhan',
                'GhiChu' => 'Lịch khám chờ xác nhận',
                'Is_Deleted' => false,
            ]);

            // Lịch khám 2: Đã xác nhận (ngày gần đây hoặc hôm nay)
            LichKham::create([
                'ID_BenhNhan' => $benhNhan->ID_BenhNhan,
                'NgayKhamDuKien' => Carbon::now()->subDays(rand(0, 3))->format('Y-m-d'),
                'CaKham' => $caKhams[array_rand($caKhams)],
                'TrangThai' => 'DaXacNhan',
                'GhiChu' => 'Lịch khám đã được xác nhận',
                'Is_Deleted' => false,
            ]);

            // Lịch khám 3: Đã hủy (ngày quá khứ)
            LichKham::create([
                'ID_BenhNhan' => $benhNhan->ID_BenhNhan,
                'NgayKhamDuKien' => Carbon::now()->subDays(rand(5, 10))->format('Y-m-d'),
                'CaKham' => $caKhams[array_rand($caKhams)],
                'TrangThai' => 'Huy',
                'GhiChu' => 'Lịch khám đã bị hủy',
                'Is_Deleted' => false,
            ]);

            // Lịch khám 4: Chờ xác nhận (ngày xa hơn trong tương lai) - chỉ cho một số bệnh nhân
            if ($index % 2 == 0) {
                LichKham::create([
                    'ID_BenhNhan' => $benhNhan->ID_BenhNhan,
                    'NgayKhamDuKien' => Carbon::now()->addDays(rand(8, 14))->format('Y-m-d'),
                    'CaKham' => $caKhams[array_rand($caKhams)],
                    'TrangThai' => 'ChoXacNhan',
                    'GhiChu' => null,
                    'Is_Deleted' => false,
                ]);
            }
        }

        $this->command->info('Đã tạo lịch khám mẫu thành công cho ' . $benhNhans->count() . ' bệnh nhân.');
    }
}








