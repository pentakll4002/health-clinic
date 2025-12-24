<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('danh_sach_tiep_nhan', function (Blueprint $table) {
            $table->string('TrangThaiTiepNhan', 20)->default('CHO_KHAM')->after('TrangThai');
        });

        // Backfill basic status for existing rows
        DB::table('danh_sach_tiep_nhan')
            ->where('Is_Deleted', false)
            ->where('TrangThai', false)
            ->update(['TrangThaiTiepNhan' => 'CHO_KHAM']);

        DB::table('danh_sach_tiep_nhan')
            ->where('Is_Deleted', false)
            ->where('TrangThai', true)
            ->update(['TrangThaiTiepNhan' => 'DA_KHAM']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('danh_sach_tiep_nhan', function (Blueprint $table) {
            $table->dropColumn('TrangThaiTiepNhan');
        });
    }
};
