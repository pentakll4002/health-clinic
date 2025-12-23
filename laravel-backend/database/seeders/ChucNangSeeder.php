<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChucNangSeeder extends Seeder
{
    public function run(): void
    {
        $chucNangs = [
            ['TenChucNang' => 'Quản lý nhân viên', 'TenManHinhTuongUong' => 'manage-employees'],
            ['TenChucNang' => 'Phân quyền nhân viên', 'TenManHinhTuongUong' => 'manage-permissions'],
            ['TenChucNang' => 'Quản lý bệnh nhân', 'TenManHinhTuongUong' => 'manage-patients'],
            ['TenChucNang' => 'Quản lý thuốc', 'TenManHinhTuongUong' => 'manage-drugs'],
            ['TenChucNang' => 'Quản lý hoá đơn', 'TenManHinhTuongUong' => 'manage-invoices'],
            ['TenChucNang' => 'Quản lý báo cáo', 'TenManHinhTuongUong' => 'manage-reports'],
            ['TenChucNang' => 'Cấu hình hệ thống', 'TenManHinhTuongUong' => 'configure-system'],
            ['TenChucNang' => 'Khám và chẩn đoán', 'TenManHinhTuongUong' => 'examine-patients'],
            ['TenChucNang' => 'Kê đơn thuốc', 'TenManHinhTuongUong' => 'prescribe-medicine'],
            ['TenChucNang' => 'Xem lịch sử bệnh án', 'TenManHinhTuongUong' => 'view-medical-history'],
            ['TenChucNang' => 'Đăng ký bệnh nhân', 'TenManHinhTuongUong' => 'register-patient'],
            ['TenChucNang' => 'Tiếp nhận bệnh nhân', 'TenManHinhTuongUong' => 'intake-patient'],
            ['TenChucNang' => 'Đặt lịch hẹn', 'TenManHinhTuongUong' => 'schedule-appointments'],
            ['TenChucNang' => 'Tra cứu bệnh nhân', 'TenManHinhTuongUong' => 'search-patient'],
            ['TenChucNang' => 'Thanh toán hoá đơn', 'TenManHinhTuongUong' => 'process-payments'],
            ['TenChucNang' => 'Bán thuốc theo đơn', 'TenManHinhTuongUong' => 'dispense-medicine'],
            ['TenChucNang' => 'In hoá đơn', 'TenManHinhTuongUong' => 'print-invoices'],
            ['TenChucNang' => 'Quản lý danh sách hoá đơn', 'TenManHinhTuongUong' => 'invoice-list'],
            ['TenChucNang' => 'Nhập thuốc vào kho', 'TenManHinhTuongUong' => 'import-inventory'],
            ['TenChucNang' => 'Quản lý tồn kho', 'TenManHinhTuongUong' => 'manage-inventory'],
            ['TenChucNang' => 'Cảnh báo tồn kho', 'TenManHinhTuongUong' => 'inventory-alerts'],
            ['TenChucNang' => 'Xem báo cáo doanh thu', 'TenManHinhTuongUong' => 'view-revenue'],
            ['TenChucNang' => 'Giám sát hoạt động', 'TenManHinhTuongUong' => 'monitor-operations'],
            ['TenChucNang' => 'Theo dõi hiệu suất', 'TenManHinhTuongUong' => 'monitor-staff'],
        ];

        foreach ($chucNangs as $chucNang) {
            DB::table('chuc_nang')->updateOrInsert(
                ['TenManHinhTuongUong' => $chucNang['TenManHinhTuongUong']],
                ['TenChucNang' => $chucNang['TenChucNang']]
            );
        }
    }
}






