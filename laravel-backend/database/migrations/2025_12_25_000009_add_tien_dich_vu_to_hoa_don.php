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
        Schema::table('hoa_don', function (Blueprint $table) {
            if (!Schema::hasColumn('hoa_don', 'TienDichVu')) {
                $table->decimal('TienDichVu', 10, 2)->nullable(true)->after('TienThuoc');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hoa_don', function (Blueprint $table) {
            if (Schema::hasColumn('hoa_don', 'TienDichVu')) {
                $table->dropColumn('TienDichVu');
            }
        });
    }
};
