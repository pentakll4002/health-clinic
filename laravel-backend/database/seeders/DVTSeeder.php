<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DVTSeeder extends Seeder
{
    public function run(): void
    {
        $dvt = [
            ['TenDVT' => 'Viên'],
            ['TenDVT' => 'Ống'],
            ['TenDVT' => 'Lọ'],
            ['TenDVT' => 'Tuýp'],
            ['TenDVT' => 'Chai'],
        ];

        foreach ($dvt as $item) {
            DB::table('dvt')->updateOrInsert(
                ['TenDVT' => $item['TenDVT']],
                $item
            );
        }
    }
}

