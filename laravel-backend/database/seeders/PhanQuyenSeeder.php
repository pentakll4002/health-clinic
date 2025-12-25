<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PhanQuyenSeeder extends Seeder
{
    public function run(): void
    {
        $roleCodes = [
            'admin',
            'doctors',
            'receptionists',
            'managers',
            'patient',
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
            'admin' => array_keys($chucNangs),

            // Bác sĩ: khám bệnh, kê toa, xem lịch sử (gộp quyền y tá)
            'doctors' => [
                'examine-patients',
                'prescribe-medicine',
                'view-medical-history',
                'register-patient',
                'intake-patient',
                'schedule-appointments',
                'search-patient',
            ],

            // Lễ tân – Thu ngân: tiếp nhận + lập & xử lý hóa đơn
            'receptionists' => [
                'register-patient',
                'intake-patient',
                'schedule-appointments',
                'search-patient',
                'manage-invoices',
                'process-payments',
                'dispense-medicine',
                'print-invoices',
                'invoice-list',
            ],

            // Quản lý: báo cáo + cấu hình (gộp accountants + inventory)
            'managers' => [
                'import-inventory',
                'manage-inventory',
                'inventory-alerts',
                'manage-drugs',
                'view-revenue',
                'manage-reports',
                'monitor-operations',
                'monitor-staff',
            ],

            // Bệnh nhân: portal (nếu có các chức năng tương ứng trong chuc_nang)
            'patient' => [
                'view-medical-history',
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






