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
            if (Schema::hasColumn('danh_sach_tiep_nhan', 'TrangThai')) {
                $table->dropColumn('TrangThai');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('danh_sach_tiep_nhan', function (Blueprint $table) {
            if (!Schema::hasColumn('danh_sach_tiep_nhan', 'TrangThai')) {
                $table->boolean('TrangThai')->default(0);
            }
        });
    }
};
