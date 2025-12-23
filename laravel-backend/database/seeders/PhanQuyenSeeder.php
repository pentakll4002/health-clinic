<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PhanQuyenSeeder extends Seeder
{
    public function run(): void
    {
        $roleCodes = [
            '@admin',
            '@doctors',
            '@nurses',
            '@receptionists',
            '@cashiers',
            '@inventory',
            '@managers',
            '@accountants',
        ];
        $groups = DB::table('nhom_nguoi_dung')
            ->whereIn('MaNhom', $roleCodes)
            ->pluck('ID_Nhom', 'MaNhom')
            ->toArray();

        $chucNangs = DB::table('chuc_nang')
            ->pluck('ID_ChucNang', 'TenManHinhTuongUong')
            ->toArray();

        if (empty($chucNangs)) {
            $this->command->warn('Chưa có chức năng nào. Vui lòng chạy ChucNangSeeder trước.');
            return;
        }

        $rolePermissions = [
            // Admin: toàn quyền trên tất cả chức năng
            '@admin' => array_keys($chucNangs),

            // Bác sĩ: khám bệnh, kê toa, xem lịch sử
            '@doctors' => [
                'examine-patients',
                'prescribe-medicine',
                'view-medical-history',
            ],

            // Y tá: hỗ trợ khám & tiếp nhận, KHÔNG chẩn đoán/kê toa
            '@nurses' => [
                'register-patient',
                'intake-patient',
                'schedule-appointments',
                'search-patient',
                'view-medical-history',
            ],

            // Lễ tân: tiếp nhận, đăng ký, lịch hẹn, tra cứu
            '@receptionists' => [
                'register-patient',
                'intake-patient',
                'schedule-appointments',
                'search-patient',
            ],

            // Thu ngân: lập & xử lý hóa đơn
            '@cashiers' => [
                'manage-invoices',
                'process-payments',
                'dispense-medicine',
                'print-invoices',
                'invoice-list',
            ],

            // Quản lý kho: nhập thuốc, quản lý tồn kho, cảnh báo
            '@inventory' => [
                'import-inventory',
                'manage-inventory',
                'inventory-alerts',
                'manage-drugs',
            ],

            // Quản lý: xem báo cáo, giám sát hoạt động
            '@managers' => [
                'view-revenue',
                'manage-reports',
                'monitor-operations',
                'monitor-staff',
            ],

            // Kế toán: tài chính & báo cáo, KHÔNG lập hóa đơn
            '@accountants' => [
                'view-revenue',
                'manage-reports',
                'invoice-list',
            ],
        ];

        $now = now();

        foreach ($rolePermissions as $roleCode => $permissions) {
            if (!isset($groups[$roleCode])) {
                $this->command->warn("Chưa có nhóm người dùng {$roleCode}.");
                continue;
            }

            foreach ($permissions as $screen) {
                if (!isset($chucNangs[$screen])) {
                    $this->command->warn("Chưa định nghĩa chức năng {$screen}.");
                    continue;
                }

                DB::table('phan_quyen')->updateOrInsert(
                    [
                        'ID_Nhom' => $groups[$roleCode],
                        'ID_ChucNang' => $chucNangs[$screen],
                    ],
                    [
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );
            }
        }
    }
}






