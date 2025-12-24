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
        Schema::table('nhom_nguoi_dung', function (Blueprint $table) {
            if (!Schema::hasColumn('nhom_nguoi_dung', 'MaNhom')) {
                $table->string('MaNhom', 50)->after('TenNhom')->unique();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nhom_nguoi_dung', function (Blueprint $table) {
            if (Schema::hasColumn('nhom_nguoi_dung', 'MaNhom')) {
                $table->dropColumn('MaNhom');
            }
        });
    }
};



































