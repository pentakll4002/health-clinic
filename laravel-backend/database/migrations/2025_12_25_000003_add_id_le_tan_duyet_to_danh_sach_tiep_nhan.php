<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('danh_sach_tiep_nhan', function (Blueprint $table) {
            if (!Schema::hasColumn('danh_sach_tiep_nhan', 'ID_LeTanDuyet')) {
                $table->unsignedInteger('ID_LeTanDuyet')->nullable()->after('ID_NhanVien');
                $table->foreign('ID_LeTanDuyet')->references('ID_NhanVien')->on('nhan_vien');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('danh_sach_tiep_nhan', function (Blueprint $table) {
            if (Schema::hasColumn('danh_sach_tiep_nhan', 'ID_LeTanDuyet')) {
                $table->dropForeign(['ID_LeTanDuyet']);
                $table->dropColumn('ID_LeTanDuyet');
            }
        });
    }
};
