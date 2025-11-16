<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CachDungSeeder extends Seeder
{
    public function run(): void
    {
        $cachDung = [
            ['MoTaCachDung' => 'Uống 1-2 viên/lần, 3-4 lần/ngày'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 3 lần/ngày'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 2 lần/ngày'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 2-3 lần/ngày'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 1 lần/ngày'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 1 lần/ngày vào buổi tối'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 2 lần/ngày với bữa ăn'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 1-2 lần/ngày'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 1 lần/ngày trước bữa ăn'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 2 lần/ngày sau bữa ăn'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 2 lần/ngày, cách nhau 12 giờ'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 1 lần/ngày, cách nhau 24 giờ'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 1 lần/ngày, uống trước bữa ăn'],
            ['MoTaCachDung' => 'Uống theo chỉ định của bác sĩ'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 2-3 lần/ngày sau bữa ăn'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 1 lần/ngày vào buổi sáng'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 1 lần/ngày vào buổi tối trước khi ngủ'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 2 lần/ngày trước bữa ăn'],
            ['MoTaCachDung' => 'Xịt 1-2 lần vào mũi, 2-3 lần/ngày'],
            ['MoTaCachDung' => 'Tiêm dưới da theo chỉ định của bác sĩ'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 3 lần/ngày sau bữa ăn'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 1 lần/ngày vào buổi sáng khi đói'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 2 lần/ngày với nhiều nước'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 1 lần/ngày sau bữa ăn tối'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 1 lần/ngày vào buổi sáng sau bữa ăn'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 2-3 lần/ngày, uống với nước'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 2-3 lần/ngày trước bữa ăn'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 1-2 lần/ngày sau bữa ăn'],
            ['MoTaCachDung' => 'Uống 1 viên/lần, 1 lần/ngày với bữa ăn'],
            ['MoTaCachDung' => 'Bôi ngoài da 2-3 lần/ngày'],
        ];

        foreach ($cachDung as $item) {
            DB::table('cach_dung')->updateOrInsert(
                ['MoTaCachDung' => $item['MoTaCachDung']],
                $item
            );
        }
    }
}

