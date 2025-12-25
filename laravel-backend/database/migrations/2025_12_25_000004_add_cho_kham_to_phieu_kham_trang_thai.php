<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // MySQL enum alteration
        DB::statement("ALTER TABLE phieu_kham MODIFY COLUMN TrangThai ENUM('ChoKham','DangKham','DaKham') NOT NULL DEFAULT 'ChoKham'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE phieu_kham MODIFY COLUMN TrangThai ENUM('DangKham','DaKham') NOT NULL DEFAULT 'DangKham'");
    }
};
