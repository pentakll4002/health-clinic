<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LoaiBenhSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();
        $items = [
            ['TenLoaiBenh' => 'Cảm lạnh', 'MoTa' => 'Viêm đường hô hấp trên do virus'],
            ['TenLoaiBenh' => 'Cúm', 'MoTa' => 'Nhiễm virus cúm, sốt, đau mỏi'],
            ['TenLoaiBenh' => 'Viêm họng', 'MoTa' => 'Đau rát họng, có thể kèm sốt'],
            ['TenLoaiBenh' => 'Viêm phế quản', 'MoTa' => 'Ho có đờm, đau ngực nhẹ'],
            ['TenLoaiBenh' => 'Viêm phổi', 'MoTa' => 'Ho, khó thở, sốt'],
            ['TenLoaiBenh' => 'Hen suyễn', 'MoTa' => 'Khó thở, thở khò khè, mãn tính'],
            ['TenLoaiBenh' => 'Viêm dạ dày', 'MoTa' => 'Đau thượng vị, ợ chua'],
            ['TenLoaiBenh' => 'Trào ngược dạ dày', 'MoTa' => 'Ợ nóng, đau rát ngực'],
            ['TenLoaiBenh' => 'Tiểu đường type 2', 'MoTa' => 'Rối loạn chuyển hóa đường huyết'],
            ['TenLoaiBenh' => 'Tăng huyết áp', 'MoTa' => 'Huyết áp cao, cần theo dõi dài hạn'],
            ['TenLoaiBenh' => 'Rối loạn mỡ máu', 'MoTa' => 'Cholesterol/triglycerid tăng'],
            ['TenLoaiBenh' => 'Đau thần kinh tọa', 'MoTa' => 'Đau lan dọc chân do chèn ép dây thần kinh'],
            ['TenLoaiBenh' => 'Thoái hóa cột sống', 'MoTa' => 'Đau lưng, hạn chế vận động'],
            ['TenLoaiBenh' => 'Viêm khớp dạng thấp', 'MoTa' => 'Đau, sưng, cứng khớp buổi sáng'],
            ['TenLoaiBenh' => 'Dị ứng', 'MoTa' => 'Nổi mề đay, ngứa, có thể kèm khó thở'],
            ['TenLoaiBenh' => 'Viêm xoang', 'MoTa' => 'Đau nhức xoang, nghẹt mũi, chảy dịch'],
            ['TenLoaiBenh' => 'Viêm tai giữa', 'MoTa' => 'Đau tai, có thể chảy dịch'],
            ['TenLoaiBenh' => 'Thiếu máu', 'MoTa' => 'Mệt mỏi, hoa mắt, thiếu hồng cầu'],
            ['TenLoaiBenh' => 'Gout', 'MoTa' => 'Đau, sưng khớp, acid uric cao'],
            ['TenLoaiBenh' => 'Nhiễm trùng tiết niệu', 'MoTa' => 'Tiểu buốt, tiểu rắt, có thể sốt'],
        ];

        foreach ($items as $item) {
            DB::table('loai_benh')->updateOrInsert(
                ['TenLoaiBenh' => $item['TenLoaiBenh']],
                [
                    'MoTa' => $item['MoTa'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }
}














